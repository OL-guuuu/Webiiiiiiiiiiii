import React, { useEffect, useState, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '../config/siteConfig';

interface AdvancedNavbarProps {
  isLightMode?: boolean;
}

const PENDING_NAV_SECTION_KEY = 'portfolio.pending-nav-section.v1';

export const AdvancedNavbar: React.FC<AdvancedNavbarProps> = ({ isLightMode = false }) => {
  const { siteConfig } = useSiteConfig();
  const { persistentUI } = siteConfig;
  const { visibility } = siteConfig;

  const [activeSection, setActiveSection] = useState<string>('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const visibleNavItems = useMemo(() => {
    const baseNavItems = [...persistentUI.navItems];

    return baseNavItems.filter((item) => item.visible);
  }, [persistentUI.navItems]);

  // Detect current section
  useEffect(() => {
    const detectSection = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = window.location.pathname;
      const source = hash && hash !== '/' ? hash : path;

      const section = source
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean)[0]
        ?.toLowerCase() || 'home';

      setActiveSection(section);
    };

    // Listen for navigation events
    const handleNavToSection = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section) {
        setActiveSection(customEvent.detail.section);
      }
    };

    const handleNavActiveSection = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section) {
        setActiveSection(customEvent.detail.section);
      }
    };

    detectSection();
    window.addEventListener('hashchange', detectSection);
    window.addEventListener('popstate', detectSection);
    window.addEventListener('nav-to-section', handleNavToSection);
    window.addEventListener('nav-active-section', handleNavActiveSection);

    return () => {
      window.removeEventListener('hashchange', detectSection);
      window.removeEventListener('popstate', detectSection);
      window.removeEventListener('nav-to-section', handleNavToSection);
      window.removeEventListener('nav-active-section', handleNavActiveSection);
    };
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Music toggle
  useEffect(() => {
    if (!visibility.musicToggle || !audioRef.current) return;

    audioRef.current.volume = 0;
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!audioRef.current?.paused) {
            setIsMusicPlaying(true);
            gsap.to(audioRef.current, {
              volume: persistentUI.musicVolume,
              duration: 2,
              ease: 'power1.inOut',
            });
          }
        })
        .catch(() => {
          setIsMusicPlaying(false);
        });
    }
  }, [persistentUI.musicVolume, visibility.musicToggle]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (!audioRef.current.paused) {
      setIsMusicPlaying(false);
      gsap.to(audioRef.current, {
        volume: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (audioRef.current) audioRef.current.pause();
        },
      });
    } else {
      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          if (!audioRef.current?.paused) {
            setIsMusicPlaying(true);
            gsap.to(audioRef.current, {
              volume: persistentUI.musicVolume,
              duration: 2,
              ease: 'power1.inOut',
            });
          }
        })
        .catch(console.error);
    }
  };

  // Update indicator position
  useEffect(() => {
    if (!indicatorRef.current || !navLinksRef.current) return;

    const updateIndicator = () => {
      const activeLink = navLinksRef.current?.querySelector(`[data-section="${activeSection}"]`) as HTMLElement;
      if (!activeLink || !navLinksRef.current) return;

      const navRect = navLinksRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      gsap.to(indicatorRef.current, {
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    };

    // Update immediately and also on window resize
    updateIndicator();
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

  const isStandaloneRoute = () => {
    return activeSection === 'articles' || activeSection === 'contact' || activeSection === 'dashboard';
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();

    // Update active section immediately for visual feedback
    setActiveSection(section);

    if (section === 'articles' || section === 'contact') {
      window.location.hash = `/${section}`;
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

  const navigationLogoSrc = isLightMode
    ? persistentUI.logoLightSrc || '/logo-black.png'
    : persistentUI.logoDarkSrc || '/logo-white.png';

  if (!visibility.persistentUI) return null;

  return (
    <>
      <style>
        {`
          @keyframes eq-play {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          .eq-bar {
            transform-origin: center;
            animation: eq-play 1.2s ease-in-out infinite;
          }
          .eq-bar:nth-child(1) { animation-duration: 1s; }
          .eq-bar:nth-child(2) { animation-duration: 1.3s; animation-delay: 0.2s; }
          .eq-bar:nth-child(3) { animation-duration: 0.9s; animation-delay: 0.4s; }

          @keyframes nav-indicator {
            0% { opacity: 0; transform: scaleX(0); }
            100% { opacity: 1; transform: scaleX(1); }
          }

          .nav-indicator-active {
            animation: nav-indicator 0.4s ease-out forwards;
          }

          .nav-link {
            position: relative;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .nav-link:hover::after,
          .nav-link.active::after {
            transform: scaleX(1);
            transform-origin: left;
          }

          .nav-link.active::after {
            background: currentColor;
          }

          @keyframes mobile-menu-slide {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .mobile-menu-item {
            animation: mobile-menu-slide 0.4s ease-out forwards;
          }

          .mobile-menu-item:nth-child(1) { animation-delay: 0.08s; }
          .mobile-menu-item:nth-child(2) { animation-delay: 0.12s; }
          .mobile-menu-item:nth-child(3) { animation-delay: 0.16s; }
          .mobile-menu-item:nth-child(4) { animation-delay: 0.2s; }
          .mobile-menu-item:nth-child(5) { animation-delay: 0.24s; }

          .glass-nav {
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }

          .nav-container {
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .nav-scrolled {
            background: ${isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 11, 0.95)'};
            border-bottom: 1px solid ${isLightMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'};
            box-shadow: ${isLightMode ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 4px 20px -2px rgba(0, 0, 0, 0.3)'};
          }

          .nav-transparent {
            background: transparent;
            border-bottom: none;
          }
        `}
      </style>

      {/* Desktop Navigation */}
      <div
        ref={navContainerRef}
        className={`fixed top-0 left-0 right-0 z-[250] glass-nav nav-container ${
          isScrolled ? 'nav-scrolled' : 'nav-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="relative h-[80px] md:h-[96px] flex items-center">
            {/* Logo */}
            {visibility.navigationLogo ? (
              <a
                href="#/"
                onClick={(e) => handleNav(e, 'home')}
                className="flex-shrink-0 group"
              >
                <img
                  src={navigationLogoSrc}
                  alt={persistentUI.logoAlt}
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-400 group-hover:scale-105"
                />
              </a>
            ) : (
              <div className="w-0" />
            )}

            {/* Navigation Links - True Center */}
            {visibility.navigationMenu && visibleNavItems.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
                <div
                  className="pointer-events-auto flex max-w-[70vw] items-center gap-1"
                  ref={navLinksRef}
                >
                  {visibleNavItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.section === 'articles' || item.section === 'contact' ? `#/${item.section}` : `#${item.section}`}
                      onClick={(e) => handleNav(e, item.section)}
                      data-section={item.section}
                      className={`nav-link px-6 py-3 text-sm font-medium tracking-[0.01em] transition-all duration-400 rounded-lg ${
                        activeSection === item.section
                          ? isLightMode
                            ? 'text-black bg-gray-100/80'
                            : 'text-white bg-white/15'
                          : isLightMode
                            ? 'text-gray-800 hover:text-black hover:bg-gray-50/60'
                            : 'text-gray-200 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-4 flex-shrink-0">
              {visibility.musicToggle ? <audio ref={audioRef} src={persistentUI.musicSrc} loop /> : null}

              {visibility.musicToggle ? (
                <button
                  onClick={toggleMusic}
                  className={`relative h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-400 ${
                    isLightMode
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                  }`}
                  aria-label="Toggle Music"
                >
                  {isMusicPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="6" width="3" height="12" rx="1.5" className="eq-bar" />
                      <rect x="10.5" y="3" width="3" height="18" rx="1.5" className="eq-bar" />
                      <rect x="16" y="8" width="3" height="8" rx="1.5" className="eq-bar" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12h3l2.5-4 5 8 2.5-4h3"></path>
                    </svg>
                  )}
                </button>
              ) : null}

              {visibility.letsTalkButton ? (
                <a
                  href={persistentUI.letsTalkHref}
                  className={`hidden sm:flex items-center gap-2.5 px-6 py-3 text-sm font-medium tracking-[0.01em] rounded-xl transition-all duration-400 ${
                    isLightMode
                      ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20'
                      : 'bg-white text-black hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20'
                  }`}
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
                    className="transition-transform duration-400 group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {visibility.navigationMenu && visibleNavItems.length > 0 ? (
        <>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden fixed top-4 right-4 z-[260] h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-400 ${
              isLightMode
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
            }`}
            aria-label="Toggle Menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-400 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>

          {/* Mobile Music Toggle */}
          {visibility.musicToggle ? (
            <button
              onClick={toggleMusic}
              className={`md:hidden fixed top-4 right-20 z-[260] h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-400 ${
                isLightMode
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
              }`}
              aria-label="Toggle Music"
            >
              {isMusicPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="6" width="3" height="12" rx="1.5" className="eq-bar" />
                  <rect x="10.5" y="3" width="3" height="18" rx="1.5" className="eq-bar" />
                  <rect x="16" y="8" width="3" height="8" rx="1.5" className="eq-bar" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h3l2.5-4 5 8 2.5-4h3"></path>
                </svg>
              )}
            </button>
          ) : null}

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden fixed inset-0 z-[255] glass-nav ${
                isLightMode ? 'bg-white/98' : 'bg-[#0a0a0b]/98'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex flex-col items-center justify-center h-full gap-8">
                {visibleNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.section === 'articles' || item.section === 'contact' ? `#/${item.section}` : `#${item.section}`}
                    onClick={(e) => {
                      handleNav(e, item.section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`mobile-menu-item text-3xl font-medium tracking-[0.01em] transition-all duration-400 ${
                      activeSection === item.section
                        ? isLightMode
                          ? 'text-black'
                          : 'text-white'
                        : isLightMode
                          ? 'text-gray-700 hover:text-black'
                          : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};