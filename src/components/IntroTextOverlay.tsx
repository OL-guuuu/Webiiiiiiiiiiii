import React, { useEffect, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getCardClass, getGlassClass, getScaledRem } from './designSystem';

interface IntroTextOverlayProps {
  hasStarted: boolean;
  isScrolling: boolean;
}

export const IntroTextOverlay: React.FC<IntroTextOverlayProps> = ({ hasStarted, isScrolling }) => {
  const { siteConfig } = useSiteConfig();
  const {
    headingScale,
    sectionTitleSizeRem,
    bodyTextSizeRem,
    headingWeight,
    headingLetterSpacingEm,
    bodyLineHeight,
  } = siteConfig.designSystem.theme;
  const { introCardVariant, globalGlassVariant } = siteConfig.designSystem.components;
  const homeMotion = siteConfig.motion.home;
  const motionEnabled = homeMotion.enabled;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (hasStarted) {
      const t = setTimeout(() => setMounted(true), 600);
      return () => clearTimeout(t);
    }
  }, [hasStarted]);

  if (!hasStarted && !mounted) return null;

  // Cinematic transitions for the glass window
  const enter = motionEnabled ? 'opacity-100 scale-100 translate-y-0 blur-none' : 'opacity-100 translate-y-0';
  const exit = motionEnabled
    ? 'opacity-0 scale-[0.98] translate-y-[-10px] blur-[8px] pointer-events-none'
    : 'opacity-0 translate-y-[-6px] pointer-events-none';
  const initial = motionEnabled ? 'opacity-0 scale-[0.95] translate-y-[20px] blur-[12px]' : 'opacity-0';

  const containerState = isScrolling ? exit : mounted ? enter : initial;
  const introScale = Math.min(1.12, Math.max(0.82, headingScale * 0.84));
  const introWeight = Math.min(580, Math.max(360, headingWeight - 110));
  const introLetterSpacing = Math.max(-0.018, headingLetterSpacingEm + 0.004);
  const introLineHeight = Math.max(1.45, bodyLineHeight);
  const transitionDuration = motionEnabled
    ? `${900 + Math.round(homeMotion.intensity * 500)}ms`
    : '320ms';

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center p-4 sm:p-5 md:p-6" data-surface="text">
      
      {/* Glass Floating Window */}
      <div 
        className={`${getCardClass(
          introCardVariant,
          'dark',
        )} ${getGlassClass(
          globalGlassVariant,
          'dark',
        )} w-fit max-w-[92vw] sm:max-w-[40rem] p-4 sm:p-5 md:p-7 mx-auto text-center transition-all ease-[cubic-bezier(0.25,1,0.5,1)] ${containerState}`}
        data-surface="text"
        style={{ transitionDuration }}
      >
        <p 
          className="mx-auto max-w-[33ch] font-sans text-white/92 text-balance"
          style={{
            fontSize: `clamp(${getScaledRem(Math.max(bodyTextSizeRem * 1.28, sectionTitleSizeRem * 0.46), introScale)}, ${(
              2.35 * introScale
            ).toFixed(
              3,
            )}vw, ${getScaledRem(sectionTitleSizeRem * 0.76, introScale)})`,
            fontWeight: introWeight,
            letterSpacing: `${introLetterSpacing}em`,
            lineHeight: introLineHeight,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          {siteConfig.introText}
        </p>
      </div>

    </div>
  );
};
