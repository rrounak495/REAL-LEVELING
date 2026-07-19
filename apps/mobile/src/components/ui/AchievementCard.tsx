/**
 * src/components/ui/AchievementCard.tsx
 *
 * Displays a horizontal scrollable row of achievement badges,
 * or an empty state message. Reusable on Dashboard and Profile.
 */
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, fontFamily, radius } from '@theme';

interface AchievementBadge {
  id: string;
  name?: string;
}

interface AchievementCardProps {
  achievements: AchievementBadge[];
  maxDisplay?: number;
}

export function AchievementCard({ achievements, maxDisplay = 8 }: AchievementCardProps) {
  const display = achievements.slice(0, maxDisplay);

  if (display.length === 0) {
    return (
      <GlassCard padding={20} style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🏅</Text>
        <Text style={styles.emptyText}>No achievements unlocked yet</Text>
        <Text style={styles.emptySubtext}>Complete missions to earn badges</Text>
      </GlassCard>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {display.map((ach) => (
          <View key={ach.id} style={styles.badge}>
            <Text style={styles.badgeEmoji}>🏅</Text>
          </View>
        ))}
        {achievements.length > maxDisplay && (
          <View style={[styles.badge, styles.moreBadge]}>
            <Text style={styles.moreText}>+{achievements.length - maxDisplay}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(139, 60, 247, 0.12)',
    borderWidth: 1,
    borderColor: colors.purple[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  moreBadge: {
    backgroundColor: 'rgba(139, 60, 247, 0.08)',
    borderColor: colors.purple[800],
  },
  moreText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 13,
    color: colors.purple[400],
  },
  emptyCard: {
    alignItems: 'center',
    gap: 4,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
});
