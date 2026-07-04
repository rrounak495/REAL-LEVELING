/**
 * theme/typography.ts — Real Leveling Design System
 *
 * Font families, sizes, weights, and line heights.
 * All values derived directly from the approved Design System document.
 *
 * Font loading is handled in app/_layout.tsx via expo-font.
 * Do NOT use font names here directly in StyleSheet — use the
 * fontFamily tokens from this file which resolve to loaded font names.
 */

// ── Font Families ────────────────────────────────────────────────────────
// Each role maps to an object of available weights so usage is explicit:
//   style={{ fontFamily: typography.fontFamily.rajdhani.bold }}
export const fontFamily = {
  /** Display — Bold, angular, cyber energy. Level numbers, hero text. */
  rajdhani: {
    semiBold: 'Rajdhani_600SemiBold',
    bold: 'Rajdhani_700Bold',
  },
  /** Heading — Clean, geometric, futuristic. Section headers, card titles. */
  exo2: {
    regular: 'Exo2_400Regular',
    semiBold: 'Exo2_600SemiBold',
    bold: 'Exo2_700Bold',
  },
  /** Body — Maximum readability. All paragraph text, descriptions. */
  inter: {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  /** Mono / Stats — Precision. XP values, stat numbers, timestamps. */
  mono: {
    regular: 'JetBrainsMono_400Regular',
    semiBold: 'JetBrainsMono_600SemiBold',
  },
  /** Accent — Decorative JP characters for rank glyphs (Ｅ Ｄ Ｃ Ｂ Ａ Ｓ). */
  jp: {
    black: 'NotoSerifJP_900Black',
  },
} as const;

// ── Type Scale ───────────────────────────────────────────────────────────
// Follows a 1.25 Major Third ratio from 16px base.
// Each token maps { size, lineHeight, letterSpacing?, fontFamily, fontWeight }
export const typeScale = {
  displayHero: {
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -0.02 * 56, // -0.02em
    fontFamily: fontFamily.rajdhani.bold,
  },
  displayXl: {
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.02 * 44,
    fontFamily: fontFamily.rajdhani.bold,
  },
  displayLg: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.02 * 36,
    fontFamily: fontFamily.rajdhani.bold,
  },
  headingXl: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.01 * 28,
    fontFamily: fontFamily.exo2.bold,
  },
  headingLg: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: fontFamily.exo2.semiBold,
  },
  headingMd: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fontFamily.exo2.semiBold,
  },
  headingSm: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fontFamily.exo2.semiBold,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: fontFamily.inter.regular,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fontFamily.inter.regular,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fontFamily.inter.regular,
  },
  statXl: {
    fontSize: 32,
    lineHeight: 36,
    fontFamily: fontFamily.mono.semiBold,
  },
  statLg: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fontFamily.mono.semiBold,
  },
  statMd: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fontFamily.mono.semiBold,
  },
  statSm: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.mono.regular,
  },
  rankGlyph: {
    fontSize: 20,
    lineHeight: 20,
    fontFamily: fontFamily.jp.black,
  },
  labelCaps: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.08 * 11, // +0.08em
    fontFamily: fontFamily.inter.semiBold,
    textTransform: 'uppercase' as const,
  },
} as const;

// ── Convenience Type ──────────────────────────────────────────────────────
export type TypeScaleKey = keyof typeof typeScale;
export type FontFamilyKey = keyof typeof fontFamily;
