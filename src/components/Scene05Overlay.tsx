import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getSocialIconComponent } from './icons';
import { getButtonClass, getCardClass, getGlassClass, getScaledRem } from './designSystem';
import { CinematicAbout } from './CinematicAbout';

gsap.registerPlugin(ScrollTrigger);

interface Scene05OverlayProps {
  progress: number;
}

interface Scene05CertificationView {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  logoSrc: string;
}

interface Scene05LogoView {
  id: string;
  name: string;
  logoSrc: string;
  href: string;
}

const WHEEL_NAV_THRESHOLD = 28;
const NAV_LOCK_MS = 740;
const isPlaceholderHref = (href: string) => href.trim() === '#';

const getInitials = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return 'NA';
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
};

export const Scene05Overlay: React.FC<Scene05OverlayProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05 } = siteConfig;
  const cinematicEnabled =
    siteConfig.animation.sectionAnimations.aboutText.enabled ||
    siteConfig.animation.sectionAnimations.aboutCards.enabled;

  if (cinematicEnabled) {
    return <CinematicAbout progress={progress} />;
  }

  const {
    headingScale,
    displayTitleSizeRem,
    sectionTitleSizeRem,
    bodyTextSizeRem,
    headingWeight,
    headingLetterSpacingEm,
    bodyLineHeight,
  } = siteConfig.designSystem.theme;
  const {
    scene05ActionButtonVariant,
    scene05CardVariant,
    globalGlassVariant,
  } = siteConfig.designSystem.components;

  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navLockUntilRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  const isActive = progress > 0.05;

  const visibleTimeline = useMemo(
    () => siteConfig.journeyTimeline.filter((item) => item.visible),
    [siteConfig.journeyTimeline],
  );

  const visibleSocialLinks = useMemo(
    () => siteConfig.footer.socialLinks.filter((item) => item.visible),
    [siteConfig.footer.socialLinks],
  );

  const visibleCompanyLogos = useMemo(
    () => scene05.companyLogos.filter((item) => item.visible),
    [scene05.companyLogos],
  );

  const certificationStripLogos = useMemo<Scene05LogoView[]>(
    () => scene05.learningLogos.filter((item) => item.visible),
    [scene05.learningLogos],
  );

  const visibleCertifications = useMemo<Scene05CertificationView[]>(() => {
    const structured = scene05.featuredCertifications
      .filter((item) => item.visible)
      .map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        year: item.year,
        credentialUrl: item.credentialUrl,
        logoSrc: item.logoSrc,
      }));

    if (structured.length > 0) return structured;

    return scene05.certifications.map((item, index) => ({
      id: `legacy-cert-${index}`,
      title: item,
      issuer: scene05.certificationsTitle,
      year: '',
      credentialUrl: '#',
      logoSrc: '',
    }));
  }, [
    scene05.certifications,
    scene05.certificationsTitle,
    scene05.featuredCertifications,
  ]);

  const storyParagraphs = useMemo(() => {
    if (scene05.storyParagraphs.length > 0) return scene05.storyParagraphs;
    return [scene05.visionText];
  }, [scene05.storyParagraphs, scene05.visionText]);

  const aboutLabel =
    siteConfig.persistentUI.navItems.find((item) => item.section === 'about')?.label || scene05.badge;

  const certificationCardClass = `${getCardClass(scene05CardVariant, 'light')} ${getGlassClass(
    globalGlassVariant,
    'light',
  )}`;

  const handlePlaceholderLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPlaceholderHref(href)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollRef.current;
    if (!container || !scroller) return;

    if (!isActive) {
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      return;
    }

    scroller.scrollTop = 0;
    lastScrollTopRef.current = 0;

    const sections = gsap.utils.toArray<HTMLElement>('.s5-section', container);
    const scopedTriggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0, y: 34, filter: 'blur(7px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,
        },
      );

      sections.forEach((section) => {
        const tween = gsap.fromTo(
          section,
          { opacity: 0, y: 30, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.72,
            ease: 'power3.out',
            overwrite: true,
            scrollTrigger: {
              trigger: section,
              scroller,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        if (tween.scrollTrigger) {
          scopedTriggers.push(tween.scrollTrigger);
        }
      });
    }, container);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refreshTimer);
      scopedTriggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, [isActive]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;

    if (currentScrollTop < 72) {
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      lastScrollTopRef.current = currentScrollTop;
      return;
    }

    if (currentScrollTop > lastScrollTopRef.current + 10) {
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
    } else if (currentScrollTop < lastScrollTopRef.current - 10) {
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
    }

    lastScrollTopRef.current = currentScrollTop;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const scroller = scrollRef.current;
    if (!scroller) return;

    const atTop = scroller.scrollTop <= 6;
    const distanceToBottom = scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight);
    const atBottom = distanceToBottom <= 20;
    const now = Date.now();

    if (now < navLockUntilRef.current) return;

    if (atTop && e.deltaY < -WHEEL_NAV_THRESHOLD) {
      e.preventDefault();
      navLockUntilRef.current = now + NAV_LOCK_MS;
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'home' } }));
      return;
    }

    if (atBottom && e.deltaY > WHEEL_NAV_THRESHOLD) {
      e.preventDefault();
      navLockUntilRef.current = now + NAV_LOCK_MS;
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
      window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'projects-sequence' } }));
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartYRef.current;
    touchStartYRef.current = null;
    if (startY === null) return;

    const endY = e.changedTouches[0]?.clientY;
    if (typeof endY !== 'number') return;

    const scroller = scrollRef.current;
    if (!scroller) return;

    const now = Date.now();
    if (now < navLockUntilRef.current) return;

    const deltaY = startY - endY;
    const atTop = scroller.scrollTop <= 6;
    const distanceToBottom = scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight);
    const atBottom = distanceToBottom <= 20;

    if (atTop && deltaY < -54) {
      navLockUntilRef.current = now + NAV_LOCK_MS;
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'home' } }));
      return;
    }

    if (atBottom && deltaY > 54) {
      navLockUntilRef.current = now + NAV_LOCK_MS;
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
      window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'projects-sequence' } }));
    }
  };

  return (
    <section
      ref={containerRef}
      className={`fixed inset-0 z-[190] transition-all duration-[650ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isActive ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-6'
      }`}
      data-surface="base"
    >
      <style>{`
        @keyframes s05-cert-strip {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => e.stopPropagation()}
        className="h-full overflow-y-auto overflow-x-hidden bg-[radial-gradient(1200px_680px_at_8%_0%,rgba(66,109,176,0.12),transparent_64%),radial-gradient(900px_560px_at_96%_16%,rgba(96,132,185,0.1),transparent_68%),linear-gradient(180deg,#edf2fa_0%,#f9fbff_42%,#eef2f9_100%)] text-[#0f1219]"
      >
        <div className="min-h-full pb-24 pt-[90px] md:pb-32 md:pt-[134px]">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-10 lg:px-14">
            <header className="s5-section border-b border-[#0f1219]/12 pb-12 md:pb-14">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0f1219]/14 bg-white/82 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/68">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0f1219]/65" />
                  {scene05.badge}
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
                <figure className="overflow-hidden rounded-[18px] border border-[#0f1219]/12 bg-white/70 backdrop-blur-[8px]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#0f1219]/6">
                    {scene05.portraitImage ? (
                      <img
                        src={scene05.portraitImage}
                        alt={scene05.portraitAlt || scene05.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#d7e0ef,#f4f7fd)]">
                        <span className="font-mono text-[2.2rem] tracking-[0.22em] text-[#0f1219]/52">
                          {getInitials(scene05.name)}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,25,0.02),rgba(15,18,25,0.1))]" />
                  </div>

                  {scene05.portraitCaption ? (
                    <figcaption className="border-t border-[#0f1219]/10 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/58 md:px-6">
                      {scene05.portraitCaption}
                    </figcaption>
                  ) : null}
                </figure>

                <div className="flex flex-col gap-7">
                  <div>
                    <h1
                      className="font-sans leading-[1.02] tracking-tight text-[#0f1219]"
                      style={{
                        fontSize: `clamp(${getScaledRem(sectionTitleSizeRem * 1.02, headingScale)}, ${(6.2 * headingScale).toFixed(3)}vw, ${getScaledRem(displayTitleSizeRem * 0.55, headingScale)})`,
                        fontWeight: headingWeight,
                        letterSpacing: `${headingLetterSpacingEm}em`,
                      }}
                    >
                      {scene05.name}
                    </h1>

                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0f1219]/56">{scene05.role}</p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h2 className="mb-3 border-b border-[#0f1219]/12 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                        {scene05.visionTitle}
                      </h2>
                      <p
                        className="text-[#0f1219]/88"
                        style={{
                          fontSize: `clamp(${getScaledRem(bodyTextSizeRem * 0.95, 1)}, 1.22vw, ${getScaledRem(bodyTextSizeRem * 1.08, 1)})`,
                          lineHeight: bodyLineHeight,
                        }}
                      >
                        {scene05.visionText}
                      </p>
                    </div>

                    <div>
                      <h2 className="mb-3 border-b border-[#0f1219]/12 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                        {scene05.aiTitle}
                      </h2>
                      <p
                        className="text-[#0f1219]/84"
                        style={{
                          fontSize: `clamp(${getScaledRem(bodyTextSizeRem * 0.9, 1)}, 1.05vw, ${getScaledRem(bodyTextSizeRem, 1)})`,
                          lineHeight: bodyLineHeight,
                        }}
                      >
                        {scene05.aiText}
                      </p>
                    </div>
                  </div>

                  {scene05.aiTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scene05.aiTags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-full border border-[#0f1219]/12 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0f1219]/66"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </header>

            <section className="s5-section mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <article>
                <h2 className="mb-4 border-b border-[#0f1219]/12 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                  {scene05.storyTitle}
                </h2>

                <div className="space-y-4 text-[#0f1219]/84">
                  {storyParagraphs.map((paragraph, index) => (
                    <p
                      key={`${paragraph}-${index}`}
                      style={{
                        fontSize: `clamp(${getScaledRem(bodyTextSizeRem * 0.92, 1)}, 1.05vw, ${getScaledRem(bodyTextSizeRem, 1)})`,
                        lineHeight: bodyLineHeight,
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              <aside className="rounded-[18px] border border-[#0f1219]/12 bg-white/62 p-6 md:p-7">
                <h3 className="mb-3 border-b border-[#0f1219]/12 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                  {scene05.skillsTitle}
                </h3>
                <ul className="space-y-2 text-[#0f1219]/82">
                  {scene05.skills.map((skill, index) => (
                    <li key={`${skill}-${index}`} className="flex items-start gap-2">
                      <span className="mt-1 text-[#0f1219]/38">-</span>
                      <span
                        style={{
                          fontSize: `clamp(${getScaledRem(bodyTextSizeRem * 0.9, 1)}, 1.02vw, ${getScaledRem(bodyTextSizeRem, 1)})`,
                          lineHeight: bodyLineHeight,
                        }}
                      >
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </section>

            {certificationStripLogos.length > 0 ? (
              <section className="s5-section mt-10 border-y border-[#0f1219]/10 py-4">
                <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/62">
                  {scene05.learningLogosTitle}
                </div>

                <div className="group relative overflow-hidden py-2">
                  <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-14 bg-gradient-to-r from-[#f7faff] to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-14 bg-gradient-to-l from-[#f7faff] to-transparent" />

                  <div
                    className="flex w-max items-center whitespace-nowrap group-hover:[animation-play-state:paused]"
                    style={{ animation: 's05-cert-strip 26s linear infinite' }}
                  >
                    {[...certificationStripLogos, ...certificationStripLogos, ...certificationStripLogos].map((item, index) => {
                      const logoItem = (
                        <>
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#0f1219]/12 bg-white/90">
                            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#0f1219]/70">
                              {getInitials(item.name)}
                            </span>
                            {item.logoSrc ? (
                              <img
                                src={item.logoSrc}
                                alt={item.name}
                                className="absolute h-6 w-6 object-contain"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/70">{item.name}</span>
                        </>
                      );

                      const rowClass = 'mx-4 flex items-center gap-2 rounded-full border border-transparent px-2 py-1.5 transition-colors hover:border-[#0f1219]/12 hover:bg-white/52 md:mx-6';

                      if (item.href && item.href !== '#') {
                        return (
                          <a key={`${item.id}-${index}`} href={item.href} target="_blank" rel="noreferrer" className={rowClass}>
                            {logoItem}
                          </a>
                        );
                      }

                      return (
                        <div key={`${item.id}-${index}`} className={rowClass}>
                          {logoItem}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : null}

            {visibleCompanyLogos.length > 0 ? (
              <section className="s5-section mt-10">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">
                  {scene05.companyLogosTitle}
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {visibleCompanyLogos.map((item) => {
                    const companyNode = (
                      <>
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#0f1219]/12 bg-white">
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#0f1219]/70">
                            {getInitials(item.name)}
                          </span>
                          {item.logoSrc ? (
                            <img
                              src={item.logoSrc}
                              alt={item.name}
                              className="absolute h-6 w-6 object-contain"
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>

                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/68">{item.name}</span>
                      </>
                    );

                    const className = 'flex items-center gap-2.5 rounded-[14px] border border-[#0f1219]/12 bg-white/72 px-3 py-3 transition-colors hover:bg-white';

                    if (!isPlaceholderHref(item.href)) {
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => handlePlaceholderLinkClick(e, item.href)}
                          className={className}
                        >
                          {companyNode}
                        </a>
                      );
                    }

                    return (
                      <div key={item.id} className={className}>
                        {companyNode}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {visibleTimeline.length > 0 ? (
              <section className="s5-section mt-12 grid gap-6 lg:grid-cols-[0.24fr_0.76fr]">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">{aboutLabel}</h2>

                <div className="relative ml-[8px] border-l border-[#0f1219]/16 pl-5 md:pl-8">
                  {visibleTimeline.map((item) => (
                    <article key={item.id} className="relative mb-8 last:mb-0">
                      <span className="absolute -left-[25px] top-2 h-2.5 w-2.5 rounded-full border border-[#0f1219]/28 bg-[#f0f3fa]" />

                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#0f1219]/14 bg-white/84 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/66">
                          {item.date}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f1219]/52">{item.title}</span>
                      </div>

                      <h3 className="font-sans text-[1.1rem] leading-tight text-[#0f1219]">{item.role}</h3>
                      <p
                        className="mt-2 text-[#0f1219]/78"
                        style={{
                          fontSize: `clamp(${getScaledRem(bodyTextSizeRem * 0.9, 1)}, 1.06vw, ${getScaledRem(bodyTextSizeRem * 0.98, 1)})`,
                          lineHeight: bodyLineHeight,
                        }}
                      >
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {visibleCertifications.length > 0 ? (
              <section className="s5-section mt-10">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">{scene05.certificationsTitle}</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleCertifications.map((item) => (
                    <article key={item.id} className={`${certificationCardClass} p-5`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#0f1219]/64">{item.issuer}</span>
                        {item.year ? (
                          <span className="rounded-full border border-[#0f1219]/12 bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0f1219]/66">
                            {item.year}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 font-sans text-[1.02rem] leading-tight text-[#0f1219]">{item.title}</h3>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#0f1219]/10 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#0f1219]/12 bg-white">
                            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#0f1219]/70">
                              {getInitials(item.issuer || item.title)}
                            </span>
                            {item.logoSrc ? (
                              <img
                                src={item.logoSrc}
                                alt={item.issuer}
                                className="absolute h-6 w-6 object-contain"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0f1219]/62">{item.issuer}</span>
                        </div>

                        {item.credentialUrl && item.credentialUrl !== '#' ? (
                          <a
                            href={item.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={getButtonClass(scene05ActionButtonVariant, 'light', 'sm', 'px-3')}
                          >
                            {scene05.credentialButtonLabel}
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0f1219]/56">
                            {scene05.credentialButtonLabel}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="s5-section mt-14 border-t border-[#0f1219]/12 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0f1219]/62">{scene05.actionLabel}</h2>

                <a
                  href={scene05.actionHref}
                  onClick={(e) => handlePlaceholderLinkClick(e, scene05.actionHref)}
                  className={getButtonClass(scene05ActionButtonVariant, 'light', 'sm', 'min-w-[160px] justify-center')}
                >
                  {scene05.actionLabel}
                </a>
              </div>

              {visibleSocialLinks.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {visibleSocialLinks.map((link) => {
                    const Icon = getSocialIconComponent(link.icon);
                    return (
                      <a
                        key={link.id}
                        href={link.href}
                        onClick={(e) => handlePlaceholderLinkClick(e, link.href)}
                        target={isPlaceholderHref(link.href) ? undefined : '_blank'}
                        rel={isPlaceholderHref(link.href) ? undefined : 'noopener noreferrer'}
                        aria-label={link.label}
                        className={getButtonClass(scene05ActionButtonVariant, 'light', 'icon', 'h-10 w-10')}
                      >
                        <Icon size={16} strokeWidth={1.8} />
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};
