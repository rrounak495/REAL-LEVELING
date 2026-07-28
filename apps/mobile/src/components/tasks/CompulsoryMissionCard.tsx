/**
 * CompulsoryMissionCard.tsx — Premium Compulsory Mission Card
 *
 * Sprint 1: UI Foundation
 * Category-colored mission cards for the Compulsory tab.
 * Uses the same color system as Home screen mission cards.
 * No business logic — pure UI placeholder.
 */
import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors, fontFamily, radius, spacing } from '@theme';

export interface CompulsoryMissionData {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  statLabel: string;
  statColor: string;
  iconBg: string;
  borderColor: string;
  isCompleted?: boolean;
  metadata?: any;
  difficulty?: string;
}

interface CompulsoryMissionCardProps {
  mission: CompulsoryMissionData;
  onToggle?: (id: string) => void;
}

export const CompulsoryMissionCard = memo(function CompulsoryMissionCard({
  mission,
  onToggle,
}: CompulsoryMissionCardProps) {
  const isCompleted = mission.isCompleted ?? false;
  const isGym = mission.id === 'foundation_gym' || mission.id === 'comp_gym';
  const [isExpanded, setIsExpanded] = useState(false);

  const expandAnim = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? 180 : 0, { duration: 300 }),
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 300 }),
      marginTop: withTiming(isExpanded ? 12 : 0, { duration: 300 }),
    };
  });

  const handlePress = () => {
    if (isGym) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <Pressable
      accessibilityLabel={`Compulsory mission: ${mission.title}. ${mission.xp} XP. ${mission.statLabel} stat.`}
      style={[
        styles.card,
        { borderColor: mission.borderColor },
        isCompleted && styles.completedCard,
      ]}
      onPress={handlePress}
    >
      <View style={styles.mainRow}>
        {/* Checkbox */}
        <Pressable
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => onToggle?.(mission.id)}
        >
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: mission.iconBg }]}>
          <Text style={styles.icon}>{mission.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.title, isCompleted && styles.completedText]}>
            {mission.title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {mission.description}
          </Text>

          {/* Reward chips */}
          <View style={styles.chipRow}>
            <View style={styles.xpChip}>
              <Text style={[styles.xpText, isCompleted && styles.completedXpText]}>
                +{mission.xp} XP
              </Text>
            </View>
            <View style={[styles.statChip, { borderColor: mission.statColor }]}>
              <Text style={[styles.statText, { color: mission.statColor }]}>
                {mission.statLabel} ↑
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Expandable Gym Content */}
      {isGym && (
        <Animated.View style={[styles.expandedContent, expandAnim]}>
          <View style={styles.expandedHeader}>
            <Text style={styles.difficultyLabel}>DIFFICULTY:</Text>
            <Text style={styles.difficultyValue}>{mission.difficulty || 'BEGINNER'}</Text>
          </View>

          <View style={styles.subtasksContainer}>
            {mission.metadata?.tasks?.map((task: any, index: number) => (
              <View key={index} style={styles.subtaskRow}>
                <View style={styles.subtaskDot} />
                <Text style={styles.subtaskName}>{task.name}</Text>
                <View style={styles.subtaskDottedLine} />
                <Text style={styles.subtaskReps}>{task.reps}</Text>
                <Text style={styles.subtaskXp}>+{task.xp}XP</Text>
              </View>
            ))}

            {/* Fallback if no tasks array in metadata */}
            {!mission.metadata?.tasks && (
              <>
                <View style={styles.subtaskRow}>
                  <View style={styles.subtaskDot} />
                  <Text style={styles.subtaskName}>Push-ups</Text>
                  <View style={styles.subtaskDottedLine} />
                  <Text style={styles.subtaskReps}>10 reps</Text>
                </View>
                <View style={styles.subtaskRow}>
                  <View style={styles.subtaskDot} />
                  <Text style={styles.subtaskName}>Sit-ups</Text>
                  <View style={styles.subtaskDottedLine} />
                  <Text style={styles.subtaskReps}>10 reps</Text>
                </View>
                <View style={styles.subtaskRow}>
                  <View style={styles.subtaskDot} />
                  <Text style={styles.subtaskName}>Plank</Text>
                  <View style={styles.subtaskDottedLine} />
                  <Text style={styles.subtaskReps}>30 sec</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    borderWidth: 1,
    marginBottom: spacing.listGap,
    overflow: 'hidden',
  },
  completedCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 15,
    color: colors.text.primary,
    letterSpacing: 0.1,
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  description: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpChip: {
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sharp,
  },
  xpText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    color: colors.purple[300],
    letterSpacing: 0.3,
  },
  completedXpText: {
    color: colors.semantic.success,
  },
  statChip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sharp,
  },
  statText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },

  // ── Expandable Gym Styles ──
  expandedContent: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  difficultyLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 0.5,
  },
  difficultyValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    color: colors.semantic.warning,
    letterSpacing: 0.5,
  },
  subtasksContainer: {
    gap: 10,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(200, 0, 255, 0.5)',
    marginRight: 8,
  },
  subtaskName: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  subtaskDottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  subtaskReps: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  subtaskXp: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    marginLeft: 8,
    width: 38,
    textAlign: 'right',
  },
});
