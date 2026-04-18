import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '../config/siteConfig';
import { getButtonClass, getCardClass, getGlassClass } from './designSystem';

interface PersistentUIProps {
  isLightMode?: boolean;
}

const PENDING_NAV_SECTION_KEY = 'portfolio.pending-nav-section.v1';

export const PersistentUI: React.FC<PersistentUIProps> = ({ isLightMode = false }) => {
  const { siteConfig } = useSiteConfig();
  const { persistentUI } = siteConfig;
  const { visibility } = siteConfig;
  const dsComponents = siteConfig.designSystem.components;

  const visibleNavItems = useMemo(() => {
    const defaultArticlesItem =
      DEFAULT_SITE_CONFIG.persistentUI.navItems.find((item) => item.section === 'articles') ?? {
        id: 'nav-articles',
        label: 'Articles',
        section: 'articles',
        visible: true,
      };

    const baseNavItems = [...persistentUI.navItems];
    const articleIndex = baseNavItems.findIndex((item) => item.section === 'articles');

    if (articleIndex === -1) {
      baseNavItems.push(defaultArticlesItem);
    } else {
      baseNavItems[articleIndex] = {
        ...baseNavItems[articleIndex],
        label: baseNavItems[articleIndex].label || defaultArticlesItem.label,
        visible: true,
      };
    }

    return baseNavItems.filter((item) => item.visible);
  }, [persistentUI.navItems]);

  const [visible, setVisible] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!visibility.musicToggle) return;
    if (!audioRef.current) return;

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
        .catch((e) => {
          console.warn('Autoplay blocked by browser. User interaction required.', e);
          setIsMusicPlaying(false);

          let interactionHandled = false;
          const playOnInteract = () => {
            if (interactionHandled) return;
            interactionHandled = true;

            if (audioRef.current && audioRef.current.paused) {
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
                .catch(() => {});
            }
          };

          window.addEventListener('click', playOnInteract, { capture: true, once: true });
          window.addEventListener('touchstart', playOnInteract, { capture: true, once: true });
          window.addEventListener('wheel', playOnInteract, { capture: true, once: true });
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

  useEffect(() => {
    if (!isLightMode) {
      setScrollVisible(true);
    }
  }, [isLightMode]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleNavbarToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ show: boolean }>;
      if (customEvent.detail) {
        setScrollVisible(customEvent.detail.show);
      }
    };

    window.addEventListener('toggle-navbar', handleNavbarToggle);
    return () => window.removeEventListener('toggle-navbar', handleNavbarToggle);
  }, []);

  const getCurrentRouteSection = () => {
    const hash = window.location.hash.replace(/^#/, '');
    const path = window.location.pathname;
    const source = hash && hash !== '/' ? hash : path;
    return source
      .replace(/^\/+/, '')
      .split('/')
      .filter(Boolean)[0]
      ?.toLowerCase();
  };

  const isStandaloneRoute = () => {
    const section = getCurrentRouteSection();
    return section === 'articles' || section === 'dashboard';
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
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
            animation: eq-play 1s ease-in-out infinite;
          }
          .eq-bar:nth-child(1) { animation-duration: 0.9s; }
          .eq-bar:nth-child(2) { animation-duration: 1.1s; animation-delay: 0.2s; }
          .eq-bar:nth-child(3) { animation-duration: 0.8s; animation-delay: 0.4s; }
        `}
      </style>

      <div
        className={`fixed top-0 left-0 right-0 z-[250] pointer-events-none h-[60px] md:h-[120px] px-4 md:px-[60px] flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          visible && scrollVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
        data-surface="text"
      >
        <div className="flex flex-1 justify-start">
          {visibility.navigationLogo ? (
            <a
              href="#/"
              onClick={(e) => handleNav(e, 'home')}
              className="pointer-events-auto flex items-center hover:opacity-70 transition-opacity"
            >
              <img
                src={isLightMode ? '/logo-black.png' : '/logo-white.png'}
                alt={persistentUI.logoAlt}
                className={`h-8 md:h-[50px] w-auto object-contain transition-all duration-500 ${
                  isLightMode
                    ? 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.18)]'
                    : 'drop-shadow-[0_5px_12px_rgba(0,0,0,0.24)]'
                }`}
              />
            </a>
          ) : null}
        </div>

        {visibility.navigationMenu && visibleNavItems.length > 0 ? (
          <nav
            data-surface="form"
            className={`${getCardClass(
              dsComponents.navigationShellCardVariant,
              isLightMode ? 'light' : 'dark',
            )} ${getGlassClass(
              dsComponents.navigationGlassVariant,
              isLightMode ? 'light' : 'dark',
            )} pointer-events-auto absolute left-1/2 top-1/2 hidden max-w-[calc(100vw-220px)] -translate-x-1/2 -translate-y-1/2 items-center gap-8 overflow-x-auto whitespace-nowrap px-8 py-3.5 transition-all duration-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex ${
              isLightMode ? 'shadow-sys-soft-light' : 'shadow-sys-soft-dark'
            }`}
            style={{ position: 'absolute' }}
          >
            {visibleNavItems.map((item) => (
              <a
                key={item.id}
                href={item.section === 'articles' ? '#/articles' : `#${item.section}`}
                onClick={(e) => handleNav(e, item.section)}
                className={`shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  isLightMode ? 'text-[#1d2433]/70 hover:text-[#0f1219]' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}

        {visibility.navigationMenu && visibleNavItems.length > 0 ? (
          <nav
            data-surface="form"
            className={`${getCardClass(
              dsComponents.navigationShellCardVariant,
              isLightMode ? 'light' : 'dark',
            )} ${getGlassClass(
              dsComponents.navigationGlassVariant,
              isLightMode ? 'light' : 'dark',
            )} pointer-events-auto fixed bottom-5 left-1/2 z-[300] flex w-[94vw] max-w-[520px] -translate-x-1/2 items-center justify-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3.5 transition-all duration-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden ${
              isLightMode ? 'shadow-sys-soft-light' : 'shadow-sys-soft-dark'
            } ${
              visible && scrollVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ position: 'fixed' }}
          >
            {visibleNavItems.map((item) => (
              <a
                key={item.id}
                href={item.section === 'articles' ? '#/articles' : `#${item.section}`}
                onClick={(e) => handleNav(e, item.section)}
                className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors sm:text-[11px] sm:tracking-[0.15em] ${
                  isLightMode ? 'text-[#1d2433]/70 hover:text-[#0f1219]' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="flex flex-1 justify-end items-center gap-3 pointer-events-none">
          {visibility.musicToggle ? <audio ref={audioRef} src={persistentUI.musicSrc} loop /> : null}

          {visibility.musicToggle ? (
            <button
              onClick={toggleMusic}
              className={getButtonClass(
                dsComponents.musicToggleButtonVariant,
                isLightMode ? 'light' : 'dark',
                'icon',
                `pointer-events-auto shrink-0 ${
                  isLightMode ? 'shadow-sys-soft-light' : 'shadow-sys-soft-dark'
                }`,
              )}
              aria-label="Toggle Music"
            >
              {isMusicPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="6" width="3" height="12" rx="1.5" className="eq-bar" />
                  <rect x="10.5" y="3" width="3" height="18" rx="1.5" className="eq-bar" />
                  <rect x="16" y="8" width="3" height="8" rx="1.5" className="eq-bar" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
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
              className={getButtonClass(
                dsComponents.persistentLetsTalkButtonVariant,
                isLightMode ? 'light' : 'dark',
                'md',
                `pointer-events-auto hidden sm:flex min-w-[138px] items-center gap-3 ${
                  isLightMode ? 'shadow-sys-soft-light' : 'shadow-sys-soft-dark'
                }`,
              )}
            >
              {persistentUI.letsTalkLabel}
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
};
