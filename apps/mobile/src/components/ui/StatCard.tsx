/**
 * src/components/ui/StatCard.tsx
 *
 * Reusable stat display card for dashboards and profiles.
 * Shows an icon, value, and label in a glassmorphism card.
 */
import { StyleSheet, Text, type ViewStyle, type StyleProp } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, fontFamily } from '@theme';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  style?: StyleProp<ViewStyle>;
  valueColor?: string;
  compact?: boolean;
}

export function StatCard({
  icon,
  value,
  label,
  style,
  valueColor = colors.text.primary,
  compact = false,
}: StatCardProps) {
  return (
    <GlassCard
      padding={compact ? 10 : 14}
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      <Text style={[styles.icon, compact && styles.iconCompact]}>{icon}</Text>
      <Text
        numberOfLines={1}
        style={[styles.value, compact && styles.valueCompact, { color: valueColor }]}
      >
        {value}
      </Text>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  cardCompact: {
    gap: 2,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  iconCompact: {
    fontSize: 18,
    marginBottom: 2,
  },
  value: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 18,
    color: colors.text.primary,
  },
  valueCompact: {
    fontSize: 15,
  },
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 9,
    color: colors.text.muted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  labelCompact: {
    fontSize: 8,
    letterSpacing: 1,
  },
});
