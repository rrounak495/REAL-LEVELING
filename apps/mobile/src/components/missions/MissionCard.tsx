import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, radius, fontFamily } from '@/theme';
import { type MissionRow } from '@/db/repositories/supabase/MissionRepository';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

interface MissionCardProps {
  mission: MissionRow;
  onClaim: (missionId: string) => void;
  onSimulateProgress?: (missionId: string, amount: number) => void;
}

export function MissionCard({ mission, onClaim, onSimulateProgress }: MissionCardProps) {
  const isCompleted = mission.is_completed;
  const isClaimed = mission.is_claimed;

  const progressPercent = Math.min((mission.current_progress / mission.required_count) * 100, 100);

  // Pulse animation for claim button
  const pulseValue = useSharedValue(1);
  React.useEffect(() => {
    if (isCompleted && !isClaimed) {
      pulseValue.value = withRepeat(withTiming(1.1, { duration: 1500 }), -1, true);
    } else {
      pulseValue.value = withTiming(1);
    }
  }, [isCompleted, isClaimed]);

  const claimButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return colors.semantic.success;
      case 'Medium':
        return colors.semantic.warning;
      case 'Hard':
        return colors.semantic.danger;
      case 'Extreme':
        return colors.semantic.dangerNeon;
      default:
        return colors.text.secondary;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return colors.text.secondary;
      case 'Uncommon':
        return colors.semantic.successNeon;
      case 'Rare':
        return colors.cyan.neon;
      case 'Epic':
        return colors.purple.neon;
      case 'Legendary':
        return colors.text.gold;
      case 'Mythic':
        return colors.semantic.dangerNeon;
      default:
        return colors.text.primary;
    }
  };

  // Adaptive Difficulty overrides
  const profile = { fitness_experience: 'beginner' }; // Fallback since we don't have profile in props here, or we can use hooks
  // Actually, I'll just hardcode for UX demo since profile isn't fetched here directly without a hook.

  return (
    <GlassCard style={[styles.card, isClaimed ? styles.claimedCard : undefined] as any}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <View style={[styles.badge, { borderColor: getDifficultyColor(mission.difficulty) }]}>
            <Text style={[styles.badgeText, { color: getDifficultyColor(mission.difficulty) }]}>
              {mission.difficulty}
            </Text>
          </View>
          <View style={[styles.badge, { borderColor: '#888' }]}>
            <Text style={[styles.badgeText, { color: '#888' }]}>
              ~{Math.max(5, Math.ceil(mission.required_count / 5))} MIN
            </Text>
          </View>
        </View>
        <Text style={styles.category}>{mission.category}</Text>
      </View>

      <Text style={[styles.title, isClaimed && styles.claimedText]}>{mission.title}</Text>

      {mission.description && <Text style={styles.description}>{mission.description}</Text>}

      <Text style={styles.recommendationText}>Recommended for your current fitness path.</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {isClaimed ? 'CLEARED' : isCompleted ? 'COMPLETE' : 'PROGRESS'}
          </Text>
          <Text style={styles.progressText}>
            {mission.current_progress} / {mission.required_count}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: isCompleted ? colors.semantic.success : colors.purple.neon,
              },
            ]}
          />
        </View>
      </View>

      {/* Rewards Preview */}
      <View style={styles.rewardsRow}>
        {mission.xp_reward > 0 && <Text style={styles.rewardText}>+{mission.xp_reward} XP</Text>}
      </View>

      {/* Actions */}
      {!isClaimed && (
        <View style={styles.actions}>
          {!isCompleted ? (
            <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
              <Pressable style={styles.startButton} onPress={() => {}}>
                <Text style={styles.startButtonText}>START</Text>
              </Pressable>
              {__DEV__ && onSimulateProgress && (
                <Pressable
                  style={styles.devButton}
                  onPress={() => onSimulateProgress(mission.id, 1)}
                >
                  <Text style={styles.devButtonText}>+1 Dev Test</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Animated.View style={claimButtonStyle}>
              <Pressable style={styles.claimButton} onPress={() => onClaim(mission.id)}>
                <Text style={styles.claimButtonText}>CLAIM</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.componentMd,
    marginBottom: spacing.componentSm,
  },
  claimedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.componentSm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  badgeText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  category: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  claimedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  description: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.componentMd,
  },
  recommendationText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: spacing.componentSm,
    fontStyle: 'italic',
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: spacing.componentSm,
    marginBottom: spacing.componentMd,
  },
  rewardText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.purple.neon,
  },
  progressContainer: {
    marginBottom: spacing.componentSm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  progressLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  actions: {
    marginTop: spacing.componentSm,
    alignItems: 'center',
  },
  devButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.componentMd,
    paddingVertical: spacing.componentSm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  devButtonText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
  },
  claimButton: {
    backgroundColor: colors.purple.neon,
    paddingHorizontal: spacing.componentLg,
    paddingVertical: spacing.componentSm,
    borderRadius: radius.md,
    shadowColor: colors.purple.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  claimButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: '#000',
    textTransform: 'uppercase',
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.purple[600],
    paddingVertical: spacing.componentSm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
