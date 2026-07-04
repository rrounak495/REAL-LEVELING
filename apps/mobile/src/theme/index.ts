/**
 * theme/index.ts — Real Leveling Design System
 *
 * Single barrel export for the entire theme.
 * Import everything from '@theme' — never from individual theme files.
 *
 * Usage:
 *   import { colors, spacing, typeScale, radius, motionDuration } from '@theme';
 */

export { colors } from './colors';
export type { ColorTokens, BgColorToken, PurpleToken, StatColorToken, TextToken } from './colors';

export { fontFamily, typeScale } from './typography';
export type { TypeScaleKey, FontFamilyKey } from './typography';

export { spacing } from './spacing';
export type { SpacingToken } from './spacing';

export { elevation, glow, textGlow } from './shadows';
export type { GlowColor, GlowTier } from './shadows';

export { radius } from './radius';
export type { RadiusToken, RadiusKey } from './radius';

export {
  motionDuration,
  motionEasing,
  springConfigs,
  getStaggerDelay,
  STAGGER_DELAY_MS,
  MAX_STAGGER_MS,
} from './motion';
export type { MotionDurationKey, SpringConfigKey } from './motion';

export { gradients } from './gradients';
export type { GradientConfig, GradientKey } from './gradients';
