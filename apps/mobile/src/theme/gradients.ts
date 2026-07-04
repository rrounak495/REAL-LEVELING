/**
 * theme/gradients.ts — Real Leveling Design System
 *
 * Named gradient definitions.
 * Each gradient has an emotional purpose — use by name, not by value.
 *
 * These are defined as LinearGradient-compatible arrays (colors + locations)
 * for use with expo-linear-gradient when needed.
 *
 * For NativeWind, the equivalent Tailwind classes are defined in tailwind.config.js.
 */

export type GradientConfig = {
  colors: readonly string[];
  locations?: readonly number[];
  /** Angle in degrees (0 = bottom-to-top, 90 = left-to-right) */
  angle?: number;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export const gradients = {
  /**
   * Primary background — applied to every screen.
   * Deep purple-black void with subtle depth.
   */
  voidAurora: {
    colors: ['#03030A', '#0E0818', '#100D22', '#0A0A1A'],
    locations: [0, 0.4, 0.75, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /**
   * Primary hero gradient — buttons, XP bar, active states.
   * The signature brand gradient.
   */
  neonSurge: {
    colors: ['#6B2FCC', '#4A1A9E', '#2448CC'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /**
   * Secondary accent — progress bars, skill tree paths.
   * Purple → Blue → Cyan sweep.
   */
  cyberHorizon: {
    colors: ['#8B3CF7', '#3B5BF6', '#00B4FF'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },

  /**
   * XP bar fill — the most-seen gradient in the app.
   */
  xpBar: {
    colors: ['#8B3CF7', '#3B5BF6', '#00B4FF'],
    locations: [0, 0.6, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },

  /**
   * Level-up ceremony — radiates from top of screen.
   */
  levelUp: {
    colors: ['rgba(200, 0, 255, 0.6)', 'rgba(139, 60, 247, 0.4)', 'rgba(3, 3, 10, 0)'],
    locations: [0, 0.4, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },

  /**
   * Glassmorphism card surface — always overlaid on voidAurora.
   */
  phantomGlass: {
    colors: ['rgba(139, 60, 247, 0.08)', 'rgba(59, 91, 246, 0.04)'],
    locations: [0, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /**
   * Premium / Gold — for subscription UI, locked features.
   */
  premiumAura: {
    colors: ['#78350F', '#D97706', '#FCD34D', '#F59E0B'],
    locations: [0, 0.4, 0.7, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /**
   * Scroll fade — bottom edge of scrollable lists.
   * Indicates more content below.
   */
  shadowVignette: {
    colors: ['transparent', '#03030A'],
    locations: [0, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
} as const satisfies Record<string, GradientConfig>;

export type GradientKey = keyof typeof gradients;
