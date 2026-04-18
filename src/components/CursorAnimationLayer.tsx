import React, { useEffect, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';
import type { SiteConfig } from '../config/siteConfig';
import SplashCursor from './SplashCursor';

type CursorAnimationConfig = SiteConfig['animation'];

type PositionMode = 'fixed' | 'absolute';

interface CursorAnimationLayerProps {
  animation: CursorAnimationConfig;
  positionMode?: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const getContainerClass = (positionMode: PositionMode, className?: string) => {
  const base = `${positionMode === 'fixed' ? 'fixed' : 'absolute'} inset-0 pointer-events-none`;
  return className ? `${base} ${className}` : base;
};

const getInitialPointer = (trackingTargetRef?: RefObject<HTMLElement | null>) => {
  const element = trackingTargetRef?.current;
  if (element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.width * 0.5,
      y: rect.height * 0.5,
    };
  }

  if (typeof window !== 'undefined') {
    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };
  }

  return { x: 0, y: 0 };
};

const resolvePointerPoint = (
  event: PointerEvent,
  trackingTargetRef?: RefObject<HTMLElement | null>,
) => {
  const element = trackingTargetRef?.current;
  if (element) {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
};

interface AuraCursorLayerProps {
  aura: CursorAnimationConfig['aura'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const AuraCursorLayer: React.FC<AuraCursorLayerProps> = ({
  aura,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const blobRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(getInitialPointer(trackingTargetRef));
  const currentRef = useRef(getInitialPointer(trackingTargetRef));

  useEffect(() => {
    const startPoint = getInitialPointer(trackingTargetRef);
    targetRef.current = startPoint;
    currentRef.current = startPoint;

    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      targetRef.current = resolvePointerPoint(pEvent, trackingTargetRef);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);

    let rafId = 0;
    const animate = () => {
      const blob = blobRef.current;
      if (!blob) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * aura.smoothing;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * aura.smoothing;

      blob.style.transform = `translate3d(${(currentRef.current.x - aura.sizePx * 0.5).toFixed(2)}px, ${(currentRef.current.y - aura.sizePx * 0.5).toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, [aura.sizePx, aura.smoothing, trackingTargetRef]);

  return (
    <div className={getContainerClass(positionMode, className)} style={containerStyle}>
      <div
        ref={blobRef}
        style={{
          position: 'absolute',
          width: `${aura.sizePx}px`,
          height: `${aura.sizePx}px`,
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${aura.color} 0%, transparent 66%)`,
          opacity: aura.intensity,
          filter: `blur(${aura.blurPx}px)`,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

interface OrbitCursorLayerProps {
  orbit: CursorAnimationConfig['orbit'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const OrbitCursorLayer: React.FC<OrbitCursorLayerProps> = ({
  orbit,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const orbRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetRef = useRef(getInitialPointer(trackingTargetRef));
  const trailRef = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: orbit.orbCount }, () => getInitialPointer(trackingTargetRef)),
  );

  useEffect(() => {
    trailRef.current = Array.from({ length: orbit.orbCount }, () => getInitialPointer(trackingTargetRef));
    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      targetRef.current = resolvePointerPoint(pEvent, trackingTargetRef);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);

    let rafId = 0;
    const animate = () => {
      const trails = trailRef.current;
      if (trails.length !== orbit.orbCount) {
        trailRef.current = Array.from({ length: orbit.orbCount }, () => ({
          x: targetRef.current.x,
          y: targetRef.current.y,
        }));
      }

      for (let index = 0; index < orbit.orbCount; index += 1) {
        const previous = index === 0 ? targetRef.current : trailRef.current[index - 1];
        const current = trailRef.current[index];
        const strength = orbit.followStrength * Math.pow(orbit.falloff, index);
        current.x += (previous.x - current.x) * strength;
        current.y += (previous.y - current.y) * strength;

        const orb = orbRefs.current[index];
        if (orb) {
          const size = Math.max(6, orbit.orbSizePx * (1 - index / Math.max(orbit.orbCount * 1.25, 1)));
          orb.style.width = `${size.toFixed(2)}px`;
          orb.style.height = `${size.toFixed(2)}px`;
          orb.style.transform = `translate3d(${(current.x - size * 0.5).toFixed(2)}px, ${(current.y - size * 0.5).toFixed(2)}px, 0)`;
          orb.style.opacity = `${(orbit.opacity * (1 - index / Math.max(orbit.orbCount + 2, 1))).toFixed(3)}`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, [
    orbit.orbCount,
    orbit.orbSizePx,
    orbit.opacity,
    orbit.followStrength,
    orbit.falloff,
    trackingTargetRef,
  ]);

  return (
    <div className={getContainerClass(positionMode, className)} style={containerStyle}>
      {Array.from({ length: orbit.orbCount }).map((_, index) => (
        <div
          key={`orbit-${index}`}
          ref={(node) => {
            orbRefs.current[index] = node;
          }}
          style={{
            position: 'absolute',
            borderRadius: '9999px',
            background: orbit.color,
            filter: `blur(${orbit.blurPx}px)`,
            mixBlendMode: 'screen',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};

interface CometCursorLayerProps {
  comet: CursorAnimationConfig['comet'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const CometCursorLayer: React.FC<CometCursorLayerProps> = ({
  comet,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetRef = useRef(getInitialPointer(trackingTargetRef));
  const segmentCount = Math.max(2, Math.round(comet.tailLength));
  const trailRef = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: segmentCount }, () => getInitialPointer(trackingTargetRef)),
  );

  useEffect(() => {
    trailRef.current = Array.from({ length: segmentCount }, () => getInitialPointer(trackingTargetRef));

    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      targetRef.current = resolvePointerPoint(pEvent, trackingTargetRef);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);

    let rafId = 0;
    const animate = () => {
      if (trailRef.current.length !== segmentCount) {
        trailRef.current = Array.from({ length: segmentCount }, () => ({
          x: targetRef.current.x,
          y: targetRef.current.y,
        }));
      }

      for (let index = 0; index < segmentCount; index += 1) {
        const previous = index === 0 ? targetRef.current : trailRef.current[index - 1];
        const current = trailRef.current[index];
        const strength = comet.followStrength * Math.max(0.26, 1 - index * 0.08);

        current.x += (previous.x - current.x) * strength;
        current.y += (previous.y - current.y) * strength;

        const segment = segmentRefs.current[index];
        if (segment) {
          const size = Math.max(2, comet.headSizePx * (1 - index / Math.max(segmentCount * 1.15, 1)));
          const segmentOpacity = comet.opacity * (1 - index / Math.max(segmentCount + 1, 1));
          segment.style.width = `${size.toFixed(2)}px`;
          segment.style.height = `${size.toFixed(2)}px`;
          segment.style.opacity = `${Math.max(0, segmentOpacity).toFixed(3)}`;
          segment.style.transform = `translate3d(${(current.x - size * 0.5).toFixed(2)}px, ${(current.y - size * 0.5).toFixed(2)}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, [comet.followStrength, comet.headSizePx, comet.opacity, segmentCount, trackingTargetRef]);

  return (
    <div className={getContainerClass(positionMode, className)} style={containerStyle}>
      {Array.from({ length: segmentCount }).map((_, index) => (
        <div
          key={`comet-${index}`}
          ref={(node) => {
            segmentRefs.current[index] = node;
          }}
          style={{
            position: 'absolute',
            borderRadius: '9999px',
            background: comet.color,
            filter: `blur(${comet.blurPx}px)`,
            mixBlendMode: 'screen',
            willChange: 'transform, width, height, opacity',
          }}
        />
      ))}
    </div>
  );
};

interface RippleCursorLayerProps {
  ripple: CursorAnimationConfig['ripple'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const RippleCursorLayer: React.FC<RippleCursorLayerProps> = ({
  ripple,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lastSpawnRef = useRef(getInitialPointer(trackingTargetRef));

  useEffect(() => {
    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;
    const timeoutIds: number[] = [];
    lastSpawnRef.current = getInitialPointer(trackingTargetRef);

    const cleanupRings = () => {
      const layerHost = hostRef.current;
      if (!layerHost) return;
      layerHost.replaceChildren();
    };

    const spawnRipple = (x: number, y: number) => {
      const layerHost = hostRef.current;
      if (!layerHost) return;

      const ring = document.createElement('div');
      ring.style.position = 'absolute';
      ring.style.width = `${ripple.ringSizePx}px`;
      ring.style.height = `${ripple.ringSizePx}px`;
      ring.style.borderRadius = '9999px';
      ring.style.border = `${ripple.ringWidthPx}px solid ${ripple.color}`;
      ring.style.opacity = `${ripple.opacity}`;
      ring.style.pointerEvents = 'none';
      ring.style.transform = `translate3d(${(x - ripple.ringSizePx * 0.5).toFixed(2)}px, ${(y - ripple.ringSizePx * 0.5).toFixed(2)}px, 0) scale(0.2)`;
      ring.style.transition = `transform ${ripple.lifeMs}ms cubic-bezier(0.22,0.68,0,1), opacity ${ripple.lifeMs}ms linear`;
      ring.style.willChange = 'transform, opacity';
      layerHost.appendChild(ring);

      requestAnimationFrame(() => {
        ring.style.transform = `translate3d(${(x - ripple.ringSizePx * 0.5).toFixed(2)}px, ${(y - ripple.ringSizePx * 0.5).toFixed(2)}px, 0) scale(1)`;
        ring.style.opacity = '0';
      });

      const timeoutId = window.setTimeout(() => {
        ring.remove();
      }, ripple.lifeMs + 40);
      timeoutIds.push(timeoutId);
    };

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      const point = resolvePointerPoint(pEvent, trackingTargetRef);
      const dx = point.x - lastSpawnRef.current.x;
      const dy = point.y - lastSpawnRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance >= ripple.spawnDistancePx) {
        lastSpawnRef.current = point;
        spawnRipple(point.x, point.y);
      }
    };

    const handlePointerDown = (event: Event) => {
      const pEvent = event as PointerEvent;
      const point = resolvePointerPoint(pEvent, trackingTargetRef);
      lastSpawnRef.current = point;
      spawnRipple(point.x, point.y);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);
    pointerTarget.addEventListener('pointerdown', handlePointerDown as EventListener);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      pointerTarget.removeEventListener('pointerdown', handlePointerDown as EventListener);
      timeoutIds.forEach((id) => window.clearTimeout(id));
      cleanupRings();
    };
  }, [ripple, trackingTargetRef]);

  return <div ref={hostRef} className={getContainerClass(positionMode, className)} style={containerStyle} />;
};

interface SparkCursorLayerProps {
  spark: CursorAnimationConfig['spark'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const SparkCursorLayer: React.FC<SparkCursorLayerProps> = ({
  spark,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lastEmitRef = useRef(getInitialPointer(trackingTargetRef));

  useEffect(() => {
    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;
    const timeoutIds: number[] = [];
    lastEmitRef.current = getInitialPointer(trackingTargetRef);

    const cleanupParticles = () => {
      const layerHost = hostRef.current;
      if (!layerHost) return;
      layerHost.replaceChildren();
    };

    const emitSpark = (x: number, y: number) => {
      const layerHost = hostRef.current;
      if (!layerHost) return;

      for (let index = 0; index < spark.particleCount; index += 1) {
        const node = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const distance = spark.spreadPx * (0.35 + Math.random() * 0.75);
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        const size = spark.particleSizePx * (0.65 + Math.random() * 0.9);

        node.style.position = 'absolute';
        node.style.width = `${size.toFixed(2)}px`;
        node.style.height = `${size.toFixed(2)}px`;
        node.style.borderRadius = '9999px';
        node.style.background = spark.color;
        node.style.boxShadow = `0 0 16px ${spark.color}`;
        node.style.opacity = '0.95';
        node.style.pointerEvents = 'none';
        node.style.transform = `translate3d(${(x - size * 0.5).toFixed(2)}px, ${(y - size * 0.5).toFixed(2)}px, 0) scale(1)`;
        node.style.transition = `transform ${spark.lifeMs}ms cubic-bezier(0.2,0.7,0,1), opacity ${spark.lifeMs}ms linear`;
        node.style.willChange = 'transform, opacity';
        layerHost.appendChild(node);

        requestAnimationFrame(() => {
          node.style.transform = `translate3d(${(targetX - size * 0.5).toFixed(2)}px, ${(targetY - size * 0.5).toFixed(2)}px, 0) scale(0.35)`;
          node.style.opacity = '0';
        });

        const timeoutId = window.setTimeout(() => {
          node.remove();
        }, spark.lifeMs + 30);
        timeoutIds.push(timeoutId);
      }
    };

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      const point = resolvePointerPoint(pEvent, trackingTargetRef);
      const dx = point.x - lastEmitRef.current.x;
      const dy = point.y - lastEmitRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 6) {
        return;
      }

      lastEmitRef.current = point;
      if (Math.random() <= spark.emissionRate) {
        emitSpark(point.x, point.y);
      }
    };

    const handlePointerDown = (event: Event) => {
      const pEvent = event as PointerEvent;
      const point = resolvePointerPoint(pEvent, trackingTargetRef);
      lastEmitRef.current = point;
      emitSpark(point.x, point.y);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);
    pointerTarget.addEventListener('pointerdown', handlePointerDown as EventListener);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      pointerTarget.removeEventListener('pointerdown', handlePointerDown as EventListener);
      timeoutIds.forEach((id) => window.clearTimeout(id));
      cleanupParticles();
    };
  }, [spark, trackingTargetRef]);

  return <div ref={hostRef} className={getContainerClass(positionMode, className)} style={containerStyle} />;
};

interface BeamCursorLayerProps {
  beam: CursorAnimationConfig['beam'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const BeamCursorLayer: React.FC<BeamCursorLayerProps> = ({
  beam,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const beamRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(getInitialPointer(trackingTargetRef));
  const currentRef = useRef(getInitialPointer(trackingTargetRef));
  const previousRef = useRef(getInitialPointer(trackingTargetRef));

  useEffect(() => {
    const startPoint = getInitialPointer(trackingTargetRef);
    targetRef.current = startPoint;
    currentRef.current = startPoint;
    previousRef.current = startPoint;

    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      targetRef.current = resolvePointerPoint(pEvent, trackingTargetRef);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);

    let rafId = 0;
    const animate = () => {
      const node = beamRef.current;
      if (!node) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * beam.lag;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * beam.lag;

      const dx = currentRef.current.x - previousRef.current.x;
      const dy = currentRef.current.y - previousRef.current.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      node.style.transform = `translate3d(${(currentRef.current.x - beam.widthPx * 0.5).toFixed(2)}px, ${(currentRef.current.y - beam.heightPx * 0.5).toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg)`;
      node.style.opacity = `${beam.opacity}`;

      previousRef.current = {
        x: currentRef.current.x,
        y: currentRef.current.y,
      };

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, [beam, trackingTargetRef]);

  return (
    <div className={getContainerClass(positionMode, className)} style={containerStyle}>
      <div
        ref={beamRef}
        style={{
          position: 'absolute',
          width: `${beam.widthPx}px`,
          height: `${beam.heightPx}px`,
          borderRadius: '9999px',
          background: `linear-gradient(90deg, transparent 0%, ${beam.color} 42%, ${beam.color} 58%, transparent 100%)`,
          filter: `blur(${beam.blurPx}px)`,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

interface PlasmaCursorLayerProps {
  plasma: CursorAnimationConfig['plasma'];
  positionMode: PositionMode;
  className?: string;
  containerStyle?: CSSProperties;
  trackingTargetRef?: RefObject<HTMLElement | null>;
}

const PlasmaCursorLayer: React.FC<PlasmaCursorLayerProps> = ({
  plasma,
  positionMode,
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  const blobARef = useRef<HTMLDivElement | null>(null);
  const blobBRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(getInitialPointer(trackingTargetRef));
  const currentRef = useRef(getInitialPointer(trackingTargetRef));

  useEffect(() => {
    const startPoint = getInitialPointer(trackingTargetRef);
    targetRef.current = startPoint;
    currentRef.current = startPoint;

    const host = trackingTargetRef?.current;
    const pointerTarget: EventTarget = host ?? window;

    const handlePointerMove = (event: Event) => {
      const pEvent = event as PointerEvent;
      targetRef.current = resolvePointerPoint(pEvent, trackingTargetRef);
    };

    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener);

    let rafId = 0;
    const animate = () => {
      const blobA = blobARef.current;
      const blobB = blobBRef.current;
      if (!blobA || !blobB) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * plasma.smoothing;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * plasma.smoothing;

      const time = performance.now() / 1000;
      const offset = plasma.sizePx * 0.12;

      const aX = currentRef.current.x + Math.cos(time * 1.8) * offset;
      const aY = currentRef.current.y + Math.sin(time * 1.5) * offset;
      const bX = currentRef.current.x + Math.cos(time * 1.2 + Math.PI) * offset;
      const bY = currentRef.current.y + Math.sin(time * 1.7 + Math.PI) * offset;

      blobA.style.transform = `translate3d(${(aX - plasma.sizePx * 0.5).toFixed(2)}px, ${(aY - plasma.sizePx * 0.5).toFixed(2)}px, 0)`;
      blobB.style.transform = `translate3d(${(bX - plasma.sizePx * 0.5).toFixed(2)}px, ${(bY - plasma.sizePx * 0.5).toFixed(2)}px, 0)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, [plasma, trackingTargetRef]);

  return (
    <div className={getContainerClass(positionMode, className)} style={containerStyle}>
      <div
        ref={blobARef}
        style={{
          position: 'absolute',
          width: `${plasma.sizePx}px`,
          height: `${plasma.sizePx}px`,
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${plasma.colorA} 0%, transparent 68%)`,
          filter: `blur(${plasma.blurPx}px)`,
          opacity: plasma.opacity,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
      <div
        ref={blobBRef}
        style={{
          position: 'absolute',
          width: `${plasma.sizePx}px`,
          height: `${plasma.sizePx}px`,
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${plasma.colorB} 0%, transparent 68%)`,
          filter: `blur(${plasma.blurPx}px)`,
          opacity: plasma.opacity,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export const CursorAnimationLayer: React.FC<CursorAnimationLayerProps> = ({
  animation,
  positionMode = 'fixed',
  className,
  containerStyle,
  trackingTargetRef,
}) => {
  if (animation.activeCursorAnimation === 'aura') {
    return (
      <AuraCursorLayer
        aura={animation.aura}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'orbit') {
    return (
      <OrbitCursorLayer
        orbit={animation.orbit}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'comet') {
    return (
      <CometCursorLayer
        comet={animation.comet}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'ripple') {
    return (
      <RippleCursorLayer
        ripple={animation.ripple}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'spark') {
    return (
      <SparkCursorLayer
        spark={animation.spark}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'beam') {
    return (
      <BeamCursorLayer
        beam={animation.beam}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  if (animation.activeCursorAnimation === 'plasma') {
    return (
      <PlasmaCursorLayer
        plasma={animation.plasma}
        positionMode={positionMode}
        className={className}
        containerStyle={containerStyle}
        trackingTargetRef={trackingTargetRef}
      />
    );
  }

  return (
    <SplashCursor
      {...animation.cursor}
      positionMode={positionMode}
      className={className}
      containerStyle={containerStyle}
    />
  );
};

export default CursorAnimationLayer;
