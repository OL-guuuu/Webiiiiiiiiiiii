import React, { useState } from 'react';
import { usePreloadFrames } from '../hooks/usePreloadFrames';
import { LoadingScreen } from '../components/LoadingScreen';
import { MasterSequence } from '../components/MasterSequence';
import { GlobalFrameOverlay } from '../components/GlobalFrameOverlay';
import { IntroTextOverlay } from '../components/IntroTextOverlay';
import { PersistentUI } from '../components/PersistentUI';
import CursorAnimationLayer from '../components/CursorAnimationLayer';
import { useSiteConfig } from '../context/SiteConfigContext';

import { Scene05Overlay } from '../components/Scene05Overlay';
import { FeaturedWork } from '../components/FeaturedWork';

const SCENE_02 = 'scene-02-desk-focus';
const SCENE_03 = 'scene-03-screen-entry';
const SCENE_07 = 'scene-07';
const SCENES = [SCENE_02, SCENE_03, SCENE_07];

const ABOUT_UI_START = 0.42;
const ABOUT_UI_END = 0.74;
const FINAL_FADE_IN_START = 0.972;
const PORTFOLIO_ACTIVATE_THRESHOLD = 0.992;
const PORTFOLIO_RELEASE_THRESHOLD = 0.976;
const PENDING_NAV_SECTION_KEY = 'portfolio.pending-nav-section.v1';

let hasHomeBootCompleted = false;

export const Home: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { visibility, globalFrame } = siteConfig;
  const { progress, images, isComplete } = usePreloadFrames(SCENES);
  
  const [hasStarted, setHasStarted] = useState(() => hasHomeBootCompleted);
  const [finalFadeOpacity, setFinalFadeOpacity] = useState(0);
  const [isPortfolioActive, setIsPortfolioActive] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scene05Progress, setScene05Progress] = useState(0);

  const handleFadeComplete = () => {
    hasHomeBootCompleted = true;
    setHasStarted(true);
  };

  React.useEffect(() => {
    if (!hasStarted || typeof window === 'undefined') return;

    const pendingSection = window.sessionStorage.getItem(PENDING_NAV_SECTION_KEY);
    if (!pendingSection) return;

    window.sessionStorage.removeItem(PENDING_NAV_SECTION_KEY);

    if (pendingSection === 'home') return;

    const dispatchNavigation = () => {
      window.dispatchEvent(new CustomEvent('nav-to-section', { detail: { section: pendingSection } }));
    };

    const t1 = window.setTimeout(dispatchNavigation, 60);
    const t2 = window.setTimeout(dispatchNavigation, 220);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hasStarted]);

  return (
    <div className="bg-[#111113] min-h-screen text-white selection:bg-white/20" data-surface="base">
      {visibility.globalFrameOverlay ? (
        <GlobalFrameOverlay innerShadowIntensity={hasStarted ? 0.3 : 0} frameConfig={globalFrame} />
      ) : null}
      {!hasStarted ? (
        <LoadingScreen 
          progress={progress} 
          isComplete={isComplete} 
          onFadeComplete={handleFadeComplete} 
        />
      ) : null}

      {hasStarted && <PersistentUI isLightMode={scene05Progress > 0.02 || isPortfolioActive} />}
      {hasStarted && visibility.cursorAnimation ? (
        <CursorAnimationLayer animation={siteConfig.animation} />
      ) : null}

      {visibility.introOverlay ? <IntroTextOverlay hasStarted={hasStarted} isScrolling={isScrolling} /> : null}

      {hasStarted && (
        <main className="relative w-full bg-black" data-surface="ambient">
          
          <MasterSequence 
            scene02Images={images[SCENE_02] || []}
            scene03Images={images[SCENE_03] || []}
            scene07Images={images[SCENE_07] || []}
            isInputLocked={isPortfolioActive}
            onGlobalProgress={(p) => {
              const scrolled = p > 0.005;
              setIsScrolling(prev => prev !== scrolled ? scrolled : prev);

              // Keep About overlay tied to the merged opening scene handoff.
              if (p >= ABOUT_UI_START && p <= ABOUT_UI_END) {
                const s5p = Math.min(1, (p - ABOUT_UI_START) / (ABOUT_UI_END - ABOUT_UI_START));
                setScene05Progress(s5p);
              } else {
                setScene05Progress(0);
              }

              if (p >= FINAL_FADE_IN_START) {
                const fade = (p - FINAL_FADE_IN_START) / (1.0 - FINAL_FADE_IN_START);
                setFinalFadeOpacity(Math.min(1, fade));
              } else {
                setFinalFadeOpacity(0);
              }

              setIsPortfolioActive((prev) =>
                prev ? p >= PORTFOLIO_RELEASE_THRESHOLD : p >= PORTFOLIO_ACTIVATE_THRESHOLD,
              );
            }}
          />

          <div 
            className="fixed inset-0 z-[100] bg-black pointer-events-none"
            data-surface="ambient"
            style={{ opacity: Math.max(0, finalFadeOpacity), transition: 'opacity 0.1s linear' }}
          />

          {visibility.scene05Overlay ? <Scene05Overlay progress={scene05Progress} /> : null}
          
          {visibility.featuredWork ? <FeaturedWork isActive={isPortfolioActive} /> : null}
        </main>
      )}
    </div>
  );
};

export default Home;
