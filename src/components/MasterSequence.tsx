import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawCoverFrame } from '../utils/drawCoverFrame';
import { WebGLFog } from './WebGLFog';


gsap.registerPlugin(ScrollTrigger);

const PHASE_PLAY_SCENE_02_03_END = 0.42;
const PHASE_ABOUT_END = 0.74;
const PHASE_SCENE_07_END = 0.95;
const TRANSITION_DURATION_SCALE = 0.95;
const SCENE_07_ACCELERATION_POWER = 0.72;

interface MasterSequenceProps {
  scene02Images: HTMLImageElement[];
  scene03Images: HTMLImageElement[];
  scene07Images: HTMLImageElement[];
  isInputLocked?: boolean;
  onGlobalProgress?: (progress: number) => void;
}

export const MasterSequence: React.FC<MasterSequenceProps> = ({ 
  scene02Images, 
  scene03Images, 
  scene07Images,
  isInputLocked = false,
  onGlobalProgress 
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const lastDrawableImageRef = useRef<HTMLImageElement | null>(null);
  
  const onGlobalProgressRef = useRef(onGlobalProgress);

  useEffect(() => {
    onGlobalProgressRef.current = onGlobalProgress;
  }, [onGlobalProgress]);

  const l1 = scene02Images ? scene02Images.length : 0;
  const l2 = scene03Images ? scene03Images.length : 0;
  const l6 = scene07Images ? scene07Images.length : 0;
  const totalLength = l1 + l2 + l6;
  const preHeroLength = l1 + l2;
  const scene07Start = preHeroLength;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || totalLength === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeCallback = 0;
    let lastDrawnIndex = 0;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const getImageAtGlobalIndex = (index: number): HTMLImageElement | undefined => {
      if (index < l1) return scene02Images[index];
      if (index < l1 + l2) return scene03Images[index - l1];
      return scene07Images[index - l1 - l2];
    };

    const drawFrame = (index: number) => {
      const safeIndex = clamp(index, 0, totalLength - 1);
      const image = getImageAtGlobalIndex(safeIndex);
      const drawableImage = image ?? lastDrawableImageRef.current;

      if (!drawableImage) {
        return;
      }

      if (drawableImage.complete && drawableImage.naturalWidth > 0) {
        lastDrawableImageRef.current = drawableImage;
      }

      const { innerWidth, innerHeight } = window;
      if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
      }
      
      const isScene07 = safeIndex >= scene07Start;

      drawCoverFrame(ctx, drawableImage, { 
        zoomFactor: 1,
        objectFit: isScene07 ? 'contain' : 'cover'
      });
      lastDrawnIndex = safeIndex;
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeCallback);
      resizeCallback = requestAnimationFrame(() => drawFrame(lastDrawnIndex));
    };

    drawFrame(0);

    const playhead = { p: 0 };
    const updatePlayhead = (p: number) => {
      const clampP = clamp(p, 0, 1);
      let targetIndex = 0;

      if (clampP < PHASE_PLAY_SCENE_02_03_END) {
        if (preHeroLength > 0) {
          const subP = clampP / PHASE_PLAY_SCENE_02_03_END;
          const frameInScene02And03 = Math.min(Math.floor(subP * preHeroLength), preHeroLength - 1);
          targetIndex = frameInScene02And03;
        } else if (l6 > 0) {
          targetIndex = scene07Start;
        }
      } else if (clampP < PHASE_ABOUT_END) {
        if (preHeroLength > 0) {
          targetIndex = preHeroLength - 1;
        } else if (l6 > 0) {
          targetIndex = scene07Start;
        }
      } else if (clampP <= PHASE_SCENE_07_END) {
        if (l6 > 0) {
          const rawSubP = clamp((clampP - PHASE_ABOUT_END) / (PHASE_SCENE_07_END - PHASE_ABOUT_END), 0, 1);
          const subP = Math.pow(rawSubP, SCENE_07_ACCELERATION_POWER);
          const frameInScene07 = subP >= 0.995
            ? l6 - 1
            : Math.min(Math.floor(subP * l6), l6 - 1);
          targetIndex = scene07Start + frameInScene07;
        } else if (preHeroLength > 0) {
          targetIndex = preHeroLength - 1;
        } else {
          targetIndex = 0;
        }
      } else {
        if (l6 > 0) {
          targetIndex = scene07Start + l6 - 1;
        } else if (preHeroLength > 0) {
          targetIndex = preHeroLength - 1;
        } else {
          targetIndex = 0;
        }
      }

      drawFrame(targetIndex);
      
      if (onGlobalProgressRef.current) {
        onGlobalProgressRef.current(clampP);
      }
    };

    let isAnimating = false;
    let virtualProgress = 0;
    
    // Configurable webgl scroll speed
    const SCROLL_SENSITIVITY = 0.0003;

    const setPlayhead = (targetP: number) => {
      const clampedP = clamp(targetP, 0, 1);
      virtualProgress = clampedP;
      
      // Let gsap handle the smoothing for that "cinematic WebGL camera" feel
      gsap.to(playhead, {
        p: clampedP,
        duration: 1.2, // Smooth interpolation duration
        ease: "power2.out",
        overwrite: "auto", // Prevent tweens from fighting
        onUpdate: () => updatePlayhead(playhead.p),
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (isInputLocked) return;
      
      // Normalize wheel delta to prevent single mouse wheel notches from causing massive jumps
      // A standard mouse wheel ticks at ~100. Trackpads emit a stream of smaller values natively.
      let delta = e.deltaY;
      if (delta > 0) delta = Math.min(delta, 60);
      else if (delta < 0) delta = Math.max(delta, -60);
      
      setPlayhead(virtualProgress + delta * SCROLL_SENSITIVITY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isInputLocked) return;
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      setPlayhead(virtualProgress + diff * SCROLL_SENSITIVITY * 2.5);
      touchStartY = touchEndY; 
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputLocked) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        setPlayhead(virtualProgress + 0.1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setPlayhead(virtualProgress - 0.1);
      }
    };

    const handleNavToSection = (e: Event) => {
      const { section } = (e as CustomEvent).detail;
      let target = 0;
      if (section === 'home') target = 0;
      else if (section === 'about') target = PHASE_ABOUT_END;
      else if (section === 'projects-sequence') target = PHASE_SCENE_07_END;
      else if (section === 'projects' || section === 'testimonials') target = 1.0;
      setPlayhead(target);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('nav-to-section', handleNavToSection);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('nav-to-section', handleNavToSection);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(resizeCallback);
      gsap.killTweensOf(playhead);
    };
  }, [l1, l2, l6, totalLength, scene02Images, scene03Images, scene07Images, scene07Start, isInputLocked]); 

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden"
      data-surface="hero"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center" data-surface="media">
        <div 
          ref={parallaxWrapperRef} 
          className="absolute inset-0 w-full h-full"
          data-surface="media"
        >
          <canvas 
            ref={canvasRef} 
            className="w-full h-full pointer-events-none block"
          />
        </div>
        <WebGLFog />
      </div>
    </section>
  );
};
