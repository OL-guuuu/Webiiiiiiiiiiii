import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '../config/siteConfig';
import { getButtonClass, getCardClass, getGlassClass } from './designSystem';
import { AdvancedNavbar } from './AdvancedNavbar';

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
  const lastScrollPositionRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const lastGestureAtRef = useRef(0);

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
    if (typeof window === 'undefined') return;

    const VISIBILITY_DELTA_THRESHOLD = 8;
    const TOP_REVEAL_THRESHOLD = 24;
    const MIN_GESTURE_GAP_MS = 80;

    const applyDirectionalVisibility = (delta: number) => {
      if (Math.abs(delta) < VISIBILITY_DELTA_THRESHOLD) return;

      const now = Date.now();
      if (now - lastGestureAtRef.current < MIN_GESTURE_GAP_MS) return;
      lastGestureAtRef.current = now;

      setScrollVisible(delta < 0);
    };

    const handleWindowScroll = () => {
      const current = window.scrollY || window.pageYOffset || 0;

      if (current <= TOP_REVEAL_THRESHOLD) {
        setScrollVisible(true);
        lastScrollPositionRef.current = current;
        return;
      }

      const delta = current - lastScrollPositionRef.current;
      applyDirectionalVisibility(delta);
      lastScrollPositionRef.current = current;
    };

    const handleWheel = (event: WheelEvent) => {
      const current = window.scrollY || window.pageYOffset || 0;
      if (current <= TOP_REVEAL_THRESHOLD && event.deltaY < 0) {
        setScrollVisible(true);
        return;
      }

      applyDirectionalVisibility(event.deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (typeof startY !== 'number') return;

      const endY = event.changedTouches[0]?.clientY;
      if (typeof endY !== 'number') return;

      const delta = startY - endY;
      const current = window.scrollY || window.pageYOffset || 0;

      if (current <= TOP_REVEAL_THRESHOLD && delta < 0) {
        setScrollVisible(true);
        return;
      }

      applyDirectionalVisibility(delta);
    };

    lastScrollPositionRef.current = window.scrollY || window.pageYOffset || 0;

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const navigationLogoSrc = isLightMode
    ? persistentUI.logoLightSrc || '/logo-black.png'
    : persistentUI.logoDarkSrc || '/logo-white.png';
  const musicToggleAriaLabel = persistentUI.musicToggleAriaLabel || 'Toggle Music';

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
    return section === 'articles' || section === 'contact' || section === 'dashboard';
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();

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

  if (!visibility.persistentUI) return null;

  return (
    <>
      <AdvancedNavbar isLightMode={isLightMode} />
    </>
  );
};
