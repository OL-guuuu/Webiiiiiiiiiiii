  import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
  import {
    DEFAULT_SITE_CONFIG,
    hydrateSiteConfig,
    type SiteConfig,
    type SitePartner,
    type SitePersonalProject,
    type SiteSocialAccount,
    type SiteSocialPost,
    type SiteFinancialTransaction,
    type SiteInvestment,
    type SiteInvoice,
    type SiteEmail,
    type SiteNote,
    type SiteAITracking,
    type SiteAIReport,
  } from '../config/siteConfig';
  import {
    loadSiteConfig,
    saveSiteConfig,
    resetAllStorage,
    getStorageInfo,
    exportStorageData,
    importStorageData,
    getVersionHistory,
    restoreVersionSnapshot,
  } from '../utils/storageSystem';
  import { fetchSiteConfig, updateSiteConfig, checkApiHealth } from '../utils/apiClient';

  interface SiteConfigContextValue {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  resetSiteConfig: () => void;
  storageInfo: ReturnType<typeof getStorageInfo>;
  versionHistory: ReturnType<typeof getVersionHistory>;
  exportStorage: () => string | null;
  importStorage: (data: string) => boolean;
  restoreVersion: (snapshotId: string) => boolean;
  saveToAPI: () => Promise<{ success: boolean; error?: string }>;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

  const getInitialSiteConfig = (): SiteConfig => {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;

    // Use advanced storage system
    const result = loadSiteConfig();

    if (result.success && result.data) {
      // Hydrate the loaded config to ensure all properties are valid
      return hydrateSiteConfig(result.data);
    }

    return DEFAULT_SITE_CONFIG;
  };


const applyDesignSystemVariables = (siteConfig: SiteConfig) => {
  if (typeof document === 'undefined') return;

  const theme = siteConfig.designSystem.theme;
  const componentStyles = siteConfig.designSystem.componentStyles;
  const foundation = siteConfig.designSystem.foundation;
  const motion = siteConfig.animation.motion;
  const root = document.documentElement;
  const defaultTheme = DEFAULT_SITE_CONFIG.designSystem.theme;
  const defaultMotion = DEFAULT_SITE_CONFIG.animation.motion;
  const normalizeCssLiteral = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
  const useTokenForLegacyLiteral = (value: string, legacyLiteral: string, tokenReference: string) => {
    return normalizeCssLiteral(value) === normalizeCssLiteral(legacyLiteral) ? tokenReference : value;
  };
  const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const resolveRgbChannels = (value: string, fallback: string) => {
    if (!value?.trim()) return fallback;
    if (!document.body) return fallback;
    const probe = document.createElement('span');
    probe.style.color = value;
    probe.style.position = 'absolute';
    probe.style.left = '-9999px';
    probe.style.top = '-9999px';
    document.body.appendChild(probe);
    const computed = window.getComputedStyle(probe).color;
    probe.remove();
    const match = computed.match(/^rgba?\(([^)]+)\)$/i);
    if (!match?.[1]) return fallback;
    const [r, g, b] = match[1]
      .split(',')
      .slice(0, 3)
      .map((part) => Math.round(Number.parseFloat(part.trim())));
    if ([r, g, b].some((channel) => !Number.isFinite(channel))) return fallback;
    return `${r}, ${g}, ${b}`;
  };

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
  root.style.setProperty('--ds-button-radius', `${theme.buttonRadius}px`);
  root.style.setProperty('--ds-button-border-width', `${theme.buttonBorderWidth}px`);
  root.style.setProperty('--ds-button-shadow-opacity', String(theme.buttonShadowOpacity));
  root.style.setProperty('--ds-card-radius', `${theme.cardRadius}px`);
  root.style.setProperty('--ds-card-border-width', `${theme.cardBorderWidth}px`);
  root.style.setProperty('--ds-card-blur-px', `${theme.cardBlurPx}px`);
  root.style.setProperty('--ds-card-shadow-opacity', String(theme.cardShadowOpacity));
  root.style.setProperty('--ds-glass-tint', theme.glassTintColor);
  root.style.setProperty('--ds-glass-border', theme.glassBorderColor);
  const glowRgb = resolveRgbChannels(
    theme.glowColor || defaultTheme.glowColor,
    resolveRgbChannels(defaultTheme.glowColor, '255, 220, 170'),
  );
  root.style.setProperty('--ds-glow-rgb', glowRgb);
  root.style.setProperty(
    '--ds-glow-intensity',
    String(clampNumber(theme.glowIntensity, 0, 1.2)),
  );
  const glowState = theme.glowEnabled ? 'on' : 'off';
  if (document.documentElement) {
    document.documentElement.dataset.glow = glowState;
  }
  if (document.body) {
    document.body.dataset.glow = glowState;
  }
  root.style.setProperty('--ds-space-section', `${foundation.spacing.sectionPaddingRem}rem`);
  root.style.setProperty('--ds-space-stack', `${foundation.spacing.stackGapRem}rem`);
  root.style.setProperty('--ds-space-grid', `${foundation.spacing.gridGapRem}rem`);
  root.style.setProperty('--ds-space-card', `${foundation.spacing.cardPaddingRem}rem`);
  root.style.setProperty('--ds-layout-max-width', `${foundation.layout.contentMaxWidthPx}px`);
  root.style.setProperty('--ds-layout-column-gap', `${foundation.layout.columnGapRem}rem`);
  root.style.setProperty('--ds-layout-max-columns', `${foundation.layout.maxGridColumns}`);
  root.style.setProperty('--ds-type-eyebrow-size', `${foundation.typography.eyebrowSizeRem}rem`);
  root.style.setProperty('--ds-type-eyebrow-tracking', `${foundation.typography.eyebrowLetterSpacingEm}em`);
  root.style.setProperty('--ds-type-eyebrow-weight', `${foundation.typography.eyebrowWeight}`);
  root.style.setProperty('--ds-motion-duration-fast', `${motion.durationFastMs}ms`);
  root.style.setProperty('--ds-motion-duration-base', `${motion.durationBaseMs}ms`);
  root.style.setProperty('--ds-motion-duration-slow', `${motion.durationSlowMs}ms`);
  root.style.setProperty('--ds-motion-ease', motion.ease || defaultMotion.ease);
  root.style.setProperty('--ds-motion-stagger', `${motion.staggerMs}ms`);
  root.style.setProperty('--ds-motion-hover-scale', `${motion.hoverScale}`);
  root.style.setProperty('--ds-motion-hover-lift', `${motion.hoverLiftPx}px`);

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

const applyBrowserMetadata = (siteConfig: SiteConfig) => {
  if (typeof document === 'undefined') return;

  const browserConfig = siteConfig.dashboard.browser;
  const fallback = DEFAULT_SITE_CONFIG.dashboard.browser;
  const nextTitle = (browserConfig.browserTabTitle || fallback.browserTabTitle).trim();
  const nextFavicon = (browserConfig.faviconUrl || fallback.faviconUrl).trim();

  if (nextTitle) {
    document.title = nextTitle;
  }

  if (!nextFavicon) return;

  const updateIconLink = (selector: string, relValue: string) => {
    let link = document.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = document.createElement('link');
      link.rel = relValue;
      document.head.appendChild(link);
    }
    link.href = nextFavicon;
  };

  updateIconLink("link[rel='icon']", 'icon');
  updateIconLink("link[rel='shortcut icon']", 'shortcut icon');
};

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getInitialSiteConfig());
  const [storageInfo, setStorageInfo] = useState(() => getStorageInfo());

  useEffect(() => {
    applyDesignSystemVariables(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    applyBrowserMetadata(siteConfig);
  }, [siteConfig]);

  // Save to storage with advanced system
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Debounce saves to avoid excessive writes
    const timeoutId = setTimeout(() => {
      const result = saveSiteConfig(siteConfig);

      if (!result.success) {
        console.error('Failed to save site config:', result.error);
      } else {
        // Update storage info after successful save
        setStorageInfo(getStorageInfo());
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [siteConfig]);

  // Listen for storage events from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      // Only reload if it's a config-related key
      const configKeys = ['portfolio.site-config', 'portfolio.site-config.backup', 'portfolio.site-config.session'];
      if (!configKeys.some(key => event.key?.includes(key))) return;

      // Reload config from storage
      const result = loadSiteConfig();
      if (result.success && result.data) {
        setSiteConfig(hydrateSiteConfig(result.data));
        setStorageInfo(getStorageInfo());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Fetch config from API on mount (for public site)
  useEffect(() => {
    // Only fetch from API if we're not in dashboard mode
    const isDashboard = window.location.pathname.includes('/dashboard');
    if (!isDashboard) {
      (async () => {
        try {
          const response = await fetchSiteConfig();
          if (response.success && response.data) {
            const hydratedConfig = hydrateSiteConfig(response.data);
            setSiteConfig(hydratedConfig);
            console.log('Config loaded from API successfully');
          }
        } catch (error) {
          console.error('Failed to fetch config from API:', error);
        }
      })();
    }
  }, []);

  const value = useMemo<SiteConfigContextValue>(() => {
    let versionHistory: ReturnType<typeof getVersionHistory> = [];
    try {
      versionHistory = getVersionHistory();
    } catch (error) {
      console.error('Failed to get version history:', error);
      versionHistory = [];
    }

    return {
      siteConfig,
      setSiteConfig,
      resetSiteConfig: () => {
        setSiteConfig(DEFAULT_SITE_CONFIG);
        resetAllStorage();
        setStorageInfo(getStorageInfo());
      },
      storageInfo,
      versionHistory,
      exportStorage: () => {
        if (typeof window === 'undefined') return null;
        const data = exportStorageData(siteConfig);
        if (!data) return null;
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `site-customization-package-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return data;
      },
      importStorage: (jsonData: string) => {
        try {
          const success = importStorageData(jsonData);
          if (!success) return false;

          const parsed = JSON.parse(jsonData);
          const nextConfig = parsed?.config ? hydrateSiteConfig(parsed.config) : hydrateSiteConfig(parsed);
          setSiteConfig(nextConfig);
          setStorageInfo(getStorageInfo());
          return true;
        } catch (error) {
          console.error('Failed to import storage data:', error);
          return false;
        }
      },
      restoreVersion: (snapshotId: string) => {
        const restored = restoreVersionSnapshot(snapshotId);
        if (!restored) return false;

        setSiteConfig(restored);
        setStorageInfo(getStorageInfo());
        return true;
      },
      saveToAPI: async () => {
        try {
          const response = await updateSiteConfig(siteConfig);
          if (response.success) {
            const source = response.source || 'unknown';
            const message = response.message || '';
            const isLocalHost =
              typeof window !== 'undefined' &&
              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

            // In production, file-backed saves are not globally reliable for all visitors.
            if (!isLocalHost && source === 'file') {
              return {
                success: false,
                error: 'Saved to local server file only. Configure Upstash/Vercel KV so changes are visible to all visitors.',
              };
            }

            if (response.warning) {
              return {
                success: false,
                error: response.warning,
              };
            }

            console.log('Config saved to API successfully', { source, message });
            return { success: true, message };
          } else {
            console.error('Failed to save config to API:', response.error);
            const availableStorages = response.availableStorages;
            let errorMessage = response.error || 'Failed to save to API';
            
            // Provide helpful error message based on available storage
            if (availableStorages && !availableStorages.vercel_kv && !availableStorages.upstash_redis) {
              errorMessage = 'No persistent storage available. Please configure Upstash Redis or Vercel KV in your environment variables.';
            }
            
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          console.error('Error saving config to API:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },
    };
  }, [siteConfig, storageInfo]);

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider');
  }
  return context;
};

// Helper functions for updating specific sections
export const updatePartners = (
  siteConfig: SiteConfig,
  updater: (partners: SiteConfig['partners']) => SiteConfig['partners']
): SiteConfig => {
  return {
    ...siteConfig,
    partners: updater(siteConfig.partners),
  };
};

export const updatePersonalProjects = (
  siteConfig: SiteConfig,
  updater: (projects: SiteConfig['personalProjects']) => SiteConfig['personalProjects']
): SiteConfig => {
  return {
    ...siteConfig,
    personalProjects: updater(siteConfig.personalProjects),
  };
};

export const updateSocialAccounts = (
  siteConfig: SiteConfig,
  updater: (accounts: SiteConfig['socialAccounts']) => SiteConfig['socialAccounts']
): SiteConfig => {
  return {
    ...siteConfig,
    socialAccounts: updater(siteConfig.socialAccounts),
  };
};

export const updateSocialPosts = (
  siteConfig: SiteConfig,
  updater: (posts: SiteConfig['socialPosts']) => SiteConfig['socialPosts']
): SiteConfig => {
  return {
    ...siteConfig,
    socialPosts: updater(siteConfig.socialPosts),
  };
};

export const updateFinancialTransactions = (
  siteConfig: SiteConfig,
  updater: (transactions: SiteConfig['financialTransactions']) => SiteConfig['financialTransactions']
): SiteConfig => {
  return {
    ...siteConfig,
    financialTransactions: updater(siteConfig.financialTransactions),
  };
};

export const updateInvestments = (
  siteConfig: SiteConfig,
  updater: (investments: SiteConfig['investments']) => SiteConfig['investments']
): SiteConfig => {
  return {
    ...siteConfig,
    investments: updater(siteConfig.investments),
  };
};

export const updateInvoices = (
  siteConfig: SiteConfig,
  updater: (invoices: SiteConfig['invoices']) => SiteConfig['invoices']
): SiteConfig => {
  return {
    ...siteConfig,
    invoices: updater(siteConfig.invoices),
  };
};

export const updateEmails = (
  siteConfig: SiteConfig,
  updater: (emails: SiteConfig['emails']) => SiteConfig['emails']
): SiteConfig => {
  return {
    ...siteConfig,
    emails: updater(siteConfig.emails),
  };
};

export const updateNotes = (
  siteConfig: SiteConfig,
  updater: (notes: SiteConfig['notes']) => SiteConfig['notes']
): SiteConfig => {
  return {
    ...siteConfig,
    notes: updater(siteConfig.notes),
  };
};

export const updateAITracking = (
  siteConfig: SiteConfig,
  updater: (tracking: SiteConfig['aiTracking']) => SiteConfig['aiTracking']
): SiteConfig => {
  return {
    ...siteConfig,
    aiTracking: updater(siteConfig.aiTracking),
  };
};

export const updateAIReports = (
  siteConfig: SiteConfig,
  updater: (reports: SiteConfig['aiReports']) => SiteConfig['aiReports']
): SiteConfig => {
  return {
    ...siteConfig,
    aiReports: updater(siteConfig.aiReports),
  };
};
