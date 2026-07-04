/**
 * theme/spacing.ts — Real Leveling Design System
 *
 * 8pt grid spacing system.
 * All values are multiples of 4, with 8 as the default unit.
 *
 * Usage:
 *   import { spacing } from '@theme';
 *   style={{ padding: spacing[4], gap: spacing.list }}
 */

// ── Base Scale ────────────────────────────────────────────────────────────
export const spacing = {
  // Base numeric scale (multiples of 4)
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16, // Default component padding
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,

  // ── Semantic Aliases ──────────────────────────────────────────────────
  // Use these in components for clear intent.

  /** Horizontal screen margin — ALWAYS 20px. Never deviate. */
  screenHorizontal: 20,
  /** Vertical screen padding (top/bottom safe area padding) */
  screenVertical: 24,
  /** Gap between major screen sections */
  sectionGap: 24,
  /** Gap between list items (quest cards, friend rows, etc.) */
  listGap: 12,
  /** Gap between cards in a horizontal scroll */
  cardGap: 16,
  /** Default inner padding for cards */
  cardPadding: 16,
  /** Tight padding for small components (chips, badges) */
  componentXs: 8,
  /** Small padding for tags, small buttons */
  componentSm: 12,
  /** Default padding for buttons, input fields */
  componentMd: 16,
  /** Large padding for hero sections */
  componentLg: 20,
  /** Icon-to-label gap */
  iconLabel: 8,
} as const;

export type SpacingToken = (typeof spacing)[keyof typeof spacing];
