import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SITE_CONFIG,
  hydrateSiteConfig,
  SITE_CONFIG_STORAGE_KEY,
  type SiteConfig,
} from '../config/siteConfig';

interface SiteConfigContextValue {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  resetSiteConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

const getInitialSiteConfig = (): SiteConfig => {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;

  const raw = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
  if (!raw) return DEFAULT_SITE_CONFIG;

  try {
    const parsed = JSON.parse(raw);
    return hydrateSiteConfig(parsed);
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
};

const applyDesignSystemVariables = (siteConfig: SiteConfig) => {
  if (typeof document === 'undefined') return;

  const theme = siteConfig.designSystem.theme;
  const componentStyles = siteConfig.designSystem.componentStyles;
  const root = document.documentElement;
  const defaultTheme = DEFAULT_SITE_CONFIG.designSystem.theme;
  const normalizeCssLiteral = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
  const useTokenForLegacyLiteral = (value: string, legacyLiteral: string, tokenReference: string) => {
    return normalizeCssLiteral(value) === normalizeCssLiteral(legacyLiteral) ? tokenReference : value;
  };
  const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  root.style.setProperty('--ds-color-primary', theme.primaryColor);
  root.style.setProperty('--ds-color-secondary', theme.secondaryColor);
  root.style.setProperty('--ds-color-on-primary', theme.onPrimaryColor);
  root.style.setProperty('--ds-color-on-secondary', theme.onSecondaryColor);
  root.style.setProperty('--ds-heading-scale', String(theme.headingScale));
  root.style.setProperty('--ds-display-size-rem', `${theme.displayTitleSizeRem}rem`);
  root.style.setProperty('--ds-section-size-rem', `${theme.sectionTitleSizeRem}rem`);
  root.style.setProperty('--ds-body-size-rem', `${theme.bodyTextSizeRem}rem`);
  root.style.setProperty('--ds-heading-weight', String(theme.headingWeight));
  root.style.setProperty('--ds-heading-letter-spacing-em', `${theme.headingLetterSpacingEm}em`);
  root.style.setProperty('--ds-body-line-height', String(theme.bodyLineHeight));
  root.style.setProperty('--ds-spacing-scale', String(theme.spacingScale));
  root.style.setProperty('--ds-radius-scale', String(theme.radiusScale));
  root.style.setProperty('--ds-button-radius', `${theme.buttonRadius}px`);
  root.style.setProperty('--ds-button-border-width', `${theme.buttonBorderWidth}px`);
  root.style.setProperty('--ds-button-shadow-opacity', String(theme.buttonShadowOpacity));
  root.style.setProperty('--ds-card-radius', `${theme.cardRadius}px`);
  root.style.setProperty('--ds-card-border-width', `${theme.cardBorderWidth}px`);
  root.style.setProperty('--ds-card-blur-px', `${theme.cardBlurPx}px`);
  root.style.setProperty('--ds-card-shadow-opacity', String(theme.cardShadowOpacity));
  root.style.setProperty('--ds-glass-tint', theme.glassTintColor);
  root.style.setProperty('--ds-glass-border', theme.glassBorderColor);
  root.style.setProperty('--ds-space-1', `${4 * theme.spacingScale}px`);
  root.style.setProperty('--ds-space-2', `${8 * theme.spacingScale}px`);
  root.style.setProperty('--ds-space-3', `${12 * theme.spacingScale}px`);
  root.style.setProperty('--ds-space-4', `${16 * theme.spacingScale}px`);
  root.style.setProperty('--ds-space-5', `${20 * theme.spacingScale}px`);
  root.style.setProperty('--ds-space-6', `${24 * theme.spacingScale}px`);
  root.style.setProperty('--ds-radius-sm', `${8 * theme.radiusScale}px`);
  root.style.setProperty('--ds-radius-md', `${12 * theme.radiusScale}px`);
  root.style.setProperty('--ds-radius-lg', `${18 * theme.radiusScale}px`);
  root.style.setProperty('--ds-radius-pill', `${999 * theme.radiusScale}px`);

  const motion = siteConfig.animation.system;
  root.style.setProperty('--ds-motion-intensity', String(motion.intensity));
  root.style.setProperty('--ds-motion-duration-ms', `${motion.durationMs}ms`);
  root.style.setProperty('--ds-motion-easing', motion.easing);

  const buttonVariants = ['button-1', 'button-2', 'button-3'] as const;
  for (const variant of buttonVariants) {
    const preset = componentStyles.buttons[variant];
    const token = variant.replace('-', '');
    const resolvedRadius = clampNumber(
      theme.buttonRadius + (preset.radiusPx - defaultTheme.buttonRadius),
      2,
      999,
    );
    const resolvedBorderWidth = clampNumber(
      theme.buttonBorderWidth + (preset.borderWidthPx - defaultTheme.buttonBorderWidth),
      0.5,
      6,
    );
    const darkBackground =
      variant === 'button-1'
        ? useTokenForLegacyLiteral(preset.darkBackground, '#111217', 'var(--ds-color-primary)')
        : preset.darkBackground;
    const darkText =
      variant === 'button-1'
        ? useTokenForLegacyLiteral(preset.darkText, '#ffffff', 'var(--ds-color-on-primary)')
        : preset.darkText;
    const lightBackground =
      variant === 'button-1'
        ? useTokenForLegacyLiteral(preset.lightBackground, '#111217', 'var(--ds-color-primary)')
        : preset.lightBackground;
    const lightText =
      variant === 'button-1'
        ? useTokenForLegacyLiteral(preset.lightText, '#ffffff', 'var(--ds-color-on-primary)')
        : preset.lightText;

    root.style.setProperty(`--ds-${token}-radius`, `${resolvedRadius}px`);
    root.style.setProperty(`--ds-${token}-border-width`, `${resolvedBorderWidth}px`);
    root.style.setProperty(`--ds-${token}-dark-bg`, darkBackground);
    root.style.setProperty(`--ds-${token}-dark-border`, preset.darkBorder);
    root.style.setProperty(`--ds-${token}-dark-text`, darkText);
    root.style.setProperty(`--ds-${token}-dark-hover-bg`, preset.darkHoverBackground);
    root.style.setProperty(`--ds-${token}-light-bg`, lightBackground);
    root.style.setProperty(`--ds-${token}-light-border`, preset.lightBorder);
    root.style.setProperty(`--ds-${token}-light-text`, lightText);
    root.style.setProperty(`--ds-${token}-light-hover-bg`, preset.lightHoverBackground);
  }

  const cardVariants = ['card-1', 'card-2', 'card-3'] as const;
  for (const variant of cardVariants) {
    const preset = componentStyles.cards[variant];
    const token = variant.replace('-', '');
    const resolvedRadius = clampNumber(
      theme.cardRadius + (preset.radiusPx - defaultTheme.cardRadius),
      4,
      80,
    );
    const resolvedBorderWidth = clampNumber(
      theme.cardBorderWidth + (preset.borderWidthPx - defaultTheme.cardBorderWidth),
      0.5,
      6,
    );
    const resolvedDarkShadowOpacity = clampNumber(
      theme.cardShadowOpacity + (preset.darkShadowOpacity - defaultTheme.cardShadowOpacity),
      0,
      0.95,
    );
    const resolvedLightShadowOpacity = clampNumber(
      theme.cardShadowOpacity + (preset.lightShadowOpacity - defaultTheme.cardShadowOpacity),
      0,
      0.95,
    );

    root.style.setProperty(`--ds-${token}-radius`, `${resolvedRadius}px`);
    root.style.setProperty(`--ds-${token}-border-width`, `${resolvedBorderWidth}px`);
    root.style.setProperty(`--ds-${token}-dark-bg`, preset.darkBackground);
    root.style.setProperty(`--ds-${token}-light-bg`, preset.lightBackground);
    root.style.setProperty(`--ds-${token}-dark-border`, preset.darkBorder);
    root.style.setProperty(`--ds-${token}-light-border`, preset.lightBorder);
    root.style.setProperty(`--ds-${token}-dark-shadow-opacity`, String(resolvedDarkShadowOpacity));
    root.style.setProperty(`--ds-${token}-light-shadow-opacity`, String(resolvedLightShadowOpacity));
  }
};

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getInitialSiteConfig());

  useEffect(() => {
    applyDesignSystemVariables(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SITE_CONFIG_STORAGE_KEY) return;

      if (!event.newValue) {
        setSiteConfig(DEFAULT_SITE_CONFIG);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        setSiteConfig(hydrateSiteConfig(parsed));
      } catch {
        setSiteConfig(DEFAULT_SITE_CONFIG);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(siteConfig));
    } catch (error) {
      // Uploaded media can exceed browser storage quota; keep runtime state without crashing.
      console.warn('Unable to persist site config to localStorage.', error);
    }
  }, [siteConfig]);

  const value = useMemo<SiteConfigContextValue>(() => {
    return {
      siteConfig,
      setSiteConfig,
      resetSiteConfig: () => {
        setSiteConfig(DEFAULT_SITE_CONFIG);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
        }
      },
    };
  }, [siteConfig]);

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider');
  }
  return context;
};
