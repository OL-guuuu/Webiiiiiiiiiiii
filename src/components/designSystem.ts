import { type SiteButtonVariant, type SiteCardVariant, type SiteGlassVariant } from '../config/siteConfig';

export type SurfaceTone = 'light' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const joinClasses = (...parts: Array<string | false | null | undefined>) => {
  return parts.filter(Boolean).join(' ');
};

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[0.875rem] leading-none',
  md: 'h-11 px-5 text-[0.9375rem] leading-none',
  lg: 'h-12 px-6 text-[1rem] leading-none',
  icon: 'h-11 w-11 p-0 text-[1rem] leading-none',
};

const BUTTON_TONE_CLASSES: Record<SiteButtonVariant, Record<SurfaceTone, string>> = {
  'button-1': {
    dark: 'ds-btn-v1-dark',
    light: 'ds-btn-v1-light',
  },
  'button-2': {
    dark: 'ds-btn-v2-dark',
    light: 'ds-btn-v2-light',
  },
  'button-3': {
    dark: 'ds-btn-v3-dark',
    light: 'ds-btn-v3-light',
  },
};

const CARD_TONE_CLASSES: Record<SiteCardVariant, Record<SurfaceTone, string>> = {
  'card-1': {
    dark: 'ds-card-v1-dark',
    light: 'ds-card-v1-light',
  },
  'card-2': {
    dark: 'ds-card-v2-dark',
    light: 'ds-card-v2-light',
  },
  'card-3': {
    dark: 'ds-card-v3-dark',
    light: 'ds-card-v3-light',
  },
};

const GLASS_TONE_CLASSES: Record<SiteGlassVariant, Record<SurfaceTone, string>> = {
  'glass-1': {
    dark: 'ds-glass-v1-dark',
    light: 'ds-glass-v1-light',
  },
  'glass-2': {
    dark: 'ds-glass-v2-dark',
    light: 'ds-glass-v2-light',
  },
  'glass-3': {
    dark: 'ds-glass-v3-dark',
    light: 'ds-glass-v3-light',
  },
};

export const getButtonClass = (
  variant: SiteButtonVariant,
  tone: SurfaceTone = 'dark',
  size: ButtonSize = 'md',
  extra = '',
) => {
  return joinClasses('ds-btn', BUTTON_SIZE_CLASSES[size], BUTTON_TONE_CLASSES[variant][tone], extra);
};

export const getCardClass = (variant: SiteCardVariant, tone: SurfaceTone = 'dark', extra = '') => {
  return joinClasses('ds-card', CARD_TONE_CLASSES[variant][tone], extra);
};

export const getGlassClass = (variant: SiteGlassVariant, tone: SurfaceTone = 'dark', extra = '') => {
  return joinClasses('ds-glass', GLASS_TONE_CLASSES[variant][tone], extra);
};

export const getScaledRem = (baseRem: number, scale: number) => {
  const safeScale = Number.isFinite(scale) ? Math.min(1.8, Math.max(0.7, scale)) : 1;
  return `${(baseRem * safeScale).toFixed(3)}rem`;
};
