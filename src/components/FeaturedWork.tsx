import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getButtonClass, getCardClass, getGlassClass, getScaledRem } from './designSystem';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkProps {
  isActive: boolean;
}

const isPlaceholderHref = (href: string) => href.trim() === '#';

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ isActive }) => {
  const { siteConfig } = useSiteConfig();
  const { featured, visibility, designSystem } = siteConfig;
  const projects = useMemo(() => siteConfig.projects.filter((project) => project.visible), [siteConfig.projects]);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const backNavLockUntilRef = useRef(0);
  const pendingSectionRef = useRef<'projects' | 'testimonials' | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handlePlaceholderLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPlaceholderHref(href)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const initTimer = window.setTimeout(() => {
      if (containerRef.current) containerRef.current.scrollTop = 0;
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
    }, 50);

    let refreshTimer = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.56 });

      tl.fromTo(
        '.fw-header-text',
        { y: 70, opacity: 0, rotationX: 12, transformOrigin: '0% 50% -40' },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12 },
      );

      const elements = gsap.utils.toArray<HTMLElement>('.fw-reveal', containerRef.current);
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 90, opacity: 0, scale: 0.95, rotationX: 6 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.35,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              scroller: containerRef.current,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      if (visibility.testimonialsSection || visibility.featuredCtaSection) {
        gsap.to('.projects-wrapper', {
          x: '42%',
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.next-page-slide',
            scroller: containerRef.current,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.fromTo(
          '.next-page-slide',
          { x: '-86%', opacity: 0 },
          {
            x: '0%',
            opacity: 1,
            duration: 1.25,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: '.next-page-slide',
              scroller: containerRef.current,
              start: 'top 96%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    }, containerRef);

    return () => {
      window.clearTimeout(initTimer);
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [
    isActive,
    visibility.featuredCtaSection,
    visibility.featuredHeader,
    visibility.featuredProjectsGrid,
    visibility.testimonialsSection,
    projects.length,
  ]);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: 'home' } }));
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;

    const now = Date.now();
    const isNearTop = containerRef.current.scrollTop <= 8;
    const isStrongUpIntent = e.deltaY < -20;

    if (isNearTop && isStrongUpIntent && now >= backNavLockUntilRef.current) {
      backNavLockUntilRef.current = now + 700;
      e.stopPropagation();
      handleBack();
      return;
    }

    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const startY = touchStartYRef.current;
    touchStartYRef.current = null;
    if (startY === null) return;

    const endY = e.changedTouches[0]?.clientY;
    if (typeof endY !== 'number') return;

    const now = Date.now();
    if (now < backNavLockUntilRef.current) return;

    const deltaY = startY - endY;
    const isNearTop = containerRef.current.scrollTop <= 10;

    if (isNearTop && deltaY < -64) {
      backNavLockUntilRef.current = now + 700;
      handleBack();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY.current + 10) {
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
        lastScrollY.current = currentScrollY;
      } else if (currentScrollY < lastScrollY.current - 10) {
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
        lastScrollY.current = currentScrollY;
      }
      return;
    }

    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
    lastScrollY.current = currentScrollY;
  };

  const runPortfolioNavigation = useCallback(
    (section: 'projects' | 'testimonials', behavior: ScrollBehavior = 'smooth') => {
      if (!containerRef.current) return;

      if (section === 'projects') {
        containerRef.current.scrollTo({ top: 0, behavior });
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
        return;
      }

      const slide = containerRef.current.querySelector('.next-page-slide') as HTMLElement | null;
      if (!slide) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const targetTop = containerRef.current.scrollTop + (slideRect.top - containerRect.top) - 100;

      containerRef.current.scrollTo({ top: Math.max(0, targetTop), behavior });
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: false } }));
    },
    [],
  );

  useEffect(() => {
    const navTimers: number[] = [];
    const schedule = (cb: () => void, delayMs: number) => {
      const id = window.setTimeout(cb, delayMs);
      navTimers.push(id);
    };

    const handleNav = (e: Event) => {
      const { section } = (e as CustomEvent).detail;

      if (section === 'projects' || section === 'testimonials') {
        pendingSectionRef.current = section;

        if (isActive) {
          schedule(() => {
            runPortfolioNavigation(section, 'smooth');
            pendingSectionRef.current = null;
          }, 120);
        }
        return;
      }

      if (section === 'home') {
        pendingSectionRef.current = null;
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      } else if (section === 'about') {
        pendingSectionRef.current = null;
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: { show: true } }));
      }
    };

    window.addEventListener('nav-to-section', handleNav);
    return () => {
      window.removeEventListener('nav-to-section', handleNav);
      navTimers.forEach((id) => window.clearTimeout(id));
    };
  }, [isActive, runPortfolioNavigation]);

  useEffect(() => {
    if (!isActive || !pendingSectionRef.current) return;

    const targetSection = pendingSectionRef.current;
    const activationTimer = window.setTimeout(() => {
      runPortfolioNavigation(targetSection, 'auto');
      pendingSectionRef.current = null;
    }, 160);

    return () => window.clearTimeout(activationTimer);
  }, [isActive, runPortfolioNavigation]);

  const projectCardClass = `${getCardClass(
    designSystem.components.featuredProjectCardVariant,
    'light',
    'overflow-hidden p-4 md:p-5',
  )} ${getGlassClass(designSystem.components.globalGlassVariant, 'light')}`;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onScroll={handleScroll}
      className={`fixed inset-0 z-[200] bg-[radial-gradient(1200px_700px_at_12%_0%,rgba(11,15,24,0.08),transparent_62%),radial-gradient(900px_600px_at_95%_20%,rgba(24,39,70,0.06),transparent_66%),linear-gradient(180deg,#f2f5fb_0%,#f8fbff_58%,#eef3fa_100%)] text-[#0f1219] transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] overflow-y-auto overflow-x-hidden overscroll-y-contain ${
        isActive ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-12'
      }`}
    >
      <div className="projects-wrapper mx-auto w-full max-w-[1600px] origin-right px-6 py-24 md:px-12 md:py-32 lg:px-20">
        {visibility.featuredHeader ? (
          <div className="mb-16 flex flex-col gap-9 md:mb-24 md:flex-row md:items-end md:justify-between">
            <h1
              className="fw-header-text opacity-0 text-[#0f1219]"
              style={{
                fontSize: `clamp(${getScaledRem(siteConfig.designSystem.theme.displayTitleSizeRem * 0.34, siteConfig.designSystem.theme.headingScale)}, 12vw, ${getScaledRem(siteConfig.designSystem.theme.displayTitleSizeRem * 0.86, siteConfig.designSystem.theme.headingScale)})`,
                lineHeight: 0.92,
                letterSpacing: `${siteConfig.designSystem.theme.headingLetterSpacingEm}em`,
                fontWeight: siteConfig.designSystem.theme.headingWeight,
              }}
            >
              {featured.titleLine1}
              <br />
              {featured.titleLine2}
            </h1>
            <p className="fw-header-text opacity-0 max-w-[360px] font-mono text-[11px] uppercase tracking-[0.16em] text-[#0f1219]/56 md:text-xs md:leading-[1.9]">
              {featured.description}
            </p>
          </div>
        ) : null}

        {visibility.featuredProjectsGrid ? (
          <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2" style={{ perspective: '1600px' }}>
            {projects.map((project) => (
              <article
                key={project.id}
                className={`fw-reveal group opacity-0 ${projectCardClass}`}
                style={{ transformOrigin: 'center bottom' }}
              >
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[14px] border border-[#0f1219]/10 bg-[#0f1219]/4">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,25,0.02),rgba(15,18,25,0.28))]" />
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f1219]/56 md:text-[11px]">{project.tags}</p>
                <h3 className="mt-3 font-sans text-[2.1rem] leading-[0.95] tracking-tight text-[#0f1219] md:text-[2.6rem]">
                  {project.title}
                </h3>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={project.behance}
                    onClick={(e) => handlePlaceholderLinkClick(e, project.behance)}
                    target={isPlaceholderHref(project.behance) ? undefined : '_blank'}
                    rel={isPlaceholderHref(project.behance) ? undefined : 'noopener noreferrer'}
                    className={getButtonClass(
                      designSystem.components.featuredProjectButtonVariant,
                      'light',
                      'sm',
                      'min-w-[138px] justify-center',
                    )}
                  >
                    {featured.caseStudyLabel}
                  </a>

                  <a
                    href={project.live}
                    onClick={(e) => handlePlaceholderLinkClick(e, project.live)}
                    target={isPlaceholderHref(project.live) ? undefined : '_blank'}
                    rel={isPlaceholderHref(project.live) ? undefined : 'noopener noreferrer'}
                    className={getButtonClass(
                      designSystem.components.featuredProjectButtonVariant,
                      'light',
                      'sm',
                      'min-w-[138px] justify-center gap-2',
                    )}
                  >
                    <span>{featured.liveLabel}</span>
                    <span aria-hidden="true">{'->'}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {visibility.featuredViewAllButton ? (
          <div className="fw-reveal mb-8 mt-16 flex justify-center opacity-0 md:mb-14">
            <button
              type="button"
              className={getButtonClass(
                designSystem.components.featuredViewAllButtonVariant,
                'light',
                'md',
                'min-w-[220px] justify-center',
              )}
            >
              {featured.viewAllLabel}
            </button>
          </div>
        ) : null}

      </div>

      <div className="next-page-slide relative z-[250] w-full rounded-t-[8px] bg-white pt-28 pb-0 shadow-[0_-16px_42px_rgba(0,0,0,0.045)] md:pt-32">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
          {visibility.testimonialsSection ? <Testimonials isActive={isActive} /> : null}

          {visibility.featuredCtaSection ? (
            <div className="fw-reveal relative mt-24 flex w-full flex-col items-center overflow-hidden pb-10 opacity-0 md:mt-32">
              <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 opacity-55 blur-[110px] md:w-[70%] md:blur-[140px]" />

              <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center border-t border-[#0f1219]/10 px-6 py-16 text-center md:py-28">
                <h2 className="text-[#0f1219] text-[11vw] leading-[1.03] tracking-tight sm:text-5xl md:text-7xl lg:text-[6.7rem]">
                  <span className="mb-2 block font-sans font-medium md:mb-4">{featured.ctaTitleLine1}</span>
                  <span className="block font-serif text-[#0f1219]/82">{featured.ctaTitleLine2}</span>
                </h2>

                <p className="mb-11 mt-7 max-w-2xl px-4 text-sm leading-relaxed text-[#0f1219]/62 md:mb-14 md:text-lg">
                  {featured.ctaDescription}
                </p>

                <a
                  href={featured.ctaButtonHref}
                  className={getButtonClass(
                    designSystem.components.featuredCtaButtonVariant,
                    'light',
                    'lg',
                    'min-w-[220px] justify-center',
                  )}
                >
                  {featured.ctaButtonText}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};
