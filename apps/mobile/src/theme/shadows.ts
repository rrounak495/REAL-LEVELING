/**
 * theme/shadows.ts — Real Leveling Design System
 *
 * Dual shadow system:
 *  1. Elevation shadows — structural depth (applies cross-platform via StyleSheet)
 *  2. Neon glow shadows — emotional importance (web/iOS via boxShadow, Android via elevation + custom)
 *
 * IMPORTANT — Android shadow note:
 * Android does NOT support boxShadow. The `glow` values are intended for use
 * with react-native-shadow-2 or as web/iOS-only styles. On Android, use
 * the elevation value + a colored overlay for glow simulation.
 *
 * Each shadow object is directly spreadable into a StyleSheet:
 *   style={{ ...shadows.elevation.md, ...shadows.glow.purple.active }}
 */
import type { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

// ── Elevation Shadows ─────────────────────────────────────────────────────
// These work cross-platform via React Native's shadow props + Android elevation.
export const elevation: Record<string, ViewStyle> = {
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  xs: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
    },
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
    },
    android: { elevation: 4 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
    },
    android: { elevation: 8 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.8,
      shadowRadius: 16,
    },
    android: { elevation: 16 },
    default: {},
  }) as ViewStyle,
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.9,
      shadowRadius: 32,
    },
    android: { elevation: 24 },
    default: {},
  }) as ViewStyle,
} as const;

// ── Neon Glow — iOS/Web only (extend with react-native-shadow-2 for Android) ──
// These are defined as string values for use in NativeWind's boxShadow utility.
// For React Native StyleSheet, use the elevation props above.
export const glow = {
  purple: {
    ambient: '0 0 12px rgba(139, 60, 247, 0.35)',
    active: '0 0 20px rgba(139, 60, 247, 0.55), 0 0 40px rgba(139, 60, 247, 0.25)',
    surge:
      '0 0 40px rgba(200, 0, 255, 0.80), 0 0 80px rgba(139, 60, 247, 0.50), 0 0 120px rgba(139, 60, 247, 0.20)',
  },
  blue: {
    ambient: '0 0 12px rgba(59, 91, 246, 0.35)',
    active: '0 0 20px rgba(59, 91, 246, 0.55), 0 0 40px rgba(59, 91, 246, 0.25)',
    surge:
      '0 0 40px rgba(0, 180, 255, 0.80), 0 0 80px rgba(59, 91, 246, 0.50), 0 0 120px rgba(59, 91, 246, 0.20)',
  },
  cyan: {
    ambient: '0 0 12px rgba(0, 180, 255, 0.30)',
    active: '0 0 20px rgba(0, 180, 255, 0.50), 0 0 40px rgba(0, 180, 255, 0.20)',
    surge: '0 0 40px rgba(0, 255, 255, 0.90), 0 0 80px rgba(0, 180, 255, 0.60)',
  },
  gold: {
    ambient: '0 0 12px rgba(252, 211, 77, 0.30)',
    active: '0 0 20px rgba(252, 211, 77, 0.50), 0 0 40px rgba(252, 211, 77, 0.20)',
    surge: '0 0 40px rgba(255, 215, 0, 0.80), 0 0 80px rgba(245, 158, 11, 0.50)',
  },
  danger: {
    ambient: '0 0 12px rgba(239, 68, 68, 0.30)',
    active: '0 0 20px rgba(239, 68, 68, 0.55), 0 0 40px rgba(239, 68, 68, 0.25)',
    surge: '0 0 40px rgba(255, 34, 68, 0.80), 0 0 80px rgba(239, 68, 68, 0.50)',
  },
} as const;

// ── Text Glow — for neon text effect ──────────────────────────────────────
export const textGlow = {
  purple: '0 0 10px rgba(139, 60, 247, 0.8), 0 0 20px rgba(139, 60, 247, 0.4)',
  blue: '0 0 10px rgba(0, 180, 255, 0.8), 0 0 20px rgba(0, 180, 255, 0.4)',
  gold: '0 0 10px rgba(252, 211, 77, 0.8), 0 0 20px rgba(245, 158, 11, 0.4)',
  white: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 16px rgba(255, 255, 255, 0.2)',
} as const;

export type GlowColor = keyof typeof glow;
export type GlowTier = 'ambient' | 'active' | 'surge';
