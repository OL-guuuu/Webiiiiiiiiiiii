import React, { useMemo, useState, useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface CinematicAboutProps {
  progress: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const CinematicAbout: React.FC<CinematicAboutProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05 } = siteConfig;
  const aboutMotion = siteConfig.animation.sections.about;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothProgress, setSmoothProgress] = useState(progress);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    let active = true;

    const step = () => {
      setSmoothProgress((prev) => {
        const next = clamp01(prev + (progress - prev) * 0.18);
        if (!active) return prev;
        if (Math.abs(next - progress) < 0.0004) return progress;
        frame = requestAnimationFrame(step);
        return next;
      });
    };

    frame = requestAnimationFrame(step);

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress]);

  const statements = useMemo(() => {
    const narrative = [scene05.visionText, ...scene05.storyParagraphs];
    return narrative.filter(Boolean);
  }, [scene05.storyParagraphs, scene05.visionText]);

  const certifications = useMemo(() => {
    const visible = scene05.featuredCertifications.filter((item) => item.visible);
    if (visible.length > 0) return visible;
    return scene05.certifications.map((title, index) => ({
      id: `legacy-cert-${index}`,
      title,
      issuer: scene05.certificationsTitle,
      year: '',
      credentialUrl: '#',
      logoSrc: '',
      visible: true,
    }));
  }, [scene05.certifications, scene05.certificationsTitle, scene05.featuredCertifications]);

  const companies = useMemo(
    () => scene05.companyLogos.filter((item) => item.visible),
    [scene05.companyLogos],
  );

  const learningLogos = useMemo(
    () => scene05.learningLogos.filter((item) => item.visible),
    [scene05.learningLogos],
  );

  const timeline = useMemo(
    () => siteConfig.journeyTimeline.filter((item) => item.visible),
    [siteConfig.journeyTimeline],
  );

  const rhythmValue = (setting: 'tight' | 'balanced' | 'linger', base: number) => {
    if (setting === 'tight') return base * 0.7;
    if (setting === 'linger') return base * 1.35;
    return base;
  };

  const localProgress = smoothProgress;
  const textFade = rhythmValue(aboutMotion.textRhythm, 0.06);
  const certificationFade = rhythmValue(aboutMotion.certificationRhythm, 0.06);

  const calcOpacity = (p: number, start: number, end: number, fadeLen = 0.05) => {
    if (p < start || p > end) return 0;
    if (p < start + fadeLen) return (p - start) / fadeLen;
    if (p > end - fadeLen) return (end - p) / fadeLen;
    return 1;
  };

  const getTransformDirectional = (
    p: number,
    start: number,
    end: number,
    direction: 'left' | 'right' | 'up' | 'down' | 'zoom' | 'cinematic-text' | 'letter-spacing' | 'blur-in',
    fadeLen = 0.05,
  ) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - (p - start) / fadeLen;
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    const totalProg = Math.max(0, Math.min(1, (p - start) / (end - start)));

    if (direction === 'left') return `translateX(${enterProg * -22 + exitProg * 22}vw)`;
    if (direction === 'right') return `translateX(${enterProg * 22 + exitProg * -22}vw)`;
    if (direction === 'up') return `translateY(${enterProg * 24 + exitProg * -24}vh)`;
    if (direction === 'down') return `translateY(${enterProg * -24 + exitProg * 24}vh)`;
    if (direction === 'zoom') return `scale(${1 + totalProg * 0.16 + enterProg * -0.28 + exitProg * 0.28})`;
    if (direction === 'cinematic-text')
      return `scale(${1 + totalProg * 0.05}) translateY(${enterProg * 46 + exitProg * -46}px)`;
    if (direction === 'letter-spacing')
      return `scale(${1 - totalProg * 0.05}) translateY(${enterProg * -26 + exitProg * 26}px)`;
    if (direction === 'blur-in') return `scale(${1 + enterProg * 0.45 + exitProg * -0.2}) translate(0,0)`;
    return 'translate(0, 0)';
  };

  const getRainTransform = (
    p: number,
    start: number,
    end: number,
    index: number,
    total: number,
    mouseX: number,
    mouseY: number,
    fadeLen = 0.05,
  ) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - (p - start) / fadeLen;
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    const pxSeed1 = ((index * 137) % 100) / 100;
    const pxSeed2 = ((index * 251) % 100) / 100;
    const startDelay = index * 0.05;
    const rndDelay = pxSeed1 * 0.12;

    const stEnt = Math.max(0, Math.min(1, enterProg * (1 + startDelay + rndDelay) - startDelay));
    const stEx = Math.max(0, Math.min(1, exitProg * (1 + startDelay + rndDelay) - startDelay));

    const yDrop = stEnt * -1200;
    const yFall = stEx * 1200;
    const dropRot = stEnt * (pxSeed2 > 0.5 ? 90 : -90);
    const exitRot = stEx * (pxSeed1 > 0.5 ? -90 : 90);

    const pX = (1 - stEnt - stEx) * mouseX * (pxSeed1 - 0.5) * 60;
    const pY = (1 - stEnt - stEx) * mouseY * (pxSeed2 - 0.5) * 60;
    const scale = 1 - stEnt * 0.7 - stEx * 0.7;

    return `translate3d(${pX}px, ${yDrop + yFall + pY}px, 0) rotate(${dropRot + exitRot}deg) scale(${scale})`;
  };

  const getCardTransform = (
    p: number,
    start: number,
    end: number,
    index: number,
    total: number,
    fadeLen = 0.05,
  ) => {
    let enterProg = 0;
    let exitProg = 0;
    if (p < start) enterProg = 1;
    else if (p > end) exitProg = 1;
    else if (p < start + fadeLen) enterProg = 1 - (p - start) / fadeLen;
    else if (p > end - fadeLen) exitProg = (p - (end - fadeLen)) / fadeLen;

    const staggerEnter = Math.max(0, Math.min(1, enterProg + index * 0.12));
    const staggerExit = Math.max(0, Math.min(1, exitProg + index * 0.12));

    if (aboutMotion.cardEntranceStyle === 'orbit') {
      const orbitRadius = 40 + index * 16;
      const angle = (index / Math.max(1, total)) * Math.PI * 2;
      const enterLift = staggerEnter * 140;
      const exitLift = staggerExit * -140;
      return `translate3d(${Math.cos(angle) * orbitRadius}px, ${enterLift + exitLift + Math.sin(angle) * orbitRadius}px, 0) rotate(${(index % 2 === 0 ? 1 : -1) * (18 + staggerEnter * 40 - staggerExit * 40)}deg) scale(${1 - staggerEnter * 0.3 - staggerExit * 0.3})`;
    }

    if (aboutMotion.cardEntranceStyle === 'slide') {
      return `translateX(${(staggerEnter * 220 + staggerExit * -220) * (index % 2 === 0 ? -1 : 1)}px) rotate(${(index % 2 === 0 ? -1 : 1) * (staggerEnter * 18 - staggerExit * 18)}deg) scale(${1 - staggerEnter * 0.25 - staggerExit * 0.25})`;
    }

    return `translateY(${index * 18 + staggerEnter * 140 + staggerExit * -140}px) scale(${1 - index * 0.04 - staggerEnter * 0.28 - Math.max(0, exitProg) * 0.28})`;
  };

  const isActive = progress > 0.01 && progress <= 1.0;

  const heroStart = -0.05;
  const heroEnd = 0.28;
  const statementsStart = 0.24;
  const statementsEnd = 0.52;
  const skillsStart = 0.48;
  const skillsEnd = 0.76;
  const certificationsStart = 0.62;
  const certificationsEnd = 0.94;
  const experienceStart = 0.72;
  const experienceEnd = 1.08;

  const statementsWindow = statements.length > 0 ? (statementsEnd - statementsStart) / statements.length : 0.18;
  const certWindow =
    certifications.length > 0
      ? (certificationsEnd - certificationsStart) / certifications.length
      : certificationsEnd - certificationsStart;

  const sectionProgress = (p: number, start: number, end: number) => clamp01((p - start) / (end - start));

  const renderStatementTransform = (p: number, start: number, end: number) => {
    if (aboutMotion.textSequenceStyle === 'slice') {
      return `${getTransformDirectional(p, start, end, 'left', textFade)} skewY(${(1 - clamp01((p - start) / (end - start))) * 4 - 2}deg)`;
    }
    if (aboutMotion.textSequenceStyle === 'typewriter') {
      return getTransformDirectional(p, start, end, 'letter-spacing', textFade);
    }
    return getTransformDirectional(p, start, end, 'cinematic-text', textFade);
  };

  const backgroundOpacity = calcOpacity(localProgress, -0.05, 0.2, 0.12) + calcOpacity(localProgress, 0.6, 1, 0.2) * 0.4;

  return (
    <section
      className={`fixed inset-0 z-[190] flex items-center justify-center overflow-hidden transition-all duration-[800ms] ease-out text-[#0f1219] ${
        isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isActive ? 1 : 0,
          background:
            'radial-gradient(1200px 680px at 8% 0%, rgba(66,109,176,0.12), transparent 64%), radial-gradient(900px 560px at 96% 16%, rgba(96,132,185,0.1), transparent 68%), linear-gradient(180deg, #edf2fa 0%, #f9fbff 42%, #eef2f9 100%)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_38%),radial-gradient(circle_at_70%_10%,rgba(181,216,255,0.32),transparent_42%)]"
        style={{ opacity: backgroundOpacity }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[60%] w-[60%] rotate-12 rounded-[42%] border border-white/20 bg-white/4 blur-3xl" />
      </div>

      <div className="absolute inset-0 px-5 py-10 md:px-10 md:py-14">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-7">
          <div className="grid h-full gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="flex flex-col gap-6">
              <div
                className="group relative overflow-hidden rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-[0_28px_60px_-26px_rgba(0,0,0,0.35)] backdrop-blur-[16px] md:p-8"
                style={{
                  opacity: calcOpacity(localProgress, heroStart, heroEnd, 0.14),
                  transform: `translateY(${(1 - sectionProgress(localProgress, heroStart, heroEnd)) * 20 - 12}px)`,
                  pointerEvents: localProgress > heroStart && localProgress < heroEnd ? 'auto' : 'none',
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(96,132,185,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(15,18,25,0.06),transparent_40%)]" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(15,18,25,0.08),transparent_60%)]"
                      style={{
                        transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0) scale(1.08)`,
                        transition: 'transform 0.4s ease-out',
                      }}
                    />
                    {scene05.portraitImage ? (
                      <img
                        src={scene05.portraitImage}
                        alt={scene05.portraitAlt || 'Portrait'}
                        className="relative z-10 h-32 w-32 rounded-full border-4 border-white object-cover shadow-2xl drop-shadow-xl md:h-40 md:w-40"
                        style={{
                          opacity: localProgress > -0.05 ? 1 : 0,
                          transform: `scale(${localProgress > -0.05 ? 1 : 0.9})`,
                          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#0f1219]/14 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/72 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0f1219]/70" />
                        {scene05.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#0f1219]/10 bg-[#0f1219]/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f1219]/72">
                        {scene05.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                      <h1 className="relative inline-block min-h-[1.2em] text-5xl font-serif font-light tracking-tight text-[#0f1219] drop-shadow-2xl md:text-6xl">
                        {(() => {
                          const startWrite = 0.0;
                          const endWrite = 0.18;
                          const writeProg = clamp01((localProgress - startWrite) / (endWrite - startWrite));
                          const charsToShow = Math.floor(writeProg * scene05.name.length);
                          return (
                            <span className="relative">
                              {scene05.name.substring(0, charsToShow)}
                              <span
                                className={`ml-1 inline-block h-[1em] w-1 align-middle bg-[#0f1219] ${
                                  writeProg >= 1 ? 'opacity-0' : 'animate-pulse'
                                }`}
                              />
                            </span>
                          );
                        })()}
                      </h1>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-[#0f1219]/8 bg-white/70 p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]">
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/60">
                          {scene05.visionTitle}
                        </p>
                        <p className="text-sm text-[#0f1219]/80">{scene05.visionText}</p>
                      </div>
                      <div className="rounded-2xl border border-[#0f1219]/8 bg-white/70 p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]">
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/60">
                          {scene05.aiTitle}
                        </p>
                        <p className="text-sm text-[#0f1219]/80">{scene05.aiText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-[28px] border border-black/8 bg-white/72 p-5 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.2)] backdrop-blur-[12px]"
                style={{
                  opacity: calcOpacity(localProgress, statementsStart, statementsEnd, textFade),
                  transform: `translateY(${(1 - sectionProgress(localProgress, statementsStart, statementsEnd)) * 26 - 8}px)`,
                  pointerEvents: localProgress > statementsStart && localProgress < statementsEnd ? 'auto' : 'none',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-[34px] w-[3px] rounded-full bg-gradient-to-b from-[#0f1219] to-[#38558f]" />
                  <div className="flex flex-col">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/60">
                        {scene05.storyTitle}
                      </p>
                      <p className="text-sm text-[#0f1219]/60">{scene05.portraitCaption || scene05.visionText}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#0f1219]/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0f1219]/70">
                    {Math.round(clamp01(localProgress) * 100)}%
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:gap-5">
                  {statements.map((statement, index) => {
                    const start = statementsStart + statementsWindow * index;
                    const end = start + statementsWindow;
                    const opacity = calcOpacity(localProgress, start, end, textFade);
                    const transform = renderStatementTransform(localProgress, start, end);
                    const railOffset =
                      (index - sectionProgress(localProgress, statementsStart, statementsEnd) * statements.length) * 14;

                    return (
                      <p
                        key={`${statement}-${index}`}
                        className="font-serif text-[1.65rem] leading-[1.18] text-[#0f1219] drop-shadow-sm md:text-[2.2rem]"
                        style={{
                          opacity,
                          transform: `${transform} translateY(${railOffset}px) scale(${1 - Math.abs(railOffset) * 0.003})`,
                          pointerEvents: opacity > 0.1 ? 'auto' : 'none',
                          transition: 'transform 0.6s ease, opacity 0.6s ease',
                        }}
                      >
                        {statement}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className="relative overflow-hidden rounded-[28px] border border-black/8 bg-white/78 p-5 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.2)] backdrop-blur-[14px]"
                style={{
                  opacity: calcOpacity(localProgress, skillsStart, skillsEnd, 0.12),
                  transform: `translateY(${(1 - sectionProgress(localProgress, skillsStart, skillsEnd)) * 20 - 6}px)`,
                  pointerEvents: localProgress > skillsStart && localProgress < skillsEnd ? 'auto' : 'none',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#0f1219]/60">
                    {scene05.skillsTitle}
                  </p>
                  <span className="rounded-full border border-[#0f1219]/10 bg-[#0f1219]/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f1219]/70">
                    {aboutMotion.skillMode === 'rain' ? 'Rain' : 'Tiles'}
                  </span>
                </div>

                <div className="relative mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {scene05.skills.map((skill, idx) => {
                    const baseStyle =
                      aboutMotion.skillMode === 'tiles'
                        ? {
                            transform: `translate3d(${Math.sin(idx + mousePos.x) * 16}px, ${
                              Math.cos(idx + mousePos.y) * 12
                            }px, 0) scale(${0.94 + (Math.sin(idx * 1.2) + 1) * 0.03})`,
                          }
                        : {
                            transform: getRainTransform(
                              localProgress,
                              skillsStart,
                              skillsEnd,
                              idx,
                              scene05.skills.length,
                              mousePos.x,
                              mousePos.y,
                            ),
                          };

                    return (
                      <span
                        key={`${skill}-${idx}`}
                        className="pointer-events-auto rounded-[16px] border border-[#0f1219]/10 bg-gradient-to-b from-white/92 to-white/74 px-4 py-3 text-sm font-semibold text-[#0f1219] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.2)] backdrop-blur-md md:px-5 md:text-base"
                        style={{
                          ...baseStyle,
                          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-[28px] border border-black/8 bg-gradient-to-br from-white/95 to-white/78 p-5 shadow-[0_22px_48px_-24px_rgba(0,0,0,0.25)] backdrop-blur-[16px]"
                style={{
                  opacity: calcOpacity(localProgress, certificationsStart, certificationsEnd, certificationFade),
                  transform: `translateY(${(1 - sectionProgress(localProgress, certificationsStart, certificationsEnd)) * 20 - 8}px)`,
                  pointerEvents:
                    localProgress > certificationsStart && localProgress < certificationsEnd ? 'auto' : 'none',
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#0f1219]/62">
                    {scene05.certificationsTitle}
                  </p>
                  <div className="h-[6px] flex-1 rounded-full bg-[#0f1219]/8">
                    <div
                      className="h-full rounded-full bg-[#0f1219]"
                      style={{ width: `${clamp01(sectionProgress(localProgress, certificationsStart, certificationsEnd)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="relative h-[260px] md:h-[310px]">
                  {certifications.map((cert, idx) => {
                    const start = certificationsStart + certWindow * idx;
                    const end = start + certWindow;
                    const opacity = calcOpacity(localProgress, start, end, certificationFade);
                    const transform = getCardTransform(localProgress, start, end, idx, certifications.length, certificationFade);

                    return (
                      <article
                        key={cert.id}
                        className="absolute inset-0 flex flex-col items-start justify-center gap-4 rounded-[24px] border border-black/8 bg-white/88 p-6 shadow-[0_22px_46px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8"
                        style={{
                          opacity,
                          transform,
                          pointerEvents: opacity > 0.05 ? 'auto' : 'none',
                          transition: 'opacity 0.45s ease, transform 0.7s ease',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5">
                            {cert.logoSrc ? (
                              <img src={cert.logoSrc} alt={cert.issuer} className="h-10 w-10 object-contain" />
                            ) : (
                              <span className="text-xl text-black/30">★</span>
                            )}
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <span className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/60">
                              {cert.issuer}
                            </span>
                            {cert.year ? (
                              <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/40">
                                {cert.year}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <h3 className="max-w-[90%] text-left font-serif text-2xl font-semibold leading-tight text-[#0f1219] md:text-[2.1rem]">
                          {cert.title}
                        </h3>
                        {cert.credentialUrl && cert.credentialUrl !== '#' ? (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[#0f1219]/12 px-5 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-[#0f1219] transition-colors hover:bg-[#0f1219] hover:text-white"
                          >
                            {scene05.credentialButtonLabel}
                          </a>
                        ) : (
                          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#0f1219]/60">
                            {scene05.credentialButtonLabel}
                          </span>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={scene05.actionHref === '#' ? undefined : scene05.actionHref}
                    onClick={scene05.actionHref === '#' ? (e) => e.preventDefault() : undefined}
                    className="inline-flex items-center justify-center rounded-full bg-[#0f1219] px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#0f1219]/20 transition-colors hover:bg-[#0f1219]/85"
                  >
                    {scene05.actionLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div
              className="rounded-[22px] border border-black/8 bg-white/78 p-4 shadow-[0_18px_42px_-22px_rgba(0,0,0,0.22)] backdrop-blur-[12px]"
              style={{
                opacity: calcOpacity(localProgress, experienceStart - 0.08, experienceEnd, 0.12),
                transform: `translateY(${(1 - sectionProgress(localProgress, experienceStart - 0.08, experienceEnd)) * 18 - 6}px)`,
                pointerEvents: localProgress > experienceStart - 0.08 ? 'auto' : 'none',
              }}
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/60">
                {scene05.learningLogosTitle || scene05.badge}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {(learningLogos.length > 0 ? learningLogos : companies).map((item, idx) => (
                  <a
                    key={item.id}
                    href={item.href || '#'}
                    onClick={(e) => {
                      if (!item.href || item.href === '#') e.preventDefault();
                    }}
                    className="flex items-center gap-2 rounded-full border border-[#0f1219]/12 bg-white/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/70 shadow-sm transition-transform"
                    style={{
                      transform: `translateY(${Math.sin(idx + localProgress * 10) * 6}px)`,
                      pointerEvents: item.href && item.href !== '#' ? 'auto' : 'none',
                    }}
                  >
                    {item.logoSrc ? (
                      <img src={item.logoSrc} alt={item.name} className="h-4 w-4 object-contain" />
                    ) : null}
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {timeline.length > 0 ? (
              <div
                className="rounded-[22px] border border-[#0f1219]/10 bg-white/80 p-5 shadow-[0_20px_44px_-24px_rgba(0,0,0,0.25)] backdrop-blur-[12px]"
                style={{
                  opacity: calcOpacity(localProgress, experienceStart, experienceEnd, 0.12),
                  transform: `translateY(${(1 - sectionProgress(localProgress, experienceStart, experienceEnd)) * 18 - 4}px)`,
                  pointerEvents: localProgress > experienceStart ? 'auto' : 'none',
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                    {scene05.storyTitle}
                  </p>
                  <span className="h-[6px] w-20 rounded-full bg-[#0f1219]/10" />
                </div>
                <div className="flex flex-col gap-4">
                  {timeline.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 border-b border-[#0f1219]/10 pb-3 last:border-b-0 last:pb-0"
                      style={{
                        opacity: clamp01(calcOpacity(localProgress, experienceStart + idx * 0.02, experienceEnd, 0.08) + 0.4),
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-black/6 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-[#0f1219]/70">
                          {item.date}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0f1219]/50">
                          {item.title}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-[#0f1219]">{item.role}</div>
                      <p className="text-sm text-[#0f1219]/72">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-[#0f1219]/10 lg:w-64">
        <div
          className="h-full bg-[#0f1219] transition-all duration-75 ease-linear"
          style={{ width: `${clamp01(localProgress) * 100}%` }}
        />
      </div>
    </section>
  );
};
