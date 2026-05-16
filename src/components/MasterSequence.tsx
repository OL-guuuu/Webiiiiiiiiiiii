import React, { useRef, useEffect, memo } from 'react';
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
const HOME_REVERSE_ENTRY_EPSILON = 0.0014;
const TRANSITION_DURATION_SCALE = 0.95;
const SCENE_07_ACCELERATION_POWER = 0.72;

interface MasterSequenceProps {
  scene02Images: HTMLImageElement[];
  scene03Images: HTMLImageElement[];
  scene07Images: HTMLImageElement[];
  isInputLocked?: boolean;
  onGlobalProgress?: (progress: number) => void;
}

export const MasterSequence: React.FC<MasterSequenceProps> = memo(({ 
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
  const frameConfig = siteConfig.globalFrame;
  const isInputLockedRef = useRef(isInputLocked);
  const scrollSettingsRef = useRef(siteConfig.cinematicSequence.scroll);
  const lastProgressRef = useRef(0);
  
  const onGlobalProgressRef = useRef(onGlobalProgress);

  useEffect(() => {
    onGlobalProgressRef.current = onGlobalProgress;
  }, [onGlobalProgress]);

  useEffect(() => {
    isInputLockedRef.current = isInputLocked;
  }, [isInputLocked]);

  useEffect(() => {
    scrollSettingsRef.current = siteConfig.cinematicSequence.scroll;
  }, [siteConfig.cinematicSequence.scroll]);

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
    let isVisible = true;
    let isRendering = false;

    // Visibility-based optimization: pause rendering when not visible
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !isRendering) {
        isRendering = true;
        // Redraw the last frame when becoming visible
        drawFrame(lastDrawnIndex);
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const clampProgress = (value: number) => {
      if (value < 0.0005) return 0;
      if (value > 0.9995) return 1;
      return clamp(value, 0, 1);
    };

    const getTweenDuration = () => {
      return Math.max(0.0001, scrollSettingsRef.current.smoothDurationMs / 1000);
    };

    const getInputCooldownMs = () => {
      return Math.max(80, scrollSettingsRef.current.inputCooldownMs);
    };

    const getImageAtGlobalIndex = (index: number): HTMLImageElement | undefined => {
      if (index < l1) return scene02Images[index];
      if (index < l1 + l2) return scene03Images[index - l1];
      return scene07Images[index - l1 - l2];
    };

    const isDrawable = (image?: HTMLImageElement | null) => {
      return !!image && image.complete && image.naturalWidth > 0;
    };

    const findDrawableIndex = (targetIndex: number) => {
      const [segmentStart, segmentEnd] = targetIndex >= scene07Start
        ? [scene07Start, totalLength - 1]
        : [0, Math.max(preHeroLength - 1, 0)];

      for (let i = targetIndex; i >= segmentStart; i -= 1) {
        if (isDrawable(getImageAtGlobalIndex(i))) return i;
      }

      for (let i = targetIndex + 1; i <= segmentEnd; i += 1) {
        if (isDrawable(getImageAtGlobalIndex(i))) return i;
      }

      return null;
    };

    const drawFrame = (index: number) => {
      const safeIndex = clamp(index, 0, totalLength - 1);
      const drawableIndex = findDrawableIndex(safeIndex);
      if (drawableIndex === null) return;
      const drawableImage = getImageAtGlobalIndex(drawableIndex);
      if (!drawableImage) return;
      lastDrawableImageRef.current = drawableImage;

      const { innerWidth, innerHeight } = window;
      // Optimize canvas resolution for better FPS
      const optimizedWidth = Math.floor(innerWidth * 0.75);
      const optimizedHeight = Math.floor(innerHeight * 0.75);
      if (canvas.width !== optimizedWidth || canvas.height !== optimizedHeight) {
        canvas.width = optimizedWidth;
        canvas.height = optimizedHeight;
      }

      drawCoverFrame(ctx, drawableImage, {
        zoomFactor: 1,
        objectFit: 'cover'
      });
      lastDrawnIndex = drawableIndex;
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeCallback);
      resizeCallback = requestAnimationFrame(() => drawFrame(lastDrawnIndex));
    };

    let virtualProgress = clampProgress(lastProgressRef.current);
    const playhead = { p: virtualProgress };
    const updatePlayhead = (p: number) => {
      const clampP = clampProgress(p);
      lastProgressRef.current = clampP;
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

      // Only draw if visible
      if (isVisible) {
        drawFrame(targetIndex);
      }

      if (onGlobalProgressRef.current) {
        onGlobalProgressRef.current(clampP);
      }
    };

    updatePlayhead(playhead.p);

    let momentum = 0;
    let momentumFrame: number | null = null;
    let playheadTween: gsap.core.Tween | null = null;
    const MOMENTUM_CAP = 0.08;
    const MIN_MOMENTUM = 0.000002;
    let navLockUntil = 0;

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
        duration: options?.immediate ? 0.001 : getTweenDuration(),
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => updatePlayhead(playhead.p),
      });
    };

    const stepMomentum = () => {
      const target = clampProgress(virtualProgress + momentum);
      tweenToProgress(target);
      momentum *= scrollSettingsRef.current.momentumDamping;

      if (Math.abs(momentum) > MIN_MOMENTUM) {
        momentumFrame = requestAnimationFrame(stepMomentum);
      } else {
        stopMomentum();
      }
    };

    let lastInputAt = 0;
    let lastDirection = 0;
    let lastForwardAt = 0;
    let lastBackwardAt = 0;

    const queueMomentum = (delta: number, multiplier = 1) => {
      if (Date.now() < navLockUntil) return;
      if (delta === 0) return;
      const scrollSettings = scrollSettingsRef.current;
      const limitedDelta = clamp(delta, -scrollSettings.maxWheelDelta, scrollSettings.maxWheelDelta);
      const now = Date.now();
      const direction = Math.sign(limitedDelta);
      const inputCooldownMs = getInputCooldownMs();

      if (
        direction !== 0 &&
        lastDirection !== 0 &&
        direction !== lastDirection &&
        now - lastInputAt < inputCooldownMs
      ) {
        return;
      }

      if (direction > 0) {
        lastForwardAt = now;
      } else if (direction < 0) {
        lastBackwardAt = now;
      }

      if (direction < 0 && virtualProgress < 0.08 && now - lastForwardAt < inputCooldownMs * 2) {
        return;
      }

      if (direction !== 0 && direction !== lastDirection) {
        stopMomentum();
      }

      if (direction !== 0) {
        lastDirection = direction;
      }
      lastInputAt = now;
      const impulse = limitedDelta * scrollSettings.wheelIntensity * multiplier;
      momentum = clamp(momentum + impulse, -MOMENTUM_CAP, MOMENTUM_CAP);

      if (!momentumFrame) {
        momentumFrame = requestAnimationFrame(stepMomentum);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isInputLockedRef.current) {
        stopMomentum();
        return;
      }
      e.preventDefault();
      queueMomentum(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isInputLockedRef.current) {
        stopMomentum();
        return;
      }
      e.preventDefault();
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      queueMomentum(diff, scrollSettingsRef.current.touchMultiplier);
      touchStartY = touchEndY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputLockedRef.current) {
        stopMomentum();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        tweenToProgress(virtualProgress + scrollSettingsRef.current.keyboardStep);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        tweenToProgress(virtualProgress - scrollSettingsRef.current.keyboardStep);
      }
    };

    const handleNavToSection = (e: Event) => {
      const { section } = (e as CustomEvent).detail;
      let target = 0;
      navLockUntil = Date.now() + getInputCooldownMs();
      if (section === 'home') target = 0;
      else if (section === 'home-sequence') {
        target = Math.max(0, PHASE_PLAY_SCENE_02_03_END - HOME_REVERSE_ENTRY_EPSILON);
      }
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

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
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
      observer.disconnect();
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
            className="cinematic-canvas w-full h-full pointer-events-none block"
          />
        </div>
        <WebGLFog />
        {frameConfig.watermarkMaskEnabled && (frameConfig.watermarkMaskMobilePx > 0 || frameConfig.watermarkMaskDesktopPx > 0) ? (
          <div
            className="cinematic-watermark-cover pointer-events-none absolute z-[25]"
            style={{
              '--watermark-mask-mobile': `${frameConfig.watermarkMaskMobilePx}px`,
              '--watermark-mask-desktop': `${frameConfig.watermarkMaskDesktopPx}px`,
              '--watermark-mask-width-mobile': `${frameConfig.watermarkMaskWidthMobilePx}px`,
              '--watermark-mask-width-desktop': `${frameConfig.watermarkMaskWidthDesktopPx}px`,
              '--watermark-mask-right-mobile': `${frameConfig.watermarkMaskRightMobilePx}px`,
              '--watermark-mask-right-desktop': `${frameConfig.watermarkMaskRightDesktopPx}px`,
              '--watermark-mask-bottom-mobile': `${frameConfig.watermarkMaskBottomMobilePx}px`,
              '--watermark-mask-bottom-desktop': `${frameConfig.watermarkMaskBottomDesktopPx}px`,
            } as React.CSSProperties}
          />
        ) : null}
      </div>
    </section>
  );
});