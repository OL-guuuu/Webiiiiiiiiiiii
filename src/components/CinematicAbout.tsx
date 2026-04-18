import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import type { SiteCardAnimationStyle, SiteTextAnimationStyle } from '../config/siteConfig';
import { getButtonClass } from './designSystem';

const DEFAULT_LOOP_MS = 3200;
const DEFAULT_CERT_LOOP_MS = 3600;

interface CinematicAboutProps {
  progress: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const buildTextVariants = (style: SiteTextAnimationStyle, intensity: number) => {
  const eased = clamp(intensity, 0.2, 1);
  const distance = 40 * eased;

  switch (style) {
    case 'typewriter':
      return {
        initial: { opacity: 0, filter: 'blur(12px)', y: distance },
        animate: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.65, ease: [0.22, 0.82, 0.22, 1] } },
        exit: { opacity: 0, filter: 'blur(18px)', y: -distance * 0.4, transition: { duration: 0.4 } },
      };
    case 'glitch':
      return {
        initial: { opacity: 0, x: -distance * 0.6, skewX: 4 },
        animate: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.65, ease: [0.19, 1, 0.22, 1] } },
        exit: { opacity: 0, x: distance * 0.6, skewX: -4, transition: { duration: 0.35 } },
      };
    case 'fade':
      return {
        initial: { opacity: 0, y: distance * 0.25 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
        exit: { opacity: 0, y: -distance * 0.25, transition: { duration: 0.35 } },
      };
    case 'minimal':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };
    case 'cinematic':
    default:
      return {
        initial: { opacity: 0, y: distance, letterSpacing: '0.08em' },
        animate: { opacity: 1, y: 0, letterSpacing: '0em', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
        exit: { opacity: 0, y: -distance * 0.35, letterSpacing: '0.1em', transition: { duration: 0.45 } },
      };
  }
};

const buildCardVariants = (style: SiteCardAnimationStyle, index: number, intensity: number) => {
  const eased = clamp(intensity, 0.2, 1);
  const baseDelay = index * 0.08;

  switch (style) {
    case 'stack':
      return {
        initial: { opacity: 0, y: 90 * eased, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { delay: baseDelay, duration: 0.8, ease: [0.19, 1, 0.22, 1] } },
        exit: { opacity: 0, y: -70 * eased, scale: 0.92, transition: { duration: 0.45 } },
      };
    case 'orbit':
      return {
        initial: { opacity: 0, rotate: -8, y: 28 * eased, scale: 0.92 },
        animate: { opacity: 1, rotate: 0, y: 0, scale: 1, transition: { delay: baseDelay, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
        exit: { opacity: 0, rotate: 10, y: 34 * eased, scale: 0.9, transition: { duration: 0.5 } },
      };
    case 'pulse':
      return {
        initial: { opacity: 0, scale: 0.82 },
        animate: { opacity: 1, scale: 1, transition: { delay: baseDelay, duration: 0.65, ease: [0.22, 0.82, 0.22, 1] } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.35 } },
      };
    case 'cascade':
      return {
        initial: { opacity: 0, x: (index % 2 === 0 ? -1 : 1) * 60 * eased, y: 40 * eased },
        animate: { opacity: 1, x: 0, y: 0, transition: { delay: baseDelay, duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
        exit: { opacity: 0, x: (index % 2 === 0 ? 1 : -1) * 40 * eased, y: 24 * eased, transition: { duration: 0.4 } },
      };
    case 'none':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { delay: baseDelay, duration: 0.45 } },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      };
  }
};

export const CinematicAbout: React.FC<CinematicAboutProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05 } = siteConfig;

  const aboutMotion = siteConfig.motion.about;
  const textStyle = aboutMotion.textStyle;
  const cardStyle = aboutMotion.cardStyle;
  const intensity = aboutMotion.intensity;
  const heroLoopMs =
    scene05.animations?.heroLoopMs ??
    aboutMotion.heroLoopMs ??
    DEFAULT_LOOP_MS;
  const certificateLoopMs =
    scene05.animations?.certificateLoopMs ??
    aboutMotion.cardLoopMs ??
    DEFAULT_CERT_LOOP_MS;
  const timelineLoopMs = aboutMotion.loopMs ?? 4200;

  const isActive = progress > 0.02 && progress <= 1.02;
  const textVariants = useMemo(() => buildTextVariants(textStyle, intensity), [textStyle, intensity]);

  const heroStatements = useMemo(() => {
    if (scene05.heroStatements.length > 0) return scene05.heroStatements;
    return [scene05.visionText, scene05.aiText].filter(Boolean);
  }, [scene05.heroStatements, scene05.visionText, scene05.aiText]);

  const featuredCertifications = useMemo(
    () => scene05.featuredCertifications.filter((item) => item.visible),
    [scene05.featuredCertifications],
  );

  const visibleTimeline = useMemo(
    () => siteConfig.journeyTimeline.filter((item) => item.visible),
    [siteConfig.journeyTimeline],
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);

  useEffect(() => {
    setHeroIndex(0);
    setCertIndex(0);
    setTimelineIndex(0);
  }, [isActive, heroStatements.length, featuredCertifications.length, visibleTimeline.length]);

  useEffect(() => {
    if (!isActive || heroStatements.length <= 1) return;
    if (typeof window === 'undefined') return;
    const safeLoop = Math.max(1200, heroLoopMs);
    const id = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroStatements.length);
    }, safeLoop);
    return () => window.clearInterval(id);
  }, [heroLoopMs, heroStatements.length, isActive]);

  useEffect(() => {
    if (!isActive || featuredCertifications.length <= 1) return;
    if (typeof window === 'undefined') return;
    const safeLoop = Math.max(1600, certificateLoopMs);
    const id = window.setInterval(() => {
      setCertIndex((prev) => (prev + 1) % featuredCertifications.length);
    }, safeLoop);
    return () => window.clearInterval(id);
  }, [certificateLoopMs, featuredCertifications.length, isActive]);

  useEffect(() => {
    if (!isActive || visibleTimeline.length <= 1) return;
    if (typeof window === 'undefined') return;
    const safeLoop = Math.max(1600, timelineLoopMs);
    const id = window.setInterval(() => {
      setTimelineIndex((prev) => (prev + 1) % visibleTimeline.length);
    }, safeLoop);
    return () => window.clearInterval(id);
  }, [isActive, timelineLoopMs, visibleTimeline.length]);

  const currentHero = heroStatements[heroIndex] ?? '';
  const currentCert = featuredCertifications[certIndex] ?? featuredCertifications[0];
  const currentTimeline = visibleTimeline[timelineIndex] ?? visibleTimeline[0];

  const cardVariants = useMemo(
    () => buildCardVariants(cardStyle, 0, intensity),
    [cardStyle, intensity],
  );

  if (!scene05.animations?.enabled) return null;

  return (
    <section
      className={`fixed inset-0 z-[190] flex items-center justify-center overflow-hidden transition-all duration-[800ms] ease-out text-[#0f1219] ${
        isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 translate-y-4'
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

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 px-6 pb-16 pt-10 text-center md:px-10 lg:px-12">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-8">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0f1219]/12 bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f1219]/65" />
              {scene05.badge}
            </span>
            <div className="flex items-center gap-4 md:gap-6">
              {scene05.portraitImage ? (
                <motion.img
                  key={scene05.portraitImage}
                  src={scene05.portraitImage}
                  alt={scene05.portraitAlt || scene05.name}
                  className="h-16 w-16 rounded-full border-4 border-white shadow-xl object-cover md:h-20 md:w-20"
                  initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                />
              ) : null}
              <div className="text-left">
                <motion.h1
                  className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#0f1219]"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {scene05.name}
                </motion.h1>
                <motion.p
                  className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#0f1219]/60"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.55 } }}
                >
                  {scene05.role}
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              className="mx-auto max-w-4xl px-2 text-balance font-serif text-3xl leading-[1.25] text-[#0f1219] shadow-[#0f1219]/6 md:text-5xl lg:text-[3.4rem]"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentHero}
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 h-1 w-full rounded-full bg-[#0f1219]/10">
            <div
              className="h-full rounded-full bg-[#0f1219]"
              style={{
                width: `${((heroIndex + 1) / Math.max(heroStatements.length, 1)) * 100}%`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-center gap-3 md:gap-4">
          {scene05.skills.map((skill, idx) => (
            <motion.span
              key={skill}
              className="rounded-[16px] border border-[#0f1219]/12 bg-white/85 px-4 py-2 text-sm font-semibold text-[#0f1219] shadow-[0_24px_48px_-18px_rgba(0,0,0,0.2)] md:px-6 md:py-3 md:text-base"
              variants={buildCardVariants(cardStyle, idx, intensity)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {currentTimeline ? (
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[18px] border border-[#0f1219]/10 bg-white/85 p-5 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTimeline.id}
                className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
                variants={buildCardVariants(cardStyle, 0, intensity)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0f1219]/55">
                    {currentTimeline.date}
                  </p>
                  <h3 className="text-xl font-semibold text-[#0f1219] md:text-2xl">{currentTimeline.role}</h3>
                  <p className="text-sm leading-relaxed text-[#0f1219]/75 md:text-base">{currentTimeline.description}</p>
                </div>
                <span className="rounded-full border border-[#0f1219]/12 bg-[#0f1219]/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/70">
                  {currentTimeline.title}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        {currentCert ? (
          <div className="relative w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCert.id}
                className="relative mx-auto flex w-full flex-col items-center gap-4 rounded-[28px] border border-[#0f1219]/12 bg-gradient-to-tr from-white/95 to-white/70 p-8 text-center shadow-2xl backdrop-blur-xl md:p-10"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex items-center gap-3 text-[#0f1219]/60">
                  <span className="rounded-full bg-[#0f1219]/6 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]">
                    {currentCert.year}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#0f1219]/20" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                    {currentCert.issuer}
                  </span>
                </div>

                <h3 className="max-w-2xl text-2xl font-semibold leading-tight text-[#0f1219] md:text-3xl">
                  {currentCert.title}
                </h3>

                <div className="flex items-center gap-3">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#0f1219]/12 bg-white">
                    {currentCert.logoSrc ? (
                      <img
                        src={currentCert.logoSrc}
                        alt={currentCert.issuer}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/60">
                        {currentCert.issuer.slice(0, 3)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/60">
                      Credential
                    </p>
                    <p className="text-sm font-semibold text-[#0f1219]">{scene05.credentialButtonLabel}</p>
                  </div>
                  {currentCert.credentialUrl && currentCert.credentialUrl !== '#' ? (
                    <a
                      href={currentCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#0f1219]/12 bg-[#0f1219] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f1219]/85"
                    >
                      ↗
                    </a>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 h-1 w-full rounded-full bg-[#0f1219]/10">
              <div
                className="h-full rounded-full bg-[#0f1219]"
                style={{
                  width: `${((certIndex + 1) / Math.max(featuredCertifications.length, 1)) * 100}%`,
                  transition: 'width 0.35s ease',
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-2 flex flex-col items-center gap-4">
          <a
            href={scene05.actionHref === '#' ? undefined : scene05.actionHref}
            onClick={scene05.actionHref === '#' ? (e) => e.preventDefault() : undefined}
            className={getButtonClass(
              siteConfig.designSystem.components.scene05ActionButtonVariant,
              'light',
              'lg',
              'min-w-[200px] justify-center',
            )}
          >
            {scene05.actionLabel}
          </a>
          {scene05.aiTags.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#0f1219]/60">
              {scene05.aiTags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#0f1219]/10 bg-white/80 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 px-6">
          <div className="h-1 w-full max-w-[320px] rounded-full bg-[#0f1219]/8 overflow-hidden">
            <div
              className="h-full bg-[#0f1219]"
              style={{
                width: `${clamp(progress * 100, 0, 100)}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/60">
            WebGL-inspired sequence
          </span>
        </div>
      </div>
    </section>
  );
};
