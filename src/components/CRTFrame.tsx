import React, { useRef, useEffect, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface CRTFrameProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  curved?: boolean;
  scanlines?: boolean;
  noise?: boolean;
  vignette?: boolean;
  glow?: boolean;
}

export const CRTFrame: React.FC<CRTFrameProps> = ({
  children,
  className = '',
  intensity = 'medium',
  curved = true,
  scanlines = true,
  noise = true,
  vignette = true,
  glow = true,
}) => {
  const { siteConfig } = useSiteConfig();
  const { crt } = siteConfig;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!noise || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    let isRendering = false;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 100;

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !isRendering) {
        isRendering = true;
        lastUpdateTime = 0;
        animate(performance.now());
      } else if (!isVisible) {
        isRendering = false;
      }
    }, { threshold: 0.1 });

    const animate = (now: number) => {
      if (!isVisible) {
        isRendering = false;
        return;
      }
      isRendering = true;

      if (now - lastUpdateTime < UPDATE_INTERVAL) {
        requestAnimationFrame(animate);
        return;
      }
      lastUpdateTime = now;

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      const noiseIntensity = intensity === 'high' ? 30 : intensity === 'medium' ? 20 : 10;

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseIntensity;
        data[i] = 128 + noise;
        data[i + 1] = 128 + noise;
        data[i + 2] = 128 + noise;
        data[i + 3] = 8;
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(animate);
    };

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    isRendering = true;
    lastUpdateTime = 0;
    animate(performance.now());

    return () => {
      observer.disconnect();
    };
  }, [noise, intensity]);

  const intensityClass = {
    low: 'crt-low',
    medium: 'crt-medium',
    high: 'crt-high',
  }[intensity];

  const crtStyle = {
    '--crt-vignette-opacity': crt.vignette.enabled ? crt.vignette.opacity : 0,
    '--crt-vignette-size': crt.vignette.enabled ? crt.vignette.size : 0.8,
    '--crt-scanline-opacity': crt.scanlines.enabled ? crt.scanlines.intensity : 0,
    '--crt-scanline-thickness': crt.scanlines.enabled ? `${crt.scanlines.thickness}px` : '1px',
    '--crt-scanline-gap': crt.scanlines.enabled ? `${crt.scanlines.gap}px` : '2px',
    '--crt-glow-intensity': crt.phosphorGlow.enabled ? crt.phosphorGlow.intensity : 0,
    '--crt-glow-spread': crt.phosphorGlow.enabled ? crt.phosphorGlow.spread : 0.5,
    '--crt-glow-color': crt.phosphorGlow.enabled ? crt.phosphorGlow.color : '#00ff00',
    '--crt-curve-intensity': crt.barrelCurvature.enabled ? crt.barrelCurvature.intensity : 0,
    '--crt-color-bleed': crt.colorBleed.enabled ? crt.colorBleed.intensity : 0,
    '--crt-chromatic-aberration': crt.colorBleed.enabled ? crt.colorBleed.chromaticAberration : 0,
    '--crt-phosphor-persistence': crt.phosphorDisplay.enabled ? crt.phosphorDisplay.persistence : 0,
    '--crt-phosphor-decay': crt.phosphorDisplay.enabled ? crt.phosphorDisplay.decay : 0,
    '--crt-mask-intensity': crt.phosphorMask.enabled ? crt.phosphorMask.intensity : 0,
    '--crt-mask-pattern': crt.phosphorMask.enabled ? crt.phosphorMask.pattern : 'rgb',
  } as React.CSSProperties;

  return (
    <div className={`crt-frame-wrapper ${intensityClass} ${className}`} style={crtStyle}>
      {vignette && <div className="crt-vignette" />}
      {scanlines && <div className="crt-scanlines" />}
      {noise && (
        <canvas
          ref={canvasRef}
          className="crt-noise"
          width={200}
          height={200}
        />
      )}
      {glow && <div className="crt-glow" />}
      <div className="crt-content">{children}</div>
    </div>
  );
};

export const CRTEdgeOverlay: React.FC<{ intensity?: 'low' | 'medium' | 'high' }> = ({
  intensity = 'medium',
}) => {
  return (
    <div className={`crt-edge-overlay crt-${intensity}`}>
      <div className="crt-edge-vignette" />
      <div className="crt-edge-scanlines" />
      <div className="crt-edge-corners" />
      <div className="crt-edge-glow" />
      <div className="crt-edge-curve" />
    </div>
  );
};
