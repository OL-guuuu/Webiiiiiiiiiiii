import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import CursorAnimationLayer from '../components/CursorAnimationLayer';
import { PersistentUI } from '../components/PersistentUI';
import { GlobalFrameOverlay } from '../components/GlobalFrameOverlay';
import { WebGLFog } from '../components/WebGLFog';
import { getButtonClass, getCardClass, getGlassClass, getScaledRem } from '../components/designSystem';
import { useSiteConfig } from '../context/SiteConfigContext';
import SkillRainCanvas from '../components/SkillRainCanvas';

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const heroTextVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const glassPulse = 'shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white/10 bg-white/5 backdrop-blur-2xl';

export const Home: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { scene05, visibility, animation, globalFrame, introText } = siteConfig;

  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const certRef = useRef<HTMLElement | null>(null);

  const aboutInView = useInView(aboutRef, { amount: 0.35 });
  const certInView = useInView(certRef, { amount: 0.3 });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleNav = (event: Event) => {
      const detail = (event as CustomEvent<{ section: string }>).detail;
      if (!detail) return;
      const section = detail.section.toLowerCase();
      const target =
        section === 'home'
          ? heroRef.current
          : section === 'about'
          ? aboutRef.current
          : section === 'projects' || section === 'testimonials'
          ? certRef.current
          : null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('nav-to-section', handleNav as EventListener);
    return () => window.removeEventListener('nav-to-section', handleNav as EventListener);
  }, []);

  const visibleCerts = useMemo(
    () => scene05.featuredCertifications.filter((item) => item.visible !== false),
    [scene05.featuredCertifications],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050609] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-32 -top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,#c8e1ff,rgba(8,10,20,0))] opacity-60 blur-[120px]" />
        <div className="absolute right-[-12%] top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,#9a7bff,rgba(8,10,20,0))] opacity-50 blur-[140px]" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[480px] -translate-x-1/2 rounded-[60%] bg-gradient-to-b from-white/6 via-white/2 to-transparent opacity-80 blur-[160px]" />
        <WebGLFog />
      </div>

      {visibility.cursorAnimation ? <CursorAnimationLayer animation={animation} /> : null}
      {visibility.globalFrameOverlay ? (
        <GlobalFrameOverlay innerShadowIntensity={0.35} frameConfig={globalFrame} />
      ) : null}
      <PersistentUI isLightMode={aboutInView || certInView} />

      <main className="relative z-20 flex flex-col gap-28 px-6 pb-28 pt-20 sm:px-10 md:px-14 lg:px-20">
        <section
          ref={heroRef}
          id="home"
          className="relative isolate flex min-h-[82vh] flex-col justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-white/[0.02] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_36%)] opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(124,94,255,0.18),transparent_35%)] opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.05))]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6">
              <motion.div
                variants={heroTextVariants}
                initial="hidden"
                animate={hasMounted ? 'visible' : 'hidden'}
                className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.18em]"
              >
                <span className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_6px_rgba(255,255,255,0.08)]" />
                <span className="font-mono text-white/80">{scene05.badge}</span>
              </motion.div>

              <motion.h1
                variants={heroTextVariants}
                initial="hidden"
                animate={hasMounted ? 'visible' : 'hidden'}
                transition={{ delay: 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance font-serif text-[clamp(2.8rem,5vw,4.6rem)] leading-tight text-white"
              >
                {scene05.name}
              </motion.h1>

              <motion.p
                variants={heroTextVariants}
                initial="hidden"
                animate={hasMounted ? 'visible' : 'hidden'}
                transition={{ delay: 0.16, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl text-[clamp(1rem,1.3vw,1.18rem)] leading-relaxed text-white/75"
              >
                {introText}
              </motion.p>

              <motion.div
                variants={heroTextVariants}
                initial="hidden"
                animate={hasMounted ? 'visible' : 'hidden'}
                transition={{ delay: 0.24, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                <span className={getGlassClass(siteConfig.designSystem.components.globalGlassVariant, 'dark', 'px-4 py-2 text-[12px] font-medium text-white/85')}>
                  {scene05.role}
                </span>
                {scene05.aiTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/14 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={heroTextVariants}
                initial="hidden"
                animate={hasMounted ? 'visible' : 'hidden'}
                transition={{ delay: 0.32, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  className={getButtonClass(
                    siteConfig.designSystem.components.scene05ActionButtonVariant,
                    'dark',
                    'lg',
                  )}
                  href={scene05.actionHref}
                >
                  {scene05.actionLabel}
                </a>
                <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-white/55">
                  <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                  {scene05.portraitCaption}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={hasMounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
              transition={{ delay: 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -left-6 -top-6 h-28 w-28 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent)] opacity-60 blur-2xl" />
              <div className="absolute -right-4 bottom-4 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(156,120,255,0.4),transparent)] opacity-80 blur-2xl" />
              <div
                className={`relative overflow-hidden rounded-[28px] ${glassPulse} border-white/12 p-[1px]`}
              >
                <div className="overflow-hidden rounded-[27px] border border-white/8 bg-gradient-to-br from-white/10 via-white/6 to-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
                  <div className="relative aspect-[4/5] w-full">
                    <img
                      src={scene05.portraitImage}
                      alt={scene05.portraitAlt || scene05.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-[14px] border border-white/14 bg-white/6 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-white/85">
                      <span>{scene05.visionTitle}</span>
                      <span className="text-white/60">{scene05.aiTags[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          ref={aboutRef}
          id="about"
          className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/8 via-white/6 to-[#0a0c11] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-12 lg:p-16"
        >
          <div className="absolute inset-0">
            <SkillRainCanvas skills={scene05.skills} active={aboutInView} accentColor="#9cdcff" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em]"
              >
                <span className="h-2 w-2 rounded-full bg-[#9ad5ff] shadow-[0_0_0_6px_rgba(154,213,255,0.25)]" />
                <span className="font-mono text-white/80">{scene05.skillsTitle}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ delay: 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance text-[clamp(2.1rem,3vw,3rem)] font-semibold leading-tight text-white"
              >
                {scene05.storyTitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 26 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                transition={{ delay: 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl text-[clamp(1rem,1.25vw,1.12rem)] leading-relaxed text-white/78"
              >
                {scene05.visionText}
              </motion.p>

              <div className="grid gap-4 text-white/75">
                {splitLines(scene05.storyParagraphs.join('\n')).map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 18 }}
                    animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ delay: 0.16 + index * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[15px] leading-relaxed"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.24, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-3"
              >
                {scene05.aiTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/75"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={aboutInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
                transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-[24px] ${glassPulse} border-white/12 p-[1px]`}
              >
                <div className="rounded-[23px] border border-white/10 bg-gradient-to-b from-white/8 to-white/4 p-5">
                  <p className="text-[12px] uppercase tracking-[0.2em] text-white/65">{scene05.visionTitle}</p>
                  <p className="mt-3 text-[clamp(1.1rem,1.8vw,1.35rem)] font-semibold leading-tight text-white">
                    {scene05.portraitCaption}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {scene05.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-white/75"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={getCardClass(
                  siteConfig.designSystem.components.scene05CardVariant,
                  'dark',
                  'p-5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[12px] uppercase tracking-[0.18em] text-white/60">{scene05.aiTitle}</p>
                    <p className="text-[clamp(1.05rem,1.4vw,1.2rem)] font-semibold text-white">
                      {scene05.aiText}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                    <div className="h-full w-full animate-[spin_12s_linear_infinite] rounded-2xl bg-[conic-gradient(from_45deg,rgba(156,220,255,0.32),rgba(146,132,255,0.55),rgba(156,220,255,0.32))]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          ref={certRef}
          id="projects"
          className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0a0c11] via-[#090b12] to-[#07070c] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:p-12 lg:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(122,157,255,0.18),transparent_40%)] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(126,255,210,0.16),transparent_42%)] opacity-80" />

          <div className="relative mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-[12px] uppercase tracking-[0.2em] text-white/60">{scene05.certificationsTitle}</p>
              <h3
                className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-tight text-white"
                style={{ fontSize: getScaledRem(siteConfig.designSystem.theme.sectionTitleSizeRem, siteConfig.designSystem.theme.headingScale) }}
              >
                {scene05.visionTitle}
              </h3>
              <p className="max-w-2xl text-[15px] leading-relaxed text-white/70">{scene05.visionText}</p>
            </div>
            <a
              className={getButtonClass(
                siteConfig.designSystem.components.scene05ActionButtonVariant,
                'dark',
                'md',
                'shadow-[0_12px_40px_rgba(0,0,0,0.28)]'
              )}
              href={scene05.actionHref}
            >
              {scene05.credentialButtonLabel}
            </a>
          </div>

          <div className="relative grid gap-6 lg:grid-cols-2">
            {visibleCerts.map((cert, index) => {
              const fromLeft = index < Math.ceil(visibleCerts.length / 2);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: fromLeft ? -120 : 120, rotate: fromLeft ? -2 : 2 }}
                  animate={
                    certInView
                      ? { opacity: 1, x: 0, rotate: 0 }
                      : { opacity: 0, x: fromLeft ? -120 : 120, rotate: fromLeft ? -2 : 2 }
                  }
                  transition={{ delay: 0.05 * index, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={getCardClass(
                    siteConfig.designSystem.components.scene05CardVariant,
                    'dark',
                    'relative overflow-hidden border border-white/12 p-5'
                  )}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%)] opacity-50" />
                  <div className="relative flex items-start gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/16 bg-white/6">
                      {cert.logoSrc ? (
                        <img src={cert.logoSrc} alt={cert.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] uppercase tracking-[0.16em] text-white/65">{cert.issuer}</p>
                      <p className="text-[clamp(1.15rem,1.4vw,1.3rem)] font-semibold text-white">{cert.title}</p>
                      <p className="text-[12px] uppercase tracking-[0.16em] text-white/55">{cert.year}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                    <div className="flex items-center gap-3">
                      {scene05.aiTags.slice(0, 2).map((tag) => (
                        <span
                          key={`${cert.id}-${tag}`}
                          className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      className={getButtonClass(
                        siteConfig.designSystem.components.featuredViewAllButtonVariant,
                        'dark',
                        'sm'
                      )}
                      href={cert.credentialUrl}
                    >
                      {scene05.credentialButtonLabel}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
