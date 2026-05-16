import React, { useEffect, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface SimpleVerticalNavProps {
  isLightMode?: boolean;
}

export const SimpleVerticalNav: React.FC<SimpleVerticalNavProps> = ({ isLightMode = false }) => {
  const { siteConfig } = useSiteConfig();
  const { visibility } = siteConfig;

  const [activeSection, setActiveSection] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
  ];

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
    const handleNavActiveSection = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section) {
        setActiveSection(customEvent.detail.section);
      }
    };

    detectSection();
    window.addEventListener('hashchange', detectSection);
    window.addEventListener('popstate', detectSection);
    window.addEventListener('nav-active-section', handleNavActiveSection);

    return () => {
      window.removeEventListener('hashchange', detectSection);
      window.removeEventListener('popstate', detectSection);
      window.removeEventListener('nav-active-section', handleNavActiveSection);
    };
  }, []);

  const handleNav = (section: string) => {
    setActiveSection(section);
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section } }));
  };

  if (!visibility.persistentUI) return null;

  return (
    <>
      <style>
        {`
          @keyframes nav-dot-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
          }

          @keyframes nav-dot-glow {
            0%, 100% { 
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.3),
                          0 0 16px rgba(255, 255, 255, 0.2);
            }
            50% { 
              box-shadow: 0 0 12px rgba(255, 255, 255, 0.5),
                          0 0 24px rgba(255, 255, 255, 0.3);
            }
          }

          .simple-nav-dot {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .simple-nav-dot:hover {
            transform: scale(1.2);
          }

          .simple-nav-dot.active {
            animation: nav-dot-pulse 0.4s ease-out;
          }

          .simple-nav-dot.active::after {
            animation: nav-dot-glow 2s ease-in-out infinite;
          }

          .simple-nav-container {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .simple-nav-container:hover {
            transform: translateY(-50%) translateX(-4px);
          }

          .simple-nav-tooltip {
            opacity: 0;
            transform: translateX(8px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
          }

          .simple-nav-dot:hover .simple-nav-tooltip {
            opacity: 1;
            transform: translateX(0);
          }

          @media (max-width: 768px) {
            .simple-nav-container {
              display: none;
            }
          }
        `}
      </style>

      {/* Simple Vertical Navigation - Small dots in the middle */}
      <div
        className={`simple-nav-container fixed right-8 top-1/2 -translate-y-1/2 z-[240] ${
          isLightMode
            ? 'bg-black/10 border-black/20'
            : 'bg-white/10 border-white/20'
        } backdrop-blur-xl rounded-full border shadow-2xl py-3 px-2`}
      >
        <div className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`simple-nav-dot relative w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? isLightMode
                      ? 'bg-black/80'
                      : 'bg-white/80'
                    : isLightMode
                      ? 'bg-black/40 hover:bg-black/60'
                      : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={item.label}
              >
                {/* Tooltip */}
                <span
                  className={`simple-nav-tooltip absolute right-full mr-3 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                    isLightMode
                      ? 'bg-black/90 text-white'
                      : 'bg-white/90 text-black'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};