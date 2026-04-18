import React, { useMemo, type CSSProperties } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  SITE_ELEMENT_ANIMATION_STYLES,
  type SiteElementAnimationStyle,
} from '../config/siteConfig';

type TextStyle = Extract<
  SiteElementAnimationStyle,
  'none' | 'fade' | 'fade-up' | 'slide-up' | 'cinematic' | 'glitch' | 'typewriter'
>;
type CardStyle = Extract<SiteElementAnimationStyle, 'none' | 'stack' | 'stagger' | 'creative' | 'zoom'>;

interface CinematicAboutProps {
  progress: number;
}

interface RotatingCard {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  logoSrc: string;
  href: string;
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const phaseOpacity = (p: number, start: number, end: number, fade = 0.05) => {
  if (p < start || p > end) return 0;
  if (p < start + fade) return (p - start) / fade;
  if (p > end - fade) return (end - p) / fade;
  return 1;
};

const phaseProgress = (p: number, start: number, end: number) => {
  if (end <= start) return 0;
  return clamp((p - start) / (end - start));
};

const resolveTextStyle = (style: string): TextStyle => {
  if (
    SITE_ELEMENT_ANIMATION_STYLES.includes(style as SiteElementAnimationStyle) &&
    ['none', 'fade', 'fade-up', 'slide-up', 'cinematic', 'glitch', 'typewriter'].includes(style)
  ) {
    return style as TextStyle;
  }
  return 'cinematic';
};

const resolveCardStyle = (style: string): CardStyle => {
  if (
    SITE_ELEMENT_ANIMATION_STYLES.includes(style as SiteElementAnimationStyle) &&
    ['none', 'stack', 'stagger', 'creative', 'zoom'].includes(style)
  ) {
    return style as CardStyle;
  }
  return 'creative';
};

const getTextTransform = (style: TextStyle, iter: number) => {
  const enter = iter < 0.18 ? 1 - iter / 0.18 : 0;
  const exit = iter > 0.82 ? (iter - 0.82) / 0.18 : 0;

  switch (style) {
    case 'fade-up':
    case 'slide-up':
      return `translateY(${enter * 68 - exit * 68}px)`;
    case 'cinematic':
      return `translateY(${enter * 58 - exit * 58}px) scale(${1.03 - enter * 0.08 - exit * 0.08})`;
    case 'glitch':
      return `translate(${enter * -22 + exit * 22}px, ${enter * 20 - exit * 20}px)`;
    case 'fade':
    case 'typewriter':
    case 'none':
    default:
      return 'translate(0, 0) scale(1)';
  }
};

const getCardTransform = (style: CardStyle, iter: number) => {
  const enter = iter < 0.2 ? 1 - iter / 0.2 : 0;
  const exit = iter > 0.8 ? (iter - 0.8) / 0.2 : 0;

  switch (style) {
    case 'stack':
      return `translateY(${enter * 95 - exit * 95}px) scale(${1 - enter * 0.26 - exit * 0.26})`;
    case 'stagger':
      return `translateX(${enter * 115 - exit * 115}px) rotateY(${enter * 42 - exit * 42}deg) scale(${1 - enter * 0.18 - exit * 0.18})`;
    case 'creative':
      return `translateY(${enter * 78 - exit * 78}px) rotate(${enter * -8 + exit * 8}deg) scale(${1 - enter * 0.22 - exit * 0.22})`;
    case 'zoom':
      return `scale(${0.8 + (1 - enter - exit) * 0.26})`;
    case 'none':
    default:
      return 'translate(0, 0) scale(1)';
  }
};

const getNarrativeTextStyle = (style: TextStyle, iter: number, opacity: number): CSSProperties => {
  return {
    opacity,
    transform: getTextTransform(style, iter),
    letterSpacing: style === 'cinematic' ? `${(0.06 - opacity * 0.06).toFixed(3)}em` : undefined,
    filter: style === 'glitch' ? `blur(${(1 - opacity) * 2.2}px)` : undefined,
    clipPath: style === 'typewriter' ? `inset(0 ${(1 - opacity) * 100}% 0 0)` : undefined,
  };
};

const getCurrentItem = <T,>(items: T[], phaseP: number): { item: T | null; iter: number } => {
  if (items.length === 0) return { item: null, iter: 0 };
  if (phaseP >= 1) return { item: items[items.length - 1] ?? null, iter: 0.5 };

  const scaled = phaseP * items.length;
  const index = Math.min(items.length - 1, Math.max(0, Math.floor(scaled)));
  return {
    item: items[index] ?? null,
    iter: scaled % 1,
  };
};

export const CinematicAbout: React.FC<CinematicAboutProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05, animation } = siteConfig;

  const storyParagraphs = useMemo(() => {
    return scene05.storyParagraphs.length > 0 ? scene05.storyParagraphs : [scene05.visionText];
  }, [scene05.storyParagraphs, scene05.visionText]);

  const visibleCompanies = useMemo<RotatingCard[]>(
    () =>
      scene05.companyLogos
        .filter((item) => item.visible)
        .map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: scene05.companyLogosTitle,
          meta: 'Work Experience',
          logoSrc: item.logoSrc,
          href: item.href,
        })),
    [scene05.companyLogos, scene05.companyLogosTitle],
  );

  const visibleCertifications = useMemo<RotatingCard[]>(() => {
    const structured = scene05.featuredCertifications
      .filter((item) => item.visible)
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.issuer,
        meta: item.year,
        logoSrc: item.logoSrc,
        href: item.credentialUrl,
      }));

    if (structured.length > 0) return structured;

    return scene05.certifications.map((item, index) => ({
      id: `legacy-cert-${index}`,
      title: item,
      subtitle: scene05.certificationsTitle,
      meta: '',
      logoSrc: '',
      href: '#',
    }));
  }, [scene05.certifications, scene05.certificationsTitle, scene05.featuredCertifications]);

  const aboutTextEnabled = animation.sectionAnimations.aboutText.enabled;
  const aboutCardsEnabled = animation.sectionAnimations.aboutCards.enabled;

  const aboutTextStyle = resolveTextStyle(animation.sectionAnimations.aboutText.style);
  const aboutCardsStyle = resolveCardStyle(animation.sectionAnimations.aboutCards.style);

  const introOpacity = phaseOpacity(progress, -0.05, 0.16, 0.06);
  const visionOpacity = phaseOpacity(progress, 0.16, 0.34, 0.06);
  const storyPhase = phaseProgress(progress, 0.34, 0.56);
  const storyOpacity = phaseOpacity(progress, 0.34, 0.56, 0.07);
  const skillsPhase = phaseProgress(progress, 0.56, 0.72);
  const skillsOpacity = phaseOpacity(progress, 0.56, 0.72, 0.06);
  const companyPhase = phaseProgress(progress, 0.72, 0.86);
  const companyOpacity = phaseOpacity(progress, 0.72, 0.86, 0.05);
  const certPhase = phaseProgress(progress, 0.86, 0.995);
  const certOpacity = phaseOpacity(progress, 0.86, 0.995, 0.05);

  const activeStory = getCurrentItem<string>(storyParagraphs, storyPhase);
  const activeSkill = getCurrentItem<string>(scene05.skills, skillsPhase);
  const activeCompany = getCurrentItem<RotatingCard>(visibleCompanies, companyPhase);
  const activeCert = getCurrentItem<RotatingCard>(visibleCertifications, certPhase);

  const isActive = progress > 0.01 && progress <= 1;

  const getNarrativeOpacity = (iter: number) => {
    if (!aboutTextEnabled || aboutTextStyle === 'none') return 1;
    if (iter < 0.15) return iter / 0.15;
    if (iter > 0.85) return (1 - iter) / 0.15;
    return 1;
  };

  const getCardOpacity = (iter: number) => {
    if (!aboutCardsEnabled || aboutCardsStyle === 'none') return 1;
    if (iter < 0.18) return iter / 0.18;
    if (iter > 0.82) return (1 - iter) / 0.18;
    return 1;
  };

  return (
    <section
      className={`fixed inset-0 z-[190] flex items-center justify-center overflow-hidden transition-all duration-[800ms] text-[#0f1219] ${
        isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 680px at 8% 0%, rgba(66,109,176,0.12), transparent 64%), radial-gradient(900px 560px at 96% 16%, rgba(96,132,185,0.1), transparent 68%), linear-gradient(180deg, #edf2fa 0%, #f9fbff 42%, #eef2f9 100%)',
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: introOpacity }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#0f1219]/55">{scene05.badge}</p>
        <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.94] tracking-tight text-[#0f1219]">
          {scene05.name}
        </h1>
        <p className="mt-5 text-sm md:text-xl font-mono uppercase tracking-[0.22em] text-[#0f1219]/60">{scene05.role}</p>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center px-8 text-center"
        style={{ opacity: visionOpacity }}
      >
        <p className="max-w-5xl text-3xl md:text-6xl lg:text-7xl font-serif leading-[1.18] text-[#0f1219] tracking-tight">
          {scene05.visionText}
        </p>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center px-8 text-center"
        style={{ opacity: storyOpacity }}
      >
        {activeStory.item ? (
          <p
            className="max-w-5xl text-2xl md:text-5xl lg:text-6xl font-serif leading-[1.2] text-[#0f1219]"
            style={getNarrativeTextStyle(
              aboutTextEnabled ? aboutTextStyle : 'none',
              activeStory.iter,
              getNarrativeOpacity(activeStory.iter),
            )}
          >
            {activeStory.item}
          </p>
        ) : null}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center px-8 text-center"
        style={{ opacity: skillsOpacity }}
      >
        {activeSkill.item ? (
          <div
            style={{
              opacity: getNarrativeOpacity(activeSkill.iter),
              transform: getTextTransform(aboutTextEnabled ? aboutTextStyle : 'none', activeSkill.iter),
            }}
          >
            <p className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.34em] text-[#0f1219]/58">{scene05.skillsTitle}</p>
            <p className="mt-6 text-3xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-[#0f1219]">{activeSkill.item}</p>
          </div>
        ) : null}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{ opacity: companyOpacity }}
      >
        {activeCompany.item ? (
          <article
            className="w-full max-w-3xl rounded-[32px] border border-black/10 bg-white/85 p-8 md:p-12 text-center shadow-[0_40px_100px_-22px_rgba(0,0,0,0.2)]"
            style={{
              opacity: getCardOpacity(activeCompany.iter),
              transform: getCardTransform(aboutCardsEnabled ? aboutCardsStyle : 'none', activeCompany.iter),
            }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0f1219]/56">{activeCompany.item.meta}</p>
            <h3 className="mt-6 text-4xl md:text-6xl font-serif leading-[1.06] text-[#0f1219]">{activeCompany.item.title}</h3>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/54">{activeCompany.item.subtitle}</p>
            {activeCompany.item.logoSrc ? (
              <div className="mt-8 flex justify-center">
                <img src={activeCompany.item.logoSrc} alt={activeCompany.item.title} className="h-16 w-16 object-contain" />
              </div>
            ) : null}
          </article>
        ) : null}
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ opacity: certOpacity }}
      >
        {activeCert.item ? (
          <article
            className="w-full max-w-3xl rounded-[32px] border border-black/10 bg-white/90 p-8 md:p-12 text-center shadow-[0_44px_110px_-24px_rgba(0,0,0,0.22)]"
            style={{
              opacity: getCardOpacity(activeCert.iter),
              transform: getCardTransform(aboutCardsEnabled ? aboutCardsStyle : 'none', activeCert.iter),
            }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0f1219]/56">{scene05.certificationsTitle}</p>
            <h3 className="mt-5 text-3xl md:text-5xl font-serif leading-[1.1] text-[#0f1219]">{activeCert.item.title}</h3>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/54">{activeCert.item.subtitle}</p>
            {activeCert.item.meta ? (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/44">{activeCert.item.meta}</p>
            ) : null}

            <div className="mt-8 flex items-center justify-center gap-4">
              {activeCert.item.logoSrc ? (
                <img src={activeCert.item.logoSrc} alt={activeCert.item.subtitle} className="h-12 w-12 object-contain" />
              ) : null}
              {activeCert.item.href && activeCert.item.href !== '#' ? (
                <a
                  href={activeCert.item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#0f1219]/16 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#0f1219] hover:bg-[#0f1219] hover:text-white transition-colors"
                >
                  {scene05.credentialButtonLabel}
                </a>
              ) : null}
            </div>
          </article>
        ) : null}

        <a
          href={scene05.actionHref === '#' ? undefined : scene05.actionHref}
          onClick={scene05.actionHref === '#' ? (e) => e.preventDefault() : undefined}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f1219] px-8 py-3.5 text-[13px] font-medium tracking-[0.1em] text-white"
        >
          {scene05.actionLabel}
        </a>
      </div>
    </section>
  );
};
