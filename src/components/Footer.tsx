import React from 'react';
import { getSocialIconComponent } from './icons';
import { useSiteConfig } from '../context/SiteConfigContext';
import { type SiteSection } from '../config/siteConfig';

const isPlaceholderHref = (href: string) => href.trim() === '#';
const PENDING_NAV_SECTION_KEY = 'portfolio.pending-nav-section.v1';

export const Footer: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { footer, persistentUI, visibility } = siteConfig;

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
        window.sessionStorage.setItem(PENDING_NAV_SECTION_KEY, section);
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

  return (
    <footer className="w-full bg-white text-[#0a0a0b] pt-24 pb-12 border-t border-[#0a0a0b]/10 relative z-10 selection:bg-[#0a0a0b]/10 font-mono uppercase text-[10px] sm:text-[11px] tracking-[0.15em] leading-relaxed">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between gap-16 md:gap-8">
        
        {/* Left Section */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            {visibility.footerEmail ? (
              <a
                href={`mailto:${footer.email}`}
                className="group/link flex flex-col gap-[6px] hover:opacity-70 transition-opacity w-max"
              >
                <span className="text-[#0a0a0b] text-[11px] sm:text-[13px] tracking-[0.25em] font-bold uppercase">
                  {footer.email}
                </span>
                <span className="w-full h-[1px] bg-[#0a0a0b]/30"></span>
              </a>
            ) : null}

            {visibility.footerSocialLinks && visibleSocialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-start gap-5 mt-10 text-[#0a0a0b]">
                {visibleSocialLinks.map((social, index) => {
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
                        className="hover:opacity-60 transition-opacity duration-300 flex items-center justify-center"
                      >
                        <SocialIcon size={22} strokeWidth={1.5} />
                      </a>
                      {index < visibleSocialLinks.length - 1 ? (
                        <span className="w-[1px] h-[18px] bg-[#0a0a0b]/30"></span>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
          
          <div className="mt-24 md:mt-32">
            <p className="text-[#0a0a0b]/60">© {new Date().getFullYear()} {footer.copyrightText}</p>
            {visibility.footerLegalLinks && visibleLegalLinks.length > 0 ? (
              <div className="text-[#0a0a0b]/40 mt-3 hover:text-[#0a0a0b]/60 transition-colors flex flex-wrap gap-2">
                {visibleLegalLinks.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <a
                      href={link.href}
                      onClick={(e) => handlePlaceholderLinkClick(e, link.href)}
                      className="hover:text-[#0a0a0b] transition-colors relative group/link"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#0a0a0b] transition-all duration-300 group-hover/link:w-full"></span>
                    </a>
                    {index < visibleLegalLinks.length - 1 ? <span>|</span> : null}
                  </React.Fragment>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Sections Container */}
        <div className="flex flex-col sm:flex-row gap-16 md:gap-32 lg:gap-48 mt-2 md:mt-0">
          
          {/* Middle Nav */}
          {visibility.footerNavLinks && syncedNavLinks.length > 0 ? (
            <ul className="flex flex-col gap-5">
              {syncedNavLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSectionNav(e, item.section)}
                    className="text-[#0a0a0b]/60 hover:text-[#0a0a0b] font-semibold transition-colors relative group/link text-[11px] sm:text-[12px] tracking-[0.2em]"
                  >
                    {item.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[#0a0a0b] transition-all duration-300 group-hover/link:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Right Address */}
          {visibility.footerOffice ? (
            <div className="flex flex-col gap-3">
              <p className="text-[#0a0a0b] font-bold mb-1 tracking-[0.2em]">{footer.officeTitle}</p>
              <p className="text-[#0a0a0b]/60 leading-loose font-medium">
                {footer.officeAddress.split('\n').map((line, idx) => (
                  <React.Fragment key={`${line}-${idx}`}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          ) : null}

        </div>

      </div>
    </footer>
  );
};
