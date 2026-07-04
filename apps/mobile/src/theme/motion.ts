/**
 * theme/motion.ts — Real Leveling Design System
 *
 * Animation duration tokens and easing curves.
 * All Reanimated spring configs are defined here as well.
 *
 * Rules:
 * - Duration must match the EMOTIONAL WEIGHT of the event.
 * - Use spring configs for physical interactions.
 * - Use cubic-bezier curves for layout/screen transitions.
 * - Respect AccessibilityInfo.isReduceMotionEnabled.
 *
 * Usage with Reanimated:
 *   import { motionDuration, springConfigs } from '@theme';
 *   withTiming(1, { duration: motionDuration.slow, easing: Easing.bezier(...) })
 *   withSpring(1, springConfigs.snappy)
 */
import { Easing } from 'react-native-reanimated';

// ── Duration Tokens ───────────────────────────────────────────────────────
export const motionDuration = {
  /** 0ms — State changes with no visible animation */
  instant: 0,
  /** 100ms — Micro-feedback: button press, toggle */
  flash: 100,
  /** 200ms — UI response: tab switch, list item press */
  quick: 200,
  /** 300ms — DEFAULT: card expand, menu open, screen transition */
  normal: 300,
  /** 500ms — Emphasis: XP bar fill, modal entrance */
  slow: 500,
  /** 800ms — Significant: badge unlock, streak milestone */
  dramatic: 800,
  /** 1200ms — Ceremonies ONLY: level-up, first quest complete */
  cinematic: 1200,
} as const;

// ── Easing Curves ─────────────────────────────────────────────────────────
// Custom cubic-bezier curves — never use default "ease" or "linear".
export const motionEasing = {
  /**
   * Standard — Default for all transitions.
   * Decelerates into the target — feels intentional.
   */
  standard: Easing.bezier(0.4, 0.0, 0.2, 1.0),

  /**
   * Decelerate — Elements entering the screen.
   * Rushes in, settles softly.
   */
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),

  /**
   * Accelerate — Elements leaving the screen.
   * Starts slow, exits fast — dismissed with authority.
   */
  accelerate: Easing.bezier(0.4, 0.0, 1.0, 1.0),

  /**
   * Snappy — Overshoots then settles. For number increments,
   * stat counters — creates a satisfying "tick" feel.
   */
  snappy: Easing.bezier(0.34, 1.56, 0.64, 1.0),
} as const;

// ── Spring Configs (for withSpring) ──────────────────────────────────────
export const springConfigs = {
  /**
   * Default spring — Physical interactions.
   * Card press, avatar bounce, XP bar fill.
   */
  default: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
  },

  /**
   * Elastic spring — Reward moments.
   * Badge pop, level number bounce, achievement unlock.
   * Deliberately overshoots for excitement.
   */
  elastic: {
    damping: 10,
    stiffness: 150,
    mass: 1.0,
    overshootClamping: false,
  },

  /**
   * Stiff spring — Fast, tight snaps.
   * Tab switches, drawer open/close.
   */
  stiff: {
    damping: 25,
    stiffness: 350,
    mass: 0.6,
    overshootClamping: true,
  },
} as const;

// ── List Stagger ──────────────────────────────────────────────────────────
/** Per-item delay for staggered list entrance animations. Max 200ms total. */
export const STAGGER_DELAY_MS = 40;
/** Maximum total stagger delay regardless of list length. */
export const MAX_STAGGER_MS = 200;

/**
 * Returns the stagger delay for a list item at a given index.
 * Caps at MAX_STAGGER_MS to prevent long waits on large lists.
 */
export function getStaggerDelay(index: number): number {
  return Math.min(index * STAGGER_DELAY_MS, MAX_STAGGER_MS);
}

export type MotionDurationKey = keyof typeof motionDuration;
export type SpringConfigKey = keyof typeof springConfigs;
