import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface CinematicAboutProps {
  progress: number;
}

export const CinematicAbout: React.FC<CinematicAboutProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05 } = siteConfig;
  const animations = scene05.animations || { textRevealStyle: 'fade-up', cardEntranceStyle: 'stack' };
  const { textRevealStyle, cardEntranceStyle } = animations;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const localProgress = progress;

  const calcOpacity = (p: number, start: number, end: number, fadeLen = 0.05) => {
    if (p < start || p > end) return 0;
    if (p < start + fadeLen) return (p - start) / fadeLen;
    if (p > end - fadeLen) return (end - p) / fadeLen;
    return 1;
  };

  const getTransformDirectional = (p: number, start: number, end: number, direction: 'left' | 'right' | 'up' | 'down' | 'zoom' | 'cinematic-text' | 'letter-spacing' | 'blur-in', fadeLen = 0.05) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - ((p - start) / fadeLen);
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    const totalProg = Math.max(0, Math.min(1, (p - start) / (end - start)));

    // Continuous fly-through translations mapped against fade status
    if (direction === 'left') {
      return `translateX(${(enterProg * -20) + (exitProg * 20)}vw)`;
    }
    if (direction === 'right') {
      return `translateX(${(enterProg * 20) + (exitProg * -20)}vw)`;
    }
    if (direction === 'up') {
      return `translateY(${(enterProg * 20) + (exitProg * -20)}vh)`;
    }
    if (direction === 'down') {
      return `translateY(${(enterProg * -20) + (exitProg * 20)}vh)`;
    }

    if (direction === 'zoom') {
      return `scale(${1 + totalProg * 0.15 + (enterProg * -0.3) + (exitProg * 0.3)})`;
    }

    if (direction === 'cinematic-text') {
      return `scale(${1 + totalProg * 0.05}) translateY(${(enterProg * 40) + (exitProg * -40)}px)`;
    }

    if (direction === 'letter-spacing') {
      return `scale(${1 - totalProg * 0.05}) translateY(${(enterProg * -20) + (exitProg * 20)}px)`;
    }

    if (direction === 'blur-in') {
      return `scale(${1 + (enterProg * 0.5) + (exitProg * -0.2)}) translate(0, 0)`;
    }

    return 'translate(0, 0)';
  };

  const getRainTransform = (p: number, start: number, end: number, index: number, total: number, mouseX: number, mouseY: number, fadeLen = 0.05) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - ((p - start) / fadeLen);
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    // Pseudo-random properties (stable)
    const pxSeed1 = (index * 137 % 100) / 100;
    const pxSeed2 = (index * 251 % 100) / 100;

    // Stagger based on index and randomness
    const startDelay = index * 0.06;
    const rndDelay = pxSeed1 * 0.15;

    // Limit to exactly 0..1 bounding the stagger limits
    let stEnt = Math.max(0, Math.min(1, enterProg * (1 + startDelay + rndDelay) - startDelay));
    let stEx = Math.max(0, Math.min(1, exitProg * (1 + startDelay + rndDelay) - startDelay));

    // Fall distances (fall from the sky, crash into ground)
    // 1200px is offscreen top, + rotation
    const yDrop = stEnt * -1500;  // High from above
    const yFall = stEx * 1500;    // Fall down below
    const dropRot = stEnt * (pxSeed2 > 0.5 ? 90 : -90); // Spins wildly initially
    const exitRot = stEx * (pxSeed1 > 0.5 ? -90 : 90);

    // Parallax (moves beautifully in harmony when settled)
    const pX = (1 - stEnt - stEx) * mouseX * (pxSeed1 - 0.5) * 60;
    const pY = (1 - stEnt - stEx) * mouseY * (pxSeed2 - 0.5) * 60;

    // Scale pops gracefully
    const scale = 1 - (stEnt * 0.8) - (stEx * 0.8);

    return `translate3d(${pX}px, ${yDrop + yFall + pY}px, 0) rotate(${dropRot + exitRot}deg) scale(${scale})`;
  };

  const getCardTransform = (p: number, start: number, end: number, index: number, total: number, fadeLen = 0.05) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - ((p - start) / fadeLen);
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    // Apply internal stagger to cards so they don't form perfectly parallel flat lines
    const staggerEnter = Math.max(0, Math.min(1, enterProg + index * 0.15));
    const staggerExit = Math.max(0, Math.min(1, exitProg + index * 0.15));

    if (cardEntranceStyle === 'creative') {
      const rot = (index - total / 2) * 12;
      const baseYOffset = Math.abs(index - total / 2) * 30;
      return `translateY(${baseYOffset + (staggerEnter * 100) + (staggerExit * -100)}px) rotate(${rot + (staggerEnter * -30) + (staggerExit * 30)}deg) scale(${1 - staggerEnter * 0.4 - staggerExit * 0.4})`;
    }
    if (cardEntranceStyle === 'stack') {
      return `translateY(${index * 20 + staggerEnter * 150 + staggerExit * -150}px) scale(${1 - index * 0.05 - staggerEnter * 0.3 - Math.max(0, exitProg) * 0.3})`;
    }
    if (cardEntranceStyle === 'stagger') {
      return `rotateY(${staggerEnter * 90 + Math.max(0, exitProg) * -90}deg) scale(${1 - staggerEnter * 0.2 - Math.max(0, exitProg) * 0.2}) translateY(${(index % 2 === 0 ? -1 : 1) * 15}px)`;
    }
    return `translateY(${(staggerEnter * 80) + (Math.max(0, exitProg) * -80)}px) scale(${1 - staggerEnter * 0.2 - Math.max(0, exitProg) * 0.2})`;
  };

  const isActive = progress > 0.01 && progress <= 1.0;

  return (
    <section
      className={`fixed inset-0 z-[190] flex items-center justify-center overflow-hidden transition-all duration-[800ms] ease-out text-[#0f1219] ${isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
    >
      {/* Background Gradient Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isActive ? 1 : 0,
          background: 'radial-gradient(1200px 680px at 8% 0%, rgba(66,109,176,0.12), transparent 64%), radial-gradient(900px 560px at 96% 16%, rgba(96,132,185,0.1), transparent 68%), linear-gradient(180deg, #edf2fa 0%, #f9fbff 42%, #eef2f9 100%)'
        }}
      />

      {/* Stage 1: Intro - Typewriter Text Reveal */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          opacity: calcOpacity(localProgress, -0.1, 0.25),
          transform: getTransformDirectional(localProgress, -0.1, 0.25, 'blur-in'),
          pointerEvents: localProgress >= 0 && localProgress < 0.25 ? 'auto' : 'none',
          filter: calcOpacity(localProgress, -0.1, 0.25) < 1 ? `blur(${10 - calcOpacity(localProgress, -0.1, 0.25) * 10}px)` : 'none'
        }}
      >
        {scene05.portraitImage && (
          <img
            src={scene05.portraitImage}
            alt={scene05.portraitAlt || 'Portrait'}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl mb-8 object-cover drop-shadow-xl"
            style={{
              opacity: localProgress > -0.05 ? 1 : 0,
              transform: `scale(${localProgress > -0.05 ? 1 : 0.8})`,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        )}
        <h1
          className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-3 text-[#0f1219] drop-shadow-2xl min-h-[1.2em] relative inline-block"
        >
          {(() => {
            const startWrite = 0.0;
            const endWrite = 0.15;
            const writeProg = Math.max(0, Math.min(1, (localProgress - startWrite) / (endWrite - startWrite)));
            const charsToShow = Math.floor(writeProg * scene05.name.length);

            return (
              <span className="relative">
                {scene05.name.substring(0, charsToShow)}
                <span className={`w-1 h-[1em] bg-[#0f1219] inline-block align-middle ml-1 ${writeProg >= 1 ? 'opacity-0' : 'animate-pulse'}`}></span>
              </span>
            );
          })()}
        </h1>
        <p
          className="text-sm md:text-xl font-mono uppercase tracking-[0.3em] text-[#0f1219]/60"
          style={{
            opacity: localProgress > 0.10 ? 1 : 0,
            transform: `translateY(${localProgress > 0.10 ? 0 : 20}px)`,
            transition: 'all 0.6s ease-out'
          }}
        >{scene05.role}</p>
      </div>

      {/* Stage 2: Vision - Dramatic Slide from Left + Scale */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        style={{
          opacity: calcOpacity(localProgress, 0.25, 0.48),
          transform: getTransformDirectional(localProgress, 0.25, 0.48, 'left'),
          pointerEvents: localProgress > 0.25 && localProgress < 0.48 ? 'auto' : 'none'
        }}
      >
        <h2 className="text-[11px] font-mono uppercase tracking-[0.4em] text-[#0f1219]/40 mb-8 border-b border-[#0f1219]/10 pb-4 w-full max-w-[200px] mx-auto">{scene05.visionTitle}</h2>
        <p className="text-2xl md:text-5xl font-serif leading-[1.3] text-[#0f1219] drop-shadow-sm font-medium tracking-tight"
          style={{
            clipPath: `inset(0 ${(1 - calcOpacity(localProgress, 0.25, 0.48)) * 100}% 0 0)`
          }}
        >{scene05.visionText}</p>
      </div>

      {/* Stage 3: Skills - Rain / Cascade Effect */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-6 transition-all duration-[800ms] ease-out will-change-transform"
        style={{
          opacity: calcOpacity(localProgress, 0.48, 0.70),
          pointerEvents: localProgress > 0.48 && localProgress < 0.70 ? 'auto' : 'none'
        }}
      >
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/50 mb-12"
          style={{ opacity: Number(localProgress > 0.50), transition: 'opacity 0.4s' }}
        >{scene05.skillsTitle}</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto pointer-events-none">
          {scene05.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-6 py-3.5 md:py-4 md:px-8 border border-[#0f1219]/10 rounded-[20px] bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md font-bold text-lg md:text-xl text-[#0f1219] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] pointer-events-auto"
              style={{
                transform: getRainTransform(localProgress, 0.48, 0.70, idx, scene05.skills.length, mousePos.x, mousePos.y),
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Stage 4: Unified Certifications Terminal (0.70 -> 0.99) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-6xl mx-auto px-6 transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
        style={{
          opacity: calcOpacity(localProgress, 0.70, 0.99),
          transform: getTransformDirectional(localProgress, 0.70, 0.99, 'up'),
          pointerEvents: localProgress > 0.70 && localProgress < 0.99 ? 'auto' : 'none'
        }}
      >
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/60 mb-10">{scene05.certificationsTitle}</h2>

        <div className="relative flex justify-center items-center w-full max-w-2xl mx-auto h-[350px] md:h-[400px] mb-8">
          {(() => {
            // Find which certification should be active based on progress inside the 0.70 -> 0.99 window
            const stEnd = 0.99;
            const stStart = 0.70;
            const validProg = Math.max(0, Math.min(1, (localProgress - stStart) / (stEnd - stStart)));
            const numCerts = Math.max(1, scene05.featuredCertifications.length);

            // Use 85% of the phase for scrolling certs, leaving 15% for the exit.
            const adjustedProg = Math.min(1, validProg / 0.85);
            // - 0.001 to prevent index out of bounds at exactly 1.0 progress
            let currentIdx = Math.floor(adjustedProg * numCerts - 0.001);
            if (currentIdx < 0) currentIdx = 0;

            const activeCert = scene05.featuredCertifications[currentIdx];

            // Animation for individual cert swapping effect (scale and pop-in per sub-phase)
            const iterProg = (adjustedProg * numCerts) % 1;
            const iterScale = iterProg < 0.1 ? 0.9 + (iterProg * 1) : 1;
            const iterOpacity = iterProg < 0.1 ? iterProg * 10 : (iterProg > 0.9 ? (1 - iterProg) * 10 : 1);

            // When progress is exactly 1 (past 0.85 fraction), it freezes the last card.
            const showScale = adjustedProg >= 1 ? 1 : iterScale;
            const showOpacity = adjustedProg >= 1 ? 1 : iterOpacity;

            if (!activeCert) return null;

            return (
              <div
                className="w-full h-full border border-black/10 rounded-[32px] bg-gradient-to-tr from-white/95 to-white/70 backdrop-blur-xl shadow-2xl p-10 flex flex-col justify-center items-center absolute inset-0 transition-transform will-change-transform duration-200"
                style={{
                  transform: `scale(${showScale}) translateY(${(1 - showScale) * -50}px)`,
                  opacity: showOpacity
                }}
              >
                <div className="w-[120px] h-[120px] mb-8 rounded-2xl bg-black/5 flex items-center justify-center p-4">
                  {activeCert.logoSrc ? (
                    <img src={activeCert.logoSrc} alt={activeCert.issuer} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  ) : (
                    <span className="text-4xl text-black/20 font-serif">★</span>
                  )}
                </div>

                <h3 className="font-serif text-2xl md:text-4xl leading-tight mb-4 text-[#0f1219] font-medium max-w-[80%] drop-shadow-sm">
                  {activeCert.title}
                </h3>

                <div className="flex items-center gap-4 mt-2">
                  <span className="px-4 py-1.5 rounded-full bg-black/5 text-[12px] font-mono uppercase tracking-widest text-[#0f1219]/60 font-bold border border-black/5">
                    {activeCert.issuer}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  <span className="text-[14px] font-mono tracking-widest text-[#0f1219]/40 font-bold">
                    {activeCert.year}
                  </span>
                </div>

                {activeCert.credentialUrl && activeCert.credentialUrl !== '#' && (
                  <a
                    href={activeCert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-6 right-6 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    ↗
                  </a>
                )}
              </div>
            );
          })()}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center w-full relative z-50">
          <a
            href={scene05.actionHref === '#' ? undefined : scene05.actionHref}
            onClick={scene05.actionHref === '#' ? (e) => e.preventDefault() : undefined}
            className={`inline-flex items-center justify-center px-8 py-3.5 md:py-4 rounded-full bg-[#0f1219] text-white font-medium text-sm md:text-[15px] tracking-wide transition-colors shadow-lg shadow-[#0f1219]/20 ${scene05.actionHref !== '#' ? 'cursor-pointer hover:bg-[#0f1219]/80' : 'cursor-default opacity-80'}`}
          >
            {scene05.actionLabel}
          </a>
        </div>
      </div>

      {/* Time Scrubber */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 lg:w-64 h-1 bg-[#0f1219]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0f1219] transition-all duration-75 ease-linear"
          style={{ width: `${clamp(localProgress * 100, 0, 100)}%` }}
        />
      </div>
    </section>
  );
};
