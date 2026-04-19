import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawCoverFrame } from '../utils/drawCoverFrame';
import { WebGLFog } from './WebGLFog';
import { useSiteConfig } from '../context/SiteConfigContext';


gsap.registerPlugin(ScrollTrigger);

const PHASE_PLAY_SCENE_02_03_END = 0.42;
const PHASE_ABOUT_END = 0.74;
const PHASE_SCENE_07_END = 0.95;
const SCENE_07_ENTRY_EPSILON = 0.0001;
const SCENE_07_REVERSE_ENTRY_EPSILON = 0.0012;
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
  const { siteConfig } = useSiteConfig();
  const scrollSettings = siteConfig.cinematicSequence.scroll;
  
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
    const clampProgress = (value: number) => {
      if (value < 0.0005) return 0;
      if (value > 0.9995) return 1;
      return clamp(value, 0, 1);
    };

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
      const clampP = clampProgress(p);
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

    let virtualProgress = 0;
    let momentum = 0;
    let momentumFrame: number | null = null;
    let playheadTween: gsap.core.Tween | null = null;
    const MOMENTUM_CAP = 0.08;
    const MIN_MOMENTUM = 0.000002;
    const tweenDuration = Math.max(0.0001, scrollSettings.smoothDurationMs / 1000);

    const stopMomentum = () => {
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
      }
      momentumFrame = null;
      momentum = 0;
    };

    const tweenToProgress = (targetP: number, options?: { immediate?: boolean }) => {
      const clampedP = clampProgress(targetP);
      virtualProgress = clampedP;
      playheadTween?.kill();
      playheadTween = gsap.to(playhead, {
        p: clampedP,
        duration: options?.immediate ? 0.001 : tweenDuration,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => updatePlayhead(playhead.p),
      });
    };

    const stepMomentum = () => {
      const target = clampProgress(virtualProgress + momentum);
      tweenToProgress(target);
      momentum *= scrollSettings.momentumDamping;

      if (Math.abs(momentum) > MIN_MOMENTUM) {
        momentumFrame = requestAnimationFrame(stepMomentum);
      } else {
        stopMomentum();
      }
    };

    const queueMomentum = (delta: number, multiplier = 1) => {
      const limitedDelta = clamp(delta, -scrollSettings.maxWheelDelta, scrollSettings.maxWheelDelta);
      const impulse = limitedDelta * scrollSettings.wheelIntensity * multiplier;
      momentum = clamp(momentum + impulse, -MOMENTUM_CAP, MOMENTUM_CAP);

      if (!momentumFrame) {
        momentumFrame = requestAnimationFrame(stepMomentum);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isInputLocked) {
        stopMomentum();
        return;
      }
      queueMomentum(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isInputLocked) {
        stopMomentum();
        return;
      }
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      queueMomentum(diff, scrollSettings.touchMultiplier);
      touchStartY = touchEndY; 
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputLocked) {
        stopMomentum();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        tweenToProgress(virtualProgress + scrollSettings.keyboardStep);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        tweenToProgress(virtualProgress - scrollSettings.keyboardStep);
      }
    };

    const handleNavToSection = (e: Event) => {
      const { section } = (e as CustomEvent).detail;
      let target = 0;
      if (section === 'home') target = 0;
      else if (section === 'about') target = PHASE_ABOUT_END;
      else if (section === 'projects-sequence') {
        // Enter scene-07 at its beginning so the sequence plays forward naturally.
        target = PHASE_ABOUT_END + SCENE_07_ENTRY_EPSILON;
      }
      else if (section === 'projects-sequence-end') {
        // Exit portfolio back into scene-07 near its end so reverse scrolling follows sequence.
        target = Math.max(
          PHASE_ABOUT_END + SCENE_07_ENTRY_EPSILON,
          PHASE_SCENE_07_END - SCENE_07_REVERSE_ENTRY_EPSILON,
        );
      }
      else if (section === 'projects' || section === 'testimonials') target = 1.0;
      stopMomentum();
      tweenToProgress(target, { immediate: true });
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
      stopMomentum();
      playheadTween?.kill();
    };
  }, [
    l1,
    l2,
    l6,
    totalLength,
    scene02Images,
    scene03Images,
    scene07Images,
    scene07Start,
    isInputLocked,
    scrollSettings,
  ]); 

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
