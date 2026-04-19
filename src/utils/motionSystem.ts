import type { SiteMotionPreset } from '../config/siteConfig';

export const MOTION_PRESET_MULTIPLIERS: Record<SiteMotionPreset, number> = {
  snappy: 0.85,
  balanced: 1,
  cinematic: 1.2,
};

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const getMotionPresetMultiplier = (preset: SiteMotionPreset) => {
  return MOTION_PRESET_MULTIPLIERS[preset] ?? MOTION_PRESET_MULTIPLIERS.balanced;
};

export const getMotionDurationScale = (
  intensity: number,
  preset: SiteMotionPreset,
  minIntensity = 0.6,
  maxIntensity = 1.7,
) => {
  return clamp(intensity, minIntensity, maxIntensity) * getMotionPresetMultiplier(preset);
};
