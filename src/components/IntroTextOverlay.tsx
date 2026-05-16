import React, { useEffect, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getScaledRem } from './designSystem';

interface IntroTextOverlayProps {
  hasStarted: boolean;
  isScrolling: boolean;
}

export const IntroTextOverlay: React.FC<IntroTextOverlayProps> = ({ hasStarted, isScrolling }) => {
  const { siteConfig } = useSiteConfig();
  const {
    headingScale,
    displayTitleSizeRem,
    sectionTitleSizeRem,
    bodyTextSizeRem,
    headingWeight,
    headingLetterSpacingEm,
    bodyLineHeight,
  } = siteConfig.designSystem.theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (hasStarted) {
      const t = setTimeout(() => setMounted(true), 600);
      return () => clearTimeout(t);
    }
  }, [hasStarted]);

  if (!hasStarted && !mounted) return null;

  // Cinematic transitions for the glass window
  const enter = 'opacity-100 scale-100 translate-y-0 blur-none';
  const exit = 'opacity-0 scale-[0.98] translate-y-[-10px] blur-[8px] pointer-events-none';
  const initial = 'opacity-0 scale-[0.95] translate-y-[20px] blur-[12px]';

  const containerState = isScrolling ? exit : mounted ? enter : initial;
  const primaryText = siteConfig.introText.trim();
  const scrollPrompt = siteConfig.introScrollPrompt.trim();
  const backdropColor = siteConfig.introOverlayBackdropColor;
  const backdropOpacity = mounted && !isScrolling ? siteConfig.introOverlayBackdropOpacity : 0;
  const headlineBoost = 1.4;
  const headlineScale = Math.min(1.8, Math.max(1.05, headingScale * headlineBoost));
  const headlineWeight = Math.min(720, Math.max(420, headingWeight + 60));
  const headlineLetterSpacing = Math.max(-0.06, headingLetterSpacingEm - 0.015);
  const headlineLineHeight = Math.max(1.1, bodyLineHeight - 0.35);
  const promptScale = Math.min(1.05, Math.max(0.8, headingScale * 0.9));
  const promptLetterSpacing = Math.max(0.08, headingLetterSpacingEm + 0.18);
  const promptFontSize = `clamp(${getScaledRem(
    Math.max(bodyTextSizeRem * 0.95, sectionTitleSizeRem * 0.38),
    promptScale,
  )}, ${(1.3 * promptScale).toFixed(3)}vw, ${getScaledRem(
    sectionTitleSizeRem * 0.42,
    promptScale,
  )})`;
  const headlineFontSize = `clamp(${getScaledRem(
    Math.max(sectionTitleSizeRem * 0.72, bodyTextSizeRem * 1.2),
    headlineScale,
  )}, ${(3.5 * headlineScale).toFixed(3)}vw, ${getScaledRem(
    displayTitleSizeRem * 0.78,
    headlineScale,
  )})`;
  const backdropFill = backdropColor;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center p-4 sm:p-5 md:p-6"
      data-surface="text"
    >
      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          opacity: backdropOpacity,
          backgroundColor: backdropFill,
        }}
      />
      <div
        className={`relative z-10 flex flex-col items-center gap-3 text-center sm:gap-4 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${containerState}`}
        data-surface="text"
      >
        {primaryText ? (
          <h1
            className="intro-glow-text max-w-[92vw] text-balance font-sans text-white/95 sm:max-w-[28ch]"
            style={{
              fontSize: headlineFontSize,
              fontWeight: headlineWeight,
              letterSpacing: `${headlineLetterSpacing}em`,
              lineHeight: headlineLineHeight,
            }}
          >
            {primaryText}
          </h1>
        ) : null}
        {scrollPrompt ? (
          <p
            className="intro-glow-text intro-scroll-prompt font-sans text-white/80"
            style={{
              fontSize: promptFontSize,
              fontWeight: Math.min(620, Math.max(480, headingWeight)),
              letterSpacing: `${promptLetterSpacing}em`,
              lineHeight: 1.4,
            }}
          >
            {scrollPrompt}
          </p>
        ) : null}
      </div>
    </div>
  );
};
