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

  const timeline = useMemo(
    () => siteConfig.journeyTimeline.filter((item) => item.visible),
    [siteConfig.journeyTimeline],
  );

  const rhythmValue = (setting: 'tight' | 'balanced' | 'linger', base: number) => {
    if (setting === 'tight') return base * 0.7;
    if (setting === 'linger') return base * 1.35;
    return base;
  };

  const localProgress = progress;
  const textFade = rhythmValue(aboutMotion.textRhythm, 0.06);
  const textWindow = rhythmValue(aboutMotion.textRhythm, 0.12);
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

  const statementsStart = 0.18;
  const statementsEnd = 0.6;
  const statementsWindow = statements.length > 0 ? (statementsEnd - statementsStart) / statements.length : 0.18;

  const certificationsStart = 0.64;
  const certificationsEnd = 0.97;
  const certWindow =
    certifications.length > 0
      ? (certificationsEnd - certificationsStart) / certifications.length
      : certificationsEnd - certificationsStart;

  const experienceStart = 0.82;
  const experienceEnd = 1.02;

  const renderStatementTransform = (p: number, start: number, end: number) => {
    if (aboutMotion.textSequenceStyle === 'slice') {
      return `${getTransformDirectional(p, start, end, 'left', textFade)} skewY(${(1 - clamp01((p - start) / (end - start))) * 6 - 3}deg)`;
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

      {/* Hero */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          opacity: calcOpacity(localProgress, -0.1, 0.24),
          transform: getTransformDirectional(localProgress, -0.1, 0.24, 'blur-in'),
          pointerEvents: localProgress >= 0 && localProgress < 0.24 ? 'auto' : 'none',
        }}
      >
        {scene05.portraitImage ? (
          <img
            src={scene05.portraitImage}
            alt={scene05.portraitAlt || 'Portrait'}
            className="mb-8 h-32 w-32 rounded-full border-4 border-white object-cover shadow-2xl drop-shadow-xl md:h-40 md:w-40"
            style={{
              opacity: localProgress > -0.05 ? 1 : 0,
              transform: `scale(${localProgress > -0.05 ? 1 : 0.8})`,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ) : null}
        <h1 className="relative mb-3 min-h-[1.2em] inline-block text-5xl font-serif font-light tracking-tight text-[#0f1219] drop-shadow-2xl md:text-7xl">
          {(() => {
            const startWrite = 0.0;
            const endWrite = 0.16;
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
        <p
          className="text-sm font-mono uppercase tracking-[0.3em] text-[#0f1219]/60 md:text-xl"
          style={{
            opacity: localProgress > 0.1 ? 1 : 0,
            transform: `translateY(${localProgress > 0.1 ? 0 : 20}px)`,
            transition: 'all 0.6s ease-out',
          }}
        >
          {scene05.role}
        </p>
      </div>

      {/* Statements */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:gap-6">
          {statements.map((statement, index) => {
            const start = statementsStart + statementsWindow * index;
            const end = start + statementsWindow;
            const opacity = calcOpacity(localProgress, start, end, textFade);
            const transform = renderStatementTransform(localProgress, start, end);

            return (
              <p
                key={`${statement}-${index}`}
                className="font-serif text-[2.2rem] leading-[1.14] text-[#0f1219] drop-shadow-md md:text-6xl"
                style={{
                  opacity,
                  transform,
                  pointerEvents: opacity > 0.1 ? 'auto' : 'none',
                  transition: 'transform 0.6s ease, opacity 0.6s ease',
                  mixBlendMode: 'multiply',
                }}
              >
                {statement}
              </p>
            );
          })}
        </div>
      </div>

      {/* Skills */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: calcOpacity(localProgress, 0.52, 0.8, 0.08),
          pointerEvents: localProgress > 0.52 && localProgress < 0.82 ? 'auto' : 'none',
        }}
      >
        <h2 className="mb-10 text-[11px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/58">{scene05.skillsTitle}</h2>
        <div className="relative flex max-w-5xl flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {scene05.skills.map((skill, idx) => {
            const baseStyle =
              aboutMotion.skillMode === 'tiles'
                ? {
                    transform: `translate3d(${Math.sin(idx + mousePos.x) * 16}px, ${
                      Math.cos(idx + mousePos.y) * 12
                    }px, 0) scale(${0.96 + (Math.sin(idx * 1.3) + 1) * 0.02})`,
                  }
                : {
                    transform: getRainTransform(localProgress, 0.52, 0.8, idx, scene05.skills.length, mousePos.x, mousePos.y),
                  };

            return (
              <span
                key={`${skill}-${idx}`}
                className="pointer-events-auto rounded-[18px] border border-[#0f1219]/10 bg-gradient-to-b from-white/90 to-white/70 px-6 py-3.5 text-lg font-bold text-[#0f1219] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-md md:px-8 md:text-xl"
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

      {/* Certifications */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: calcOpacity(localProgress, certificationsStart, certificationsEnd, certificationFade),
          pointerEvents:
            localProgress > certificationsStart && localProgress < certificationsEnd ? 'auto' : 'none',
        }}
      >
        <h2 className="mb-8 text-[11px] font-mono uppercase tracking-[0.2em] text-[#0f1219]/60">
          {scene05.certificationsTitle}
        </h2>
        <div className="relative flex h-[360px] w-full max-w-2xl items-center justify-center md:h-[420px]">
          {certifications.map((cert, idx) => {
            const start = certificationsStart + certWindow * idx;
            const end = start + certWindow;
            const opacity = calcOpacity(localProgress, start, end, certificationFade);
            const transform = getCardTransform(localProgress, start, end, idx, certifications.length, certificationFade);

            return (
              <article
                key={cert.id}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[28px] border border-black/8 bg-gradient-to-tr from-white/95 to-white/70 p-10 shadow-2xl backdrop-blur-xl"
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
                <h3 className="max-w-[90%] text-center font-serif text-2xl font-semibold leading-tight text-[#0f1219] md:text-4xl">
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={scene05.actionHref === '#' ? undefined : scene05.actionHref}
            onClick={scene05.actionHref === '#' ? (e) => e.preventDefault() : undefined}
            className="inline-flex items-center justify-center rounded-full bg-[#0f1219] px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg shadow-[#0f1219]/20 transition-colors hover:bg-[#0f1219]/85"
          >
            {scene05.actionLabel}
          </a>
        </div>
      </div>

      {/* Experience + Companies */}
      <div
        className="absolute inset-0 flex items-end justify-center px-6 pb-16"
        style={{
          opacity: calcOpacity(localProgress, experienceStart, experienceEnd, 0.1),
          pointerEvents: localProgress > experienceStart ? 'auto' : 'none',
        }}
      >
        <div className="flex w-full max-w-5xl flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {companies.map((company, idx) => (
              <span
                key={company.id}
                className="rounded-full border border-[#0f1219]/12 bg-white/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/70 shadow-sm"
                style={{
                  transform: `translateY(${Math.sin(idx + localProgress * 10) * 6}px)`,
                  transition: 'transform 0.5s ease',
                }}
              >
                {company.name}
              </span>
            ))}
          </div>

          {timeline.length > 0 ? (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-[#0f1219]/12 bg-white/70 p-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.2)]">
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
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0f1219]/50">{item.title}</span>
                  </div>
                  <div className="text-lg font-semibold text-[#0f1219]">{item.role}</div>
                  <p className="text-sm text-[#0f1219]/72">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null}
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
