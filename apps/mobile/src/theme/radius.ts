/**
 * theme/radius.ts — Real Leveling Design System
 *
 * 7-step border radius scale.
 * Radius is a personality statement — sharp = tech/danger, round = social/comfort.
 *
 * Usage:
 *   import { radius } from '@theme';
 *   style={{ borderRadius: radius.md }}
 */
export const radius = {
  /** 4px — Weapon cards, danger alerts, cyber data panels */
  sharp: 4,
  /** 8px — Buttons, input fields, small tags */
  sm: 8,
  /** 12px — DEFAULT card radius */
  md: 12,
  /** 16px — Modal sheets, bottom drawers */
  lg: 16,
  /** 20px — Hero cards, avatar frame, featured content */
  xl: 20,
  /** 28px — Floating action buttons, bottom sheet handle */
  '2xl': 28,
  /** 9999px — Tags, streak counters, XP badges, toggles */
  pill: 9999,
  /** 9999px — Alias for pill; use when semantically describing a full circle */
  full: 9999,
} as const;

export type RadiusToken = (typeof radius)[keyof typeof radius];
export type RadiusKey = keyof typeof radius;
