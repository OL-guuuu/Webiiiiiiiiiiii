import React from 'react';
import { getButtonClass } from './designSystem';
import { getSocialIconComponent, MailIcon } from './icons';
import { useSiteConfig } from '../context/SiteConfigContext';
import { type SiteSection } from '../config/siteConfig';

const isPlaceholderHref = (href: string) => href.trim() === '#';
const PENDING_NAV_SECTION_KEY = 'portfolio.pending-nav-section.v1';

const SITE_SECTIONS: SiteSection[] = ['home', 'about', 'projects', 'testimonials', 'articles', 'contact'];

export const Footer: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { footer, persistentUI, visibility, designSystem } = siteConfig;

  if (!visibility.footer) return null;

  const visibleSocialLinks = footer.socialLinks.filter((link) => link.visible);
  const visibleLegalLinks = footer.legalLinks.filter((link) => link.visible);
  const syncedNavLinks = persistentUI.navItems
    .filter((item) => item.visible)
    .map((item) => ({
      id: `footer-sync-${item.id}`,
      label: item.label,
      section: item.section,
      href: item.section === 'articles' ? '#/articles' : `#${item.section}`,
    }));

  const handlePlaceholderLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPlaceholderHref(href)) {
      e.preventDefault();
    }
  };

  const getCurrentRouteSection = () => {
    if (typeof window === 'undefined') return 'home';

    const hash = window.location.hash.replace(/^#/, '');
    const path = window.location.pathname;
    const source = hash && hash !== '/' ? hash : path;

    return (
      source
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean)[0]
        ?.toLowerCase() ?? 'home'
    );
  };

  const isStandaloneRoute = () => {
    const section = getCurrentRouteSection();
    return section === 'articles' || section === 'dashboard';
  };

  const handleSectionNav = (e: React.MouseEvent<HTMLAnchorElement>, section: SiteSection) => {
    e.preventDefault();

    if (section === 'articles') {
      window.location.hash = '/articles';
      return;
    }

    if (isStandaloneRoute()) {
      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage?.setItem(PENDING_NAV_SECTION_KEY, section);
        } catch {
          console.warn('Unable to set session storage');
        }
      }

      window.location.hash = '/';
      const dispatchNavigation = () => {
        window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section } }));
      };

      window.setTimeout(dispatchNavigation, 140);
      window.setTimeout(dispatchNavigation, 420);
      return;
    }

    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section } }));
  };

  const getSectionFromHref = (href: string): SiteSection | null => {
    const cleanHref = href.trim().toLowerCase();
    if (!cleanHref.startsWith('#')) return null;

    const normalized = cleanHref.replace(/^#\/?/, '');
    if (SITE_SECTIONS.includes(normalized as SiteSection)) {
      return normalized as SiteSection;
    }

    return null;
  };

  const socialButtonClass = getButtonClass(designSystem.components.featuredCtaButtonVariant, 'light', 'icon', 'h-10 w-10 transition-all duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]');
  const ctaButtonClass =
    'inline-flex min-w-[190px] items-center justify-center gap-3 rounded-[18px] bg-[#050505] px-7 py-4 text-[1.02rem] font-semibold tracking-[-0.02em] text-white shadow-[0_12px_24px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.16),0_8px_16px_rgba(0,0,0,0.1)] hover:bg-[#080808] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f7]';

  const ctaSection = getSectionFromHref(footer.ctaButtonHref);

  return (
    <footer className="relative z-10 w-full border-t border-[#111217]/10 bg-[#f6f6f7] text-[#111217] selection:bg-[#111217]/10">
      <div className="site-shell pb-8 pt-14 md:pb-10 md:pt-16">
        <div className="grid items-start gap-8 border-b border-[#111217]/10 pb-12 md:grid-cols-2 md:gap-10 xl:grid-cols-[1.6fr_1fr_0.9fr_1.4fr] xl:gap-8">
          <div className="space-y-4">
            <p className="text-[1.42rem] font-semibold leading-tight tracking-tight text-[#111217] md:text-[1.56rem]">
              {footer.brandTitle}
            </p>
            <p className="max-w-[30ch] text-[0.9rem] leading-6 text-[#111217]/70">{footer.brandDescription}</p>
            {visibility.footerEmail ? (
              <a
                href={`mailto:${footer.email}`}
                className="inline-flex items-center gap-2 text-[0.86rem] font-medium text-[#111217]/70 transition-colors hover:text-[#111217] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f7]"
              >
                <MailIcon size={16} strokeWidth={1.8} />
                {footer.email}
              </a>
            ) : null}
          </div>

          {visibility.footerNavLinks && syncedNavLinks.length > 0 ? (
            <div className="space-y-4">
              <p className="text-[1.08rem] font-semibold leading-tight tracking-tight text-[#111217] md:text-[1.15rem]">
                {footer.quickLinksTitle}
              </p>
              <ul className="space-y-2">
                {syncedNavLinks.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleSectionNav(e, item.section)}
                      className="text-[0.9rem] text-[#111217]/65 transition-colors hover:text-[#111217] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f7]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {visibility.footerSocialLinks && visibleSocialLinks.length > 0 ? (
            <div className="space-y-4">
              <p className="text-[1.08rem] font-semibold leading-tight tracking-tight text-[#111217] md:text-[1.15rem]">
                {footer.followTitle}
              </p>
              <div className="flex items-center">
                {visibleSocialLinks.map((social, idx) => {
                  const SocialIcon = getSocialIconComponent(social.icon);
                  return (
                    <React.Fragment key={social.id}>
                      <a
                        href={social.href}
                        onClick={(e) => handlePlaceholderLinkClick(e, social.href)}
                        target={isPlaceholderHref(social.href) ? undefined : '_blank'}
                        rel={isPlaceholderHref(social.href) ? undefined : 'noopener noreferrer'}
                        aria-label={social.label}
                        title={social.label}
                        className="inline-flex items-center justify-center p-0 text-[#111217]/72 transition-colors hover:text-[#111217]"
                      >
                        <SocialIcon size={20} strokeWidth={1.7} />
                      </a>
                      {idx < visibleSocialLinks.length - 1 ? (
                        <span className="mx-4 h-6 w-px bg-[#111217]/10" aria-hidden />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <p className="max-w-[24ch] text-[1.08rem] font-semibold leading-tight tracking-tight text-[#111217] md:text-[1.16rem]">
              {footer.ctaTitle}
            </p>
            <p className="max-w-[34ch] text-[0.9rem] leading-6 text-[#111217]/70">{footer.ctaDescription}</p>
            {visibility.letsTalkButton ? (
              <a
                href={persistentUI.letsTalkHref}
                onClick={(e) => handlePlaceholderLinkClick(e, persistentUI.letsTalkHref)}
                target={isPlaceholderHref(persistentUI.letsTalkHref) ? undefined : '_blank'}
                rel={isPlaceholderHref(persistentUI.letsTalkHref) ? undefined : 'noopener noreferrer'}
                className={
                  'inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium tracking-[0.01em] rounded-xl transition-all duration-400 bg-black text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f7]'
                }
              >
                {persistentUI.letsTalkLabel}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-400"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3.5 pt-4 text-[0.86rem] text-[#111217]/57 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {footer.copyrightText}</p>
          {visibility.footerLegalLinks && visibleLegalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-[#111217]/52">
              {visibleLegalLinks.map((link, index) => (
                <React.Fragment key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => handlePlaceholderLinkClick(e, link.href)}
                    className="transition-colors hover:text-[#111217] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111217]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f7]"
                  >
                    {link.label}
                  </a>
                  {index < visibleLegalLinks.length - 1 ? <span className="text-[#111217]/25">•</span> : null}
                </React.Fragment>
              ))}
            </div>
          ) : null}
          <p>{footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  );
};
