/**
 * src/components/ui/GlassCard.tsx
 *
 * Glassmorphism card — the primary surface component.
 * Creates depth through background tinting + border glow.
 *
 * Android Note: React Native does not support backdrop-filter blur.
 * We simulate glassmorphism with semi-transparent background +
 * subtle border luminosity. True blur requires a native module.
 *
 * Variants:
 *   default — standard surface elevation
 *   elevated — stronger border, higher contrast
 *   active — neon purple border glow for selected/focused states
 */
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { colors, radius, elevation } from '@theme';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'active';
  padding?: number;
}

export function GlassCard({ children, style, variant = 'default', padding = 16 }: GlassCardProps) {
  return <View style={[styles.base, styles[variant], { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    ...elevation.md,
  },
  default: {
    backgroundColor: colors.bg.surface,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  elevated: {
    backgroundColor: colors.bg.elevated,
    borderColor: 'rgba(139, 60, 247, 0.28)',
  },
  active: {
    backgroundColor: colors.bg.elevated,
    borderColor: colors.purple[500],
    ...elevation.lg,
  },
});
