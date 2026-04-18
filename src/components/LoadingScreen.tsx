import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
  progress: number;
  isComplete: boolean;
  onFadeComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, isComplete, onFadeComplete }) => {
  const preRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const completeRef = useRef(isComplete);
  const onFadeCompleteRef = useRef(onFadeComplete);
  const introDoneRef = useRef(false);
  const launchStartedRef = useRef(false);

  const [isFilled, setIsFilled] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    completeRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    onFadeCompleteRef.current = onFadeComplete;
  }, [onFadeComplete]);

  const launch = useCallback(() => {
    if (launchStartedRef.current || !introDoneRef.current || !completeRef.current) {
      return;
    }

    launchStartedRef.current = true;
    setIsWaiting(false);

    const logoEl = logoRef.current;
    const preEl = preRef.current;

    if (!logoEl || !preEl) {
      setIsVisible(false);
      onFadeCompleteRef.current();
      return;
    }

    gsap.to(logoEl, {
      scale: 4,
      opacity: 0,
      rotation: 8,
      duration: 0.6,
      ease: 'power3.in',
    });

    gsap.to(preEl, {
      y: '-100%',
      duration: 1.1,
      ease: 'power4.inOut',
      delay: 0.48,
      onComplete: () => {
        setIsVisible(false);
        onFadeCompleteRef.current();
      },
    });
  }, []);

  useEffect(() => {
    const logoEl = logoRef.current;

    if (logoEl) {
      gsap.to(logoEl, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.9,
        delay: 0.1,
        ease: 'back.out(1.4)',
      });
    }

    const fillTimer = window.setTimeout(() => {
      setIsFilled(true);
    }, 2100);

    const glowTimer = window.setTimeout(() => {
      setIsGlowing(true);
    }, 2600);

    const readyTimer = window.setTimeout(() => {
      introDoneRef.current = true;
      setIsWaiting(!completeRef.current);
      launch();
    }, 3000);

    return () => {
      window.clearTimeout(fillTimer);
      window.clearTimeout(glowTimer);
      window.clearTimeout(readyTimer);

      if (logoEl) {
        gsap.killTweensOf(logoEl);
      }

      if (preRef.current) {
        gsap.killTweensOf(preRef.current);
      }
    };
  }, [launch]);

  useEffect(() => {
    if (isComplete && introDoneRef.current) {
      setIsWaiting(false);
      launch();
    }
  }, [isComplete, launch]);

  if (!isVisible) {
    return null;
  }

  const logoClassName = [isFilled ? 'filled' : '', isGlowing ? 'glowing' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div id="pre" className={isWaiting ? 'is-waiting' : undefined} ref={preRef}>
      <svg
        id="pre-logo"
        ref={logoRef}
        viewBox="0 0 827.12 827.12"
        xmlns="http://www.w3.org/2000/svg"
        className={logoClassName || undefined}
        aria-label="Oussama Lassoued logo"
        role="img"
      >
        <rect className="cls-2" x="0.5" y="0.5" width="826.12" height="826.12" />
        <path
          className="cls-1 path-top"
          d="M216.18,224.03c9.07,7.88,22.44,11.54,35,12.53,21.27,1.85,48.73-1.05,71.78.95,59.26,4.48,99.66,32.41,128.71,82.47,21.44,34.31,36.73,72.77,72.03,93.47,24.42,13.99,57.22,19.81,80.5,1.95,32.36-25.88,28.56-82.45,29.4-121.98.06-32.26.9-66.71-1.14-98.36-2.25-31.12-7.52-60.55-41.74-66.18-36.59-5.5-76.79-2.56-118.85-3.68-47.78-.25-99.38-.46-148.14-.66-31,.36-63.3-1.56-89.96,10.3-35.38,15.84-47.91,62.43-17.62,89.16l.04.03Z"
        />
        <path
          className="cls-1 path-bot"
          d="M542.84,581.88c-53.31-1.14-97.68-12.26-133.11-54.82-21.15-24.53-34.41-55.92-47.21-84.95-9.85-21.41-20.75-44.33-40.73-57.83-29.13-20.08-72.64-11.32-95.67,15.33-18.76,20.66-24.03,48.16-26.45,75.84-2.22,27.14-1.89,56.83-2.21,84.9-.09,27.66-.62,50.76.93,76.32,3.13,51.19,17.52,62.87,68.28,64.44,85.09,1.6,191.46,1.93,277.64,2.22,15.17-.13,31.58-.73,45.09-3.92,49.14-9.33,57.49-77.13,18.14-103.61-19.61-12.52-40.14-12.35-64.63-13.91h-.08Z"
        />
      </svg>

      <div id="pre-line" />
    </div>
  );
};
