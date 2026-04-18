import React, { useEffect, useRef } from 'react';

interface SkillRainCanvasProps {
  skills: string[];
  active: boolean;
  accentColor?: string;
}

type Drop = {
  x: number;
  y: number;
  speed: number;
  drift: number;
  size: number;
  label: string;
  opacity: number;
};

const SkillRainCanvas: React.FC<SkillRainCanvasProps> = ({ skills, active, accentColor = '#9cdcff' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const drops: Drop[] = [];
    let animationId = 0;
    let lastTime = performance.now();
    let running = false;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || 520;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const seedDrops = () => {
      drops.length = 0;
      const count = Math.max(18, skills.length * 3);
      for (let i = 0; i < count; i += 1) {
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 55 + Math.random() * 90,
          drift: -10 + Math.random() * 20,
          size: 12 + Math.random() * 10,
          label: skills[i % skills.length],
          opacity: 0.35 + Math.random() * 0.4,
        });
      }
    };

    const draw = (time: number) => {
      if (!running) return;
      const delta = Math.min(2.5, (time - lastTime) / 16.6);
      lastTime = time;

      ctx.fillStyle = 'rgba(8, 9, 14, 0.35)';
      ctx.fillRect(0, 0, width, height);

      drops.forEach((drop, index) => {
        drop.y += drop.speed * delta;
        drop.x += drop.drift * delta * 0.2;

        if (drop.y > height + 40) {
          drop.y = -20;
          drop.x = (index / drops.length) * width + Math.random() * 60 - 30;
        }

        if (drop.x < -60) drop.x = width + 30;
        if (drop.x > width + 60) drop.x = -30;

        const gradient = ctx.createLinearGradient(drop.x, drop.y - drop.size, drop.x, drop.y + drop.size * 3);
        gradient.addColorStop(0, `${accentColor}55`);
        gradient.addColorStop(1, `${accentColor}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(drop.x, drop.y, 3, drop.size * 3.2, 12);
        } else {
          ctx.rect(drop.x, drop.y, 3, drop.size * 3.2);
        }
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${drop.opacity})`;
        ctx.font = '500 12px Inter, sans-serif';
        ctx.fillText(drop.label, drop.x - 6, drop.y - 6);
      });

      animationId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      animationId = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };

    resize();
    seedDrops();
    if (active) start();

    const handleResize = () => {
      resize();
      seedDrops();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [skills, active, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: active ? 1 : 0.4, mixBlendMode: 'screen' }}
    />
  );
};

export default SkillRainCanvas;
