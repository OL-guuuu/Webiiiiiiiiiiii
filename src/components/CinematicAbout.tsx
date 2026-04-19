import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getButtonClass } from './designSystem';
import { getSocialIconComponent } from './icons';
import { WebGLFog } from './WebGLFog';

interface CinematicAboutProps {
  progress: number;
}

interface CertificationView {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  logoSrc: string;
}

const WHEEL_NAV_THRESHOLD = 28;
const NAV_LOCK_MS = 740;

const isPlaceholderHref = (href: string) => href.trim() === '#';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getInitials = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '');

  if (parts.length === 0) return 'NA';
  return parts.join('');
};

export const CinematicAbout: React.FC<CinematicAboutProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const { scene05, designSystem, footer } = siteConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const navLockUntilRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  const [scrollMetrics, setScrollMetrics] = useState({ top: 0, progress: 0 });

  const isActive = progress > 0.05;

  const displayName = useMemo(() => {
    const candidate = scene05.name.trim();
    if (candidate) return candidate;
    return scene05.badge.trim() || 'About';
  }, [scene05.badge, scene05.name]);

  const introHeading = useMemo(() => {
    const badgeText = scene05.badge.trim();
    if (badgeText) return badgeText;
    return displayName;
  }, [displayName, scene05.badge]);

  const introParagraphs = useMemo(() => {
    const merged = [scene05.visionText, ...scene05.storyParagraphs]
      .map((item) => item.trim())
      .filter(Boolean);

    const uniqueParagraphs = merged.filter((item, index) => merged.indexOf(item) === index);
    return uniqueParagraphs.slice(0, 3);
  }, [scene05.storyParagraphs, scene05.visionText]);

  const storyParagraphs = useMemo(() => {
    const list = scene05.storyParagraphs.map((item) => item.trim()).filter(Boolean);
    if (list.length > 0) return list;

    const fallback = scene05.visionText.trim();
    return fallback ? [fallback] : [];
  }, [scene05.storyParagraphs, scene05.visionText]);

  const skills = useMemo(() => scene05.skills.map((item) => item.trim()).filter(Boolean), [scene05.skills]);

  const aiTags = useMemo(() => scene05.aiTags.map((item) => item.trim()).filter(Boolean), [scene05.aiTags]);

  const certifications = useMemo<CertificationView[]>(() => {
    const visible = scene05.featuredCertifications.filter((item) => item.visible);
    if (visible.length > 0) {
      return visible;
    }

    return scene05.certifications.map((title, index) => ({
      id: `legacy-cert-${index}`,
      title,
      issuer: scene05.certificationsTitle,
      year: '',
      credentialUrl: '#',
      logoSrc: '',
    }));
  }, [scene05.certifications, scene05.certificationsTitle, scene05.featuredCertifications]);

  const aboutSocialLinks = useMemo(() => {
    return footer.socialLinks.filter((item) => item.visible);
  }, [footer.socialLinks]);

  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller || !isActive) return;

    scroller.scrollTop = 0;
    lastScrollTopRef.current = 0;
    setScrollMetrics({ top: 0, progress: 0 });
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const actionButtonClass = getButtonClass(
    designSystem.components.scene05ActionButtonVariant,
    'light',
    'md',
    'min-w-[200px] justify-center',
  );

  const handleBackNavigation = () => {
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'home' } }));
  };

  const handleForwardNavigation = () => {
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'projects-sequence' } }));
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const scroller = containerRef.current;
    if (!scroller) return;

    const atTop = scroller.scrollTop <= 6;
    const distanceToBottom = scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight);
    const atBottom = distanceToBottom <= 20;

    const now = Date.now();
    if (now < navLockUntilRef.current) return;

    if (atTop && event.deltaY < -WHEEL_NAV_THRESHOLD) {
      event.preventDefault();
      navLockUntilRef.current = now + NAV_LOCK_MS;
      handleBackNavigation();
      return;
    }

    if (atBottom && event.deltaY > WHEEL_NAV_THRESHOLD) {
      event.preventDefault();
      navLockUntilRef.current = now + NAV_LOCK_MS;
      handleForwardNavigation();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartYRef.current;
    touchStartYRef.current = null;
    if (startY === null) return;

    const endY = event.changedTouches[0]?.clientY;
    if (typeof endY !== 'number') return;

    const scroller = containerRef.current;
    if (!scroller) return;

    const now = Date.now();
    if (now < navLockUntilRef.current) return;

    const deltaY = startY - endY;
    const atTop = scroller.scrollTop <= 6;
    const distanceToBottom = scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight);
    const atBottom = distanceToBottom <= 20;

    if (atTop && deltaY < -54) {
      navLockUntilRef.current = now + NAV_LOCK_MS;
      handleBackNavigation();
      return;
    }

    if (atBottom && deltaY > 54) {
      navLockUntilRef.current = now + NAV_LOCK_MS;
      handleForwardNavigation();
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop;

    if (currentScrollTop < 72) {
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      lastScrollTopRef.current = currentScrollTop;
    } else {
      if (currentScrollTop > lastScrollTopRef.current + 10) {
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
      } else if (currentScrollTop < lastScrollTopRef.current - 10) {
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      }

      lastScrollTopRef.current = currentScrollTop;
    }

    const maxScrollable = Math.max(1, event.currentTarget.scrollHeight - event.currentTarget.clientHeight);
    const nextProgress = clamp01(currentScrollTop / maxScrollable);

    if (scrollRafRef.current !== null) {
      window.cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      setScrollMetrics({ top: currentScrollTop, progress: nextProgress });
      scrollRafRef.current = null;
    });
  };

  const handlePlaceholderLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPlaceholderHref(href)) {
      event.preventDefault();
    }
  };

  const heroLift = Math.min(scrollMetrics.top * 0.08, 34);
  const portraitDrift = Math.min(scrollMetrics.top * 0.04, 18);

  const storyReveal = clamp01((scrollMetrics.progress - 0.06) / 0.34);
  const skillsReveal = clamp01((scrollMetrics.progress - 0.24) / 0.32);
  const certReveal = clamp01((scrollMetrics.progress - 0.5) / 0.4);

  return (
    <section
      className={`fixed inset-0 z-[190] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_12%_0%,rgba(11,15,24,0.08),transparent_62%),radial-gradient(900px_600px_at_95%_20%,rgba(24,39,70,0.06),transparent_66%),linear-gradient(180deg,#f2f5fb_0%,#f8fbff_58%,#eef3fa_100%)]" />

      <div className="absolute inset-0 opacity-80">
        <WebGLFog />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_4%,rgba(255,255,255,0.66),transparent_38%),radial-gradient(circle_at_90%_96%,rgba(15,18,25,0.14),transparent_44%)]" />

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={(event) => event.stopPropagation()}
        onScroll={handleScroll}
        className="relative z-[4] h-full overflow-y-auto overflow-x-hidden overscroll-y-contain"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-28 md:pt-32 lg:px-16 lg:pb-32 lg:pt-36 xl:px-20 xl:pt-40">
          <header className="mb-14 md:mb-16 lg:mb-20">
            <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(220px,250px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
              <article className="relative max-w-[250px]">
                <div
                  className="pointer-events-none absolute -left-3 -top-4 h-20 w-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,18,25,0.18),rgba(15,18,25,0))] blur-2xl"
                  style={{ transform: `translateY(${-portraitDrift * 0.22}px)` }}
                />
                <div
                  className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,92,166,0.2),rgba(52,92,166,0))] blur-2xl"
                  style={{ transform: `translateY(${portraitDrift * 0.3}px)` }}
                />

                <div
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] border border-[#0f1219]/14 bg-white shadow-[0_20px_44px_-28px_rgba(15,18,25,0.65)]"
                  style={{ transform: `translateY(${portraitDrift * 0.32}px)` }}
                >
                  {scene05.portraitImage ? (
                    <img
                      src={scene05.portraitImage}
                      alt={scene05.portraitAlt || displayName}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#d7e0ef,#f4f7fd)] text-[clamp(2rem,7vw,3.4rem)] font-semibold tracking-[0.08em] text-[#0f1219]/56">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,25,0.02),rgba(15,18,25,0.16))]" />
                </div>
              </article>

              <article
                className="rounded-[26px] border border-[#0f1219]/12 bg-white/78 p-5 shadow-[0_20px_46px_-34px_rgba(15,18,25,0.38)] backdrop-blur-[1px] sm:p-6 md:p-8"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? `translateY(${-heroLift}px)` : 'translateY(18px)',
                  transition: 'transform 700ms ease-out, opacity 700ms ease-out',
                }}
              >
                <h1 className="text-[clamp(2rem,5.6vw,4rem)] leading-[1.04] tracking-[-0.025em] text-[#0f1219]">
                  {introHeading}
                </h1>

                {scene05.role.trim() ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/56 sm:text-[11px]">
                    {scene05.role}
                  </p>
                ) : null}

                <div className="mt-6 space-y-4 sm:space-y-5">
                  {introParagraphs.length > 0
                    ? introParagraphs.map((paragraph, index) => (
                        <p
                          key={`${paragraph.slice(0, 28)}-${index}`}
                          className="text-[1.04rem] leading-[1.72] text-[#0f1219]/78 sm:text-[1.1rem]"
                        >
                          {paragraph}
                        </p>
                      ))
                    : (
                      <p className="text-[1.04rem] leading-[1.72] text-[#0f1219]/78 sm:text-[1.1rem]">
                        {scene05.visionText}
                      </p>
                    )}
                </div>

                {aboutSocialLinks.length > 0 ? (
                  <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {aboutSocialLinks.map((social) => {
                      const SocialIcon = getSocialIconComponent(social.icon);

                      return (
                        <a
                          key={social.id}
                          href={social.href}
                          onClick={(event) => handlePlaceholderLinkClick(event, social.href)}
                          target={isPlaceholderHref(social.href) ? undefined : '_blank'}
                          rel={isPlaceholderHref(social.href) ? undefined : 'noopener noreferrer'}
                          aria-label={social.label}
                          title={social.label}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0f1219]/16 bg-white/88 text-[#0f1219]/72 shadow-[0_12px_22px_-20px_rgba(15,18,25,0.6)] transition-colors duration-200 hover:border-[#0f1219]/28 hover:bg-[#0f1219] hover:text-white"
                        >
                          <SocialIcon size={18} strokeWidth={1.6} />
                        </a>
                      );
                    })}
                  </div>
                ) : null}

                {scene05.actionLabel.trim() && !isPlaceholderHref(scene05.actionHref) ? (
                  <a
                    href={scene05.actionHref}
                    onClick={(event) => handlePlaceholderLinkClick(event, scene05.actionHref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${actionButtonClass} mt-7 max-w-[280px]`}
                  >
                    {scene05.actionLabel}
                  </a>
                ) : null}
              </article>
            </div>
          </header>

          <section className="mb-14 grid gap-8 md:gap-9 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-start lg:gap-10">
            <article className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/58">{scene05.storyTitle}</p>

              <div className="mt-5 space-y-5">
                {storyParagraphs.map((paragraph, index) => {
                  const localReveal = clamp01(storyReveal * 1.3 - index * 0.2);
                  return (
                    <p
                      key={`${paragraph.slice(0, 28)}-${index}`}
                      className="text-sm leading-relaxed text-[#0f1219]/80 transition-[transform,opacity] duration-700 ease-out md:text-[1rem] md:leading-[1.92]"
                      style={{
                        opacity: 0.2 + localReveal * 0.8,
                        transform: `translateX(${(1 - localReveal) * 22}px)`,
                        transitionDelay: `${index * 70}ms`,
                      }}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </article>

            <article className="relative rounded-[28px] border border-[#0f1219]/10 bg-white/58 p-4 md:p-5">
              <div className="mb-4 flex items-center gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/58">{scene05.skillsTitle}</p>
                <span className="rounded-full border border-[#0f1219]/12 bg-[#0f1219]/6 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/62">
                  {skills.length}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-[#0f1219]/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.92),rgba(234,241,251,0.82))] p-4 md:p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/64 to-transparent" />

                <div className="relative flex flex-wrap gap-2.5">
                  {skills.map((skill, index) => {
                    const localReveal = clamp01(skillsReveal * 1.28 - index * 0.07);
                    const tilt = (1 - localReveal) * (index % 2 === 0 ? -5 : 5);

                    return (
                      <span
                        key={`${skill}-${index}`}
                        className="inline-flex rounded-full border border-[#0f1219]/12 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#0f1219]/82 shadow-[0_8px_18px_-14px_rgba(15,18,25,0.45)] transition-[transform,opacity] duration-500 ease-out md:text-xs"
                        style={{
                          opacity: 0.15 + localReveal * 0.85,
                          transform: `translate3d(0, ${(1 - localReveal) * 30}px, 0) rotate(${tilt}deg)`,
                          transitionDelay: `${index * 38}ms`,
                        }}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {(scene05.aiText.trim() || aiTags.length > 0) ? (
                <div className="mt-4 rounded-[20px] border border-[#0f1219]/10 bg-[linear-gradient(160deg,rgba(20,28,45,0.06),rgba(255,255,255,0.7))] p-4 md:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/58">{scene05.aiTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#0f1219]/76 md:text-[0.95rem]">{scene05.aiText}</p>
                  {aiTags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {aiTags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-full border border-[#0f1219]/12 bg-[#0f1219]/6 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f1219]/62"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          </section>

          {certifications.length > 0 ? (
            <section className="mb-12 md:mb-14">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0f1219]/58">
                  {scene05.certificationsTitle}
                </h2>
                <span className="rounded-full border border-[#0f1219]/12 bg-[#0f1219]/6 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f1219]/62">
                  {certifications.length}
                </span>
              </div>

              <div className="space-y-3">
                {certifications.map((item, index) => {
                  const issuer = item.issuer.trim() || scene05.certificationsTitle;
                  const issuerInitial = issuer.charAt(0).toUpperCase() || 'C';
                  const entryReveal = clamp01(certReveal * 1.25 - index * 0.12);
                  const direction = index % 2 === 0 ? -1 : 1;

                  return (
                    <article
                      key={item.id}
                      className="grid gap-4 rounded-[22px] border border-[#0f1219]/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(231,240,250,0.74))] p-4 shadow-[0_20px_42px_-34px_rgba(15,18,25,0.55)] transition-[transform,opacity] duration-700 ease-out md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      style={{
                        opacity: 0.24 + entryReveal * 0.76,
                        transform: `translateX(${(1 - entryReveal) * direction * 56}px)`,
                      }}
                    >
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-full border border-[#0f1219]/12 bg-[#0f1219]/6 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f1219]/62">
                            {issuer}
                          </span>
                          {item.year ? (
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f1219]/48">{item.year}</span>
                          ) : null}
                        </div>

                        <h3 className="text-sm leading-snug text-[#0f1219] md:text-[1rem]">{item.title}</h3>
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#0f1219]/12 bg-white">
                            {item.logoSrc ? (
                              <img src={item.logoSrc} alt={issuer} className="h-5 w-5 object-contain" />
                            ) : (
                              <span className="text-xs text-[#0f1219]/52">{issuerInitial}</span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f1219]/62">{issuer}</span>
                        </div>

                        {item.credentialUrl && !isPlaceholderHref(item.credentialUrl) ? (
                          <a
                            href={item.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[#0f1219]/14 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#0f1219]/72 transition-colors hover:bg-[#0f1219] hover:text-white"
                          >
                            {scene05.credentialButtonLabel}
                          </a>
                        ) : (
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#0f1219]/48">
                            {scene05.credentialButtonLabel}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <div className="h-16 md:h-20" />
        </div>
      </div>
    </section>
  );
};
