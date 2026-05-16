import { useSiteConfig } from '../context/SiteConfigContext';

export const useLanguage = () => {
  const { siteConfig, setSiteConfig } = useSiteConfig();
  const isAr = siteConfig.language === 'ar';

  const t = (enText: string, arText: string): string => {
    return isAr ? arText : enText;
  };

  const toggleLanguage = () => {
    setSiteConfig((prev) => ({
      ...prev,
      language: prev.language === 'ar' ? 'en' : 'ar',
    }));
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    setSiteConfig((prev) => ({ ...prev, language: lang }));
  };

  return { isAr, language: siteConfig.language, t, toggleLanguage, setLanguage };
};
