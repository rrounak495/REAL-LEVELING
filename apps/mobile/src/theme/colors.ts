/**
 * theme/colors.ts — Real Leveling Design System
 *
 * Single source of truth for ALL color values.
 * These are the TypeScript-typed counterparts of tailwind.config.js colors.
 *
 * Usage in StyleSheet (when className is not an option):
 *   import { colors } from '@theme';
 *   style={{ backgroundColor: colors.bg.surface }}
 *
 * Usage in NativeWind:
 *   className="bg-bg-surface text-purple-500"
 *
 * All values use `as const` to enable literal type inference.
 */
export const colors = {
  // ── Background / Void ──────────────────────────────────────────────────
  bg: {
    void: '#03030A',
    base: '#08080F',
    surface: '#0E0E1C',
    elevated: '#141428',
    overlay: '#1C1C38',
    scrim: 'rgba(3, 3, 10, 0.85)',
  },

  // ── Neon Purple — Primary Brand ────────────────────────────────────────
  purple: {
    950: '#0D0320',
    900: '#160538',
    800: '#2A0E60',
    700: '#4A1A9E',
    600: '#6B2FCC',
    500: '#8B3CF7',
    400: '#A855F7',
    300: '#C084FC',
    200: '#DDD6FE',
    neon: '#C800FF',
  },

  // ── Neon Blue — Secondary Brand ────────────────────────────────────────
  blue: {
    900: '#060920',
    800: '#0D1640',
    700: '#1A2E80',
    600: '#2448CC',
    500: '#3B5BF6',
    400: '#5E78F8',
    300: '#93AAF8',
    neon: '#00B4FF',
  },

  // ── Accent Colors ──────────────────────────────────────────────────────
  cyan: {
    neon: '#00FFFF',
  },

  // ── Stat Colors — One per player stat ─────────────────────────────────
  stat: {
    str: '#FF4444',
    strNeon: '#FF6B6B',
    int: '#3B5BF6',
    intNeon: '#5E78F8',
    vit: '#00C853',
    vitNeon: '#00FF88',
    wis: '#FFB300',
    wisNeon: '#FFD000',
    cha: '#FF6AC1',
    chaNeon: '#FF9FDB',
  },

  // ── Semantic Colors ────────────────────────────────────────────────────
  semantic: {
    success: '#10B981',
    successNeon: '#00FF88',
    warning: '#F59E0B',
    warningNeon: '#FFD000',
    danger: '#EF4444',
    dangerNeon: '#FF2244',
    premium: '#F59E0B',
    premiumNeon: '#FFD700',
    legendary: '#FF6B35',
    legendaryNeon: '#FF8C00',
  },

  // ── Gold / Luxury ──────────────────────────────────────────────────────
  gold: {
    700: '#78350F',
    600: '#92400E',
    500: '#D97706',
    400: '#FCD34D',
    300: '#FDE68A',
    neon: '#FFD700',
  },

  // ── Text ───────────────────────────────────────────────────────────────
  text: {
    primary: '#F4F4FF',
    secondary: '#9CA3C8',
    muted: '#4B5280',
    inverse: '#08080F',
    neonPurple: '#C084FC',
    neonBlue: '#93AAF8',
    gold: '#FCD34D',
  },
} as const;

// ── Derived Types ──────────────────────────────────────────────────────────
// These allow you to do: function foo(color: BgColorToken) {}
export type ColorTokens = typeof colors;
export type BgColorToken = (typeof colors.bg)[keyof typeof colors.bg];
export type PurpleToken = (typeof colors.purple)[keyof typeof colors.purple];
export type StatColorToken = (typeof colors.stat)[keyof typeof colors.stat];
export type TextToken = (typeof colors.text)[keyof typeof colors.text];
