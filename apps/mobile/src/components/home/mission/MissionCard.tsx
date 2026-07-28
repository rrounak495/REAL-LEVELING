/**
 * MissionCard.tsx — Premium RPG Quest Card
 *
 * Sprint 2: Complete visual overhaul.
 * Every card feels like accepting a quest before entering battle.
 * Gym card is the Hero Mission — expandable, larger, visually dominant.
 * Static cards: Hydration, Recovery, Mindfulness, Consistency, Deep Work.
 */
import React, { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { Mission, MissionAction } from '@/types/mission.types';

// ── Mission category config ───────────────────────────────────────────────

interface MissionConfig {
  icon: string;
  iconBg: string;
  glowColor: string;
  borderColor: string;
  statLabel: string;
  statColor: string;
  isHero?: boolean;
}

const MISSION_CONFIG: Record<string, MissionConfig> = {
  gym: {
    icon: '⚔️',
    iconBg: 'rgba(200, 0, 255, 0.15)',
    glowColor: 'rgba(200, 0, 255, 0.35)',
    borderColor: 'rgba(200, 0, 255, 0.5)',
    statLabel: 'STR',
    statColor: '#FF6B6B',
    isHero: true,
  },
  hydration: {
    icon: '💧',
    iconBg: 'rgba(0, 180, 255, 0.12)',
    glowColor: 'rgba(0, 180, 255, 0.25)',
    borderColor: 'rgba(0, 180, 255, 0.3)',
    statLabel: 'VIT',
    statColor: '#00FF88',
  },
  recovery: {
    icon: '🌙',
    iconBg: 'rgba(147, 170, 248, 0.12)',
    glowColor: 'rgba(147, 170, 248, 0.25)',
    borderColor: 'rgba(147, 170, 248, 0.3)',
    statLabel: 'VIT',
    statColor: '#00FF88',
  },
  mindfulness: {
    icon: '🧘',
    iconBg: 'rgba(255, 106, 193, 0.12)',
    glowColor: 'rgba(255, 106, 193, 0.25)',
    borderColor: 'rgba(255, 106, 193, 0.3)',
    statLabel: 'WIS',
    statColor: '#FFD000',
  },
  consistency: {
    icon: '🔥',
    iconBg: 'rgba(252, 211, 77, 0.12)',
    glowColor: 'rgba(252, 211, 77, 0.25)',
    borderColor: 'rgba(252, 211, 77, 0.4)',
    statLabel: 'CHA',
    statColor: '#FF9FDB',
  },
  deep_work: {
    icon: '🧠',
    iconBg: 'rgba(59, 91, 246, 0.12)',
    glowColor: 'rgba(59, 91, 246, 0.25)',
    borderColor: 'rgba(59, 91, 246, 0.3)',
    statLabel: 'INT',
    statColor: '#5E78F8',
  },
};

function getMissionConfig(mission: Mission): MissionConfig {
  const id = mission.id.toLowerCase();
  if (id.includes('gym') || id.includes('workout')) return MISSION_CONFIG.gym!;
  if (id.includes('hydrat') || id.includes('water')) return MISSION_CONFIG.hydration!;
  if (id.includes('recover') || id.includes('sleep')) return MISSION_CONFIG.recovery!;
  if (id.includes('mindful') || id.includes('meditat')) return MISSION_CONFIG.mindfulness!;
  if (id.includes('consist') || id.includes('streak')) return MISSION_CONFIG.consistency!;
  if (id.includes('deep') || id.includes('work') || id.includes('study'))
    return MISSION_CONFIG.deep_work!;

  const title = mission.title.toLowerCase();
  if (title.includes('gym') || title.includes('workout')) return MISSION_CONFIG.gym!;
  if (title.includes('hydrat') || title.includes('water')) return MISSION_CONFIG.hydration!;
  if (title.includes('recover') || title.includes('sleep')) return MISSION_CONFIG.recovery!;
  if (title.includes('mindful') || title.includes('meditat')) return MISSION_CONFIG.mindfulness!;
  if (title.includes('consist') || title.includes('streak')) return MISSION_CONFIG.consistency!;
  if (title.includes('deep') || title.includes('work')) return MISSION_CONFIG.deep_work!;

  return MISSION_CONFIG.hydration!;
}

// ── Workout Tasks (for expanded Gym card) ─────────────────────────────────

const GYM_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

const GYM_TASKS: Record<string, { name: string; reps: string; xp: number }[]> = {
  Beginner: [
    { name: 'Push-ups', reps: '10 reps', xp: 30 },
    { name: 'Sit-ups', reps: '10 reps', xp: 30 },
  ],
  Intermediate: [
    { name: 'Push-ups', reps: '20 reps', xp: 50 },
    { name: 'Sit-ups', reps: '25 reps', xp: 50 },
    { name: 'Squats', reps: '15 reps', xp: 40 },
  ],
  Advanced: [
    { name: 'Push-ups', reps: '40 reps', xp: 80 },
    { name: 'Sit-ups', reps: '50 reps', xp: 80 },
    { name: 'Squats', reps: '30 reps', xp: 60 },
    { name: 'Burpees', reps: '10 reps', xp: 100 },
  ],
};

// ── Animated Checkbox ─────────────────────────────────────────────────────

const AnimatedCheckbox = memo(function AnimatedCheckbox({
  checked,
  onPress,
  color,
}: {
  checked: boolean;
  onPress: () => void;
  color: string;
}) {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.85, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  }, [onPress]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.checkbox,
          checked && { backgroundColor: color, borderColor: color, shadowColor: color },
          animStyle,
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </Animated.View>
    </Pressable>
  );
});

// ── Gym Expanded Content ───────────────────────────────────────────────────

const GymExpandedContent = memo(function GymExpandedContent({
  mission,
  onComplete,
  onUpdateProgress,
}: {
  mission: Mission;
  onComplete?: ((id: string) => void) | undefined;
  onUpdateProgress?:
    ((id: string, metadataUpdates: Record<string, any>, currentValue?: number) => void) | undefined;
}) {
  const tasks = mission.metadata?.tasks || [];

  // Use metadata for persisted task checkboxes
  const completedTaskIndexes: number[] = mission.metadata?.completedTaskIndexes || [];

  // Create Set on the fly from persisted array (React.memo avoids unnecessary re-renders)
  const completedTasks = new Set(completedTaskIndexes);
  const allDone = tasks.length > 0 && completedTasks.size === tasks.length;

  const toggleTask = useCallback(
    (index: number) => {
      if (!onUpdateProgress) return;

      const next = new Set(completedTasks);
      if (next.has(index)) next.delete(index);
      else next.add(index);

      onUpdateProgress(mission.id, { completedTaskIndexes: Array.from(next) });
    },
    [completedTasks, mission.id, onUpdateProgress],
  );

  const totalXp = tasks.reduce((sum: number, t: any) => sum + t.xp, 0);
  const completedXp = tasks
    .filter((_: any, i: number) => completedTasks.has(i))
    .reduce((sum: number, t: any) => sum + t.xp, 0);
  const progress = tasks.length > 0 ? completedTasks.size / tasks.length : 0;

  return (
    <View style={styles.gymExpanded}>
      <View style={{ paddingTop: 16 }} />

      {/* Workout Tasks */}
      <View style={styles.taskList}>
        {tasks.map((task: any, i: number) => (
          <View key={task.name} style={styles.taskRow}>
            <AnimatedCheckbox
              checked={completedTasks.has(i)}
              color="#C800FF"
              onPress={() => toggleTask(i)}
            />
            <View style={styles.taskInfo}>
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.taskReps}>{task.reps}</Text>
            </View>
            <Text style={[styles.taskXp, completedTasks.has(i) && styles.taskXpDone]}>
              +{task.xp} XP
            </Text>
          </View>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.gymProgressContainer}>
        <View style={styles.gymProgressTrack}>
          <Animated.View
            style={[styles.gymProgressFill, { width: `${Math.round(progress * 100)}%` as any }]}
          />
        </View>
        <Text style={styles.gymProgressLabel}>
          {completedTasks.size}/{tasks.length} tasks • +{completedXp}/{totalXp} XP
        </Text>
      </View>

      {/* Complete Workout Button */}
      <Pressable
        disabled={!allDone}
        style={[styles.completeWorkoutBtn, !allDone && styles.completeWorkoutBtnDisabled]}
        onPress={() => {
          if (allDone && onComplete) {
            Alert.alert(
              'Complete Mission?',
              "Are you sure you've completed this mission?\n\nYou can fool the world, but your progress never lies. Confirm this only if you've genuinely completed the mission.",
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', style: 'default', onPress: () => onComplete(mission.id) },
              ]
            );
          }
        }}
      >
        <Text style={[styles.completeWorkoutText, !allDone && styles.completeWorkoutTextDisabled]}>
          {allDone ? '⚔️  COMPLETE WORKOUT' : `Complete all tasks to finish`}
        </Text>
      </Pressable>
    </View>
  );
});

// ── Hero Mission Card (Gym) ───────────────────────────────────────────────

const HeroMissionCard = memo(function HeroMissionCard({
  mission,
  config,
  onComplete,
  onUpdateProgress,
}: {
  mission: Mission;
  config: MissionConfig;
  onComplete?: ((id: string) => void) | undefined;
  onUpdateProgress?:
    ((id: string, metadataUpdates: Record<string, any>, currentValue?: number) => void) | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const expandProgress = useSharedValue(0);
  const cardScale = useSharedValue(1);

  const handleToggle = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    expandProgress.value = withTiming(next ? 1 : 0, {
      duration: 350,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [expanded]);

  const handlePressIn = useCallback(() => {
    cardScale.value = withTiming(0.985, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1, { damping: 15 });
  }, []);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const isCompleted = mission.status === 'completed';

  return (
    <Animated.View style={[styles.heroCard, cardAnimStyle]}>
      {/* Hero glow border */}
      <View style={[styles.heroBorderGlow, { shadowColor: config.glowColor }]} />

      {/* Top accent line */}
      <View style={[styles.heroAccentLine, { backgroundColor: config.glowColor }]} />

      <Pressable
        accessibilityRole="button"
        style={styles.heroCardInner}
        onPress={handleToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Icon + Content Row */}
        <View style={styles.heroTopRow}>
          {/* Large Icon */}
          <View
            style={[
              styles.heroIconContainer,
              {
                backgroundColor: config.iconBg,
                borderColor: config.borderColor,
                shadowColor: config.glowColor,
              },
            ]}
          >
            <Text style={styles.heroIcon}>{config.icon}</Text>
          </View>

          {/* Content */}
          <View style={styles.heroContent}>
            {/* Badge Row */}
            <View style={styles.heroBadgeRow}>
              <View style={[styles.heroBadge, { borderColor: config.borderColor }]}>
                <Text style={[styles.heroBadgeText, { color: config.glowColor }]}>
                  HERO MISSION
                </Text>
              </View>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>CLEARED</Text>
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={[styles.heroTitle, isCompleted && styles.titleCompleted]}>
              {mission.title}
            </Text>

            {/* Description */}
            {mission.description && (
              <Text style={styles.heroDescription}>{mission.description}</Text>
            )}
          </View>

          {/* Chevron */}
          <Animated.View style={[styles.chevron, chevronStyle]}>
            <Text style={styles.chevronText}>▾</Text>
          </Animated.View>
        </View>

        {/* Reward Row */}
        <View style={styles.heroRewardRow}>
          <View style={styles.rewardPill}>
            <Text style={styles.rewardPillLabel}>XP</Text>
            <Text style={styles.rewardPillValue}>+{mission.reward.xp}</Text>
          </View>
          <View style={[styles.statPill, { borderColor: config.statColor + '50' }]}>
            <Text style={[styles.statPillLabel, { color: config.statColor }]}>
              {config.statLabel} ↑
            </Text>
          </View>
          {mission.estimatedTimeMinutes && (
            <View style={styles.timePill}>
              <Text style={styles.timePillText}>⏱ {mission.estimatedTimeMinutes}m</Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* Expandable Section */}
      {expanded && (
        <GymExpandedContent
          mission={mission}
          onComplete={onComplete}
          onUpdateProgress={onUpdateProgress}
        />
      )}
    </Animated.View>
  );
});

// ── Standard Quest Card ────────────────────────────────────────────────────

const StandardMissionCard = memo(function StandardMissionCard({
  mission,
  config,
  onStart,
  onComplete,
}: {
  mission: Mission;
  config: MissionConfig;
  onStart?: ((id: string) => void) | undefined;
  onComplete?: ((id: string) => void) | undefined;
}) {
  const cardScale = useSharedValue(1);
  const isCompleted = mission.status === 'completed';

  const handlePressIn = useCallback(() => {
    cardScale.value = withTiming(0.97, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1, { damping: 15 });
  }, []);

  const handlePress = useCallback(() => {
    if (mission.id === 'foundation_consistency') return; // Auto-calculated
    if (!isCompleted && onComplete) {
      Alert.alert(
        'Complete Mission?',
        "Are you sure you've completed this mission?\n\nYou can fool the world, but your progress never lies. Confirm this only if you've genuinely completed the mission.",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', style: 'default', onPress: () => onComplete(mission.id) },
        ]
      );
    }
  }, [isCompleted, mission.id, onComplete]);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.questCard,
        isCompleted && [
          styles.questCardCompleted,
          {
            borderColor:
              config.borderColor.length === 7
                ? config.borderColor + '40'
                : config.borderColor.replace(/[\d.]+\)$/g, '0.15)'),
          },
        ],
        cardAnimStyle,
      ]}
    >
      {/* Left accent line */}
      <View
        style={[
          styles.questAccentLine,
          {
            backgroundColor: config.glowColor,
            opacity: isCompleted ? 0.2 : 1,
          },
        ]}
      />

      <Pressable
        accessibilityRole="button"
        style={styles.questInner}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Icon */}
        <View
          style={[
            styles.questIconContainer,
            {
              backgroundColor: isCompleted ? 'rgba(255,255,255,0.04)' : config.iconBg,
              borderColor: isCompleted ? 'rgba(255,255,255,0.08)' : config.borderColor,
              shadowColor: isCompleted ? 'transparent' : config.glowColor,
            },
          ]}
        >
          <Text style={[styles.questIcon, isCompleted && styles.questIconDone]}>
            {isCompleted ? '✓' : config.icon}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.questContent}>
          {/* Title */}
          <Text numberOfLines={1} style={[styles.questTitle, isCompleted && styles.titleCompleted]}>
            {mission.title}
          </Text>

          {/* Description */}
          {mission.description && (
            <Text numberOfLines={2} style={styles.questDescription}>
              {mission.description}
            </Text>
          )}

          {/* Numeric Progress (e.g. Walking Steps) */}
          {mission.metadata?.progressType === 'numeric' && mission.targetValue && (
            <View style={styles.numericProgressContainer}>
              <Text style={styles.numericProgressLabel}>
                {mission.id === 'foundation_walking' ? "Today's Steps" : 'Progress'}
              </Text>
              <Text style={styles.numericProgressText}>
                {(mission.currentProgress || 0).toLocaleString()} /{' '}
                {mission.targetValue.toLocaleString()}
              </Text>
            </View>
          )}

          {/* Rewards */}
          <View style={styles.questRewardRow}>
            <View style={styles.rewardPillSmall}>
              <Text style={styles.rewardPillSmallText}>+{mission.reward.xp} XP</Text>
            </View>
            <Text style={[styles.questStatText, { color: config.statColor }]}>
              {config.statLabel} ↑
            </Text>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={styles.questStatus}>
          {isCompleted ? (
            <View style={styles.doneCircle}>
              <Text style={styles.doneCheckmark}>✓</Text>
            </View>
          ) : (
            <View style={[styles.pendingCircle, { borderColor: config.borderColor }]} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

// ── Main Export ────────────────────────────────────────────────────────────

export interface MissionCardProps extends MissionAction {
  mission: Mission;
}

export const MissionCard = memo(function MissionCard({
  mission,
  onStart,
  onComplete,
  onUpdateProgress,
}: MissionCardProps) {
  const config = getMissionConfig(mission);

  if (config.isHero) {
    return (
      <HeroMissionCard
        config={config}
        mission={mission}
        onComplete={onComplete}
        onUpdateProgress={onUpdateProgress}
      />
    );
  }

  return (
    <StandardMissionCard
      config={config}
      mission={mission}
      onComplete={onComplete}
      onStart={onStart}
    />
  );
});

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Hero Card ────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: 'rgba(12, 8, 25, 0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(200, 0, 255, 0.35)',
    overflow: 'hidden',
    shadowColor: '#C800FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroBorderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 0,
  },
  heroAccentLine: {
    height: 2,
    opacity: 0.9,
  },
  heroCardInner: {
    padding: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
    flexShrink: 0,
  },
  heroIcon: {
    fontSize: 28,
  },
  heroContent: {
    flex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  completedBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#10B981',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: 'Exo2_700Bold',
    fontSize: 20,
    color: '#F4F4FF',
    lineHeight: 26,
    marginBottom: 4,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#9CA3C8',
    lineHeight: 19,
  },
  chevron: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  chevronText: {
    fontSize: 18,
    color: 'rgba(200, 0, 255, 0.7)',
  },
  heroRewardRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(252, 211, 77, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rewardPillLabel: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.7)',
    letterSpacing: 1,
  },
  rewardPillValue: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 13,
    color: '#FCD34D',
  },
  statPill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statPillLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timePillText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#4B5280',
  },

  // ── Gym Expanded ─────────────────────────────────────────────────────
  gymExpanded: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 0, 255, 0.15)',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    marginBottom: 4,
  },
  diffPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  diffPillSelected: {
    backgroundColor: 'rgba(200, 0, 255, 0.2)',
    borderColor: '#C800FF',
  },
  diffPillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#4B5280',
    letterSpacing: 0.3,
  },
  diffPillTextSelected: {
    color: '#F4F4FF',
    fontFamily: 'Inter_600SemiBold',
  },
  gymDivider: {
    height: 1,
    backgroundColor: 'rgba(200, 0, 255, 0.1)',
    marginVertical: 16,
  },
  taskList: {
    gap: 14,
    marginBottom: 20,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  checkmark: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#F4F4FF',
  },
  taskReps: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#4B5280',
  },
  taskXp: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 13,
    color: '#FCD34D',
  },
  taskXpDone: {
    color: '#10B981',
  },
  gymProgressContainer: {
    marginBottom: 16,
  },
  gymProgressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gymProgressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#C800FF',
  },
  gymProgressLabel: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    color: '#4B5280',
    textAlign: 'center',
  },
  completeWorkoutBtn: {
    backgroundColor: 'rgba(200, 0, 255, 0.85)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C800FF',
    shadowColor: '#C800FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 5,
  },
  completeWorkoutBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeWorkoutText: {
    fontFamily: 'Exo2_700Bold',
    fontSize: 14,
    color: '#fff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  completeWorkoutTextDisabled: {
    color: '#4B5280',
    letterSpacing: 0.5,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textTransform: 'none',
  },

  // ── Standard Quest Card ───────────────────────────────────────────────
  questCard: {
    backgroundColor: 'rgba(14, 14, 28, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.12)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  questCardCompleted: {
    backgroundColor: 'rgba(14, 14, 28, 0.45)',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  questAccentLine: {
    width: 3,
    position: 'absolute',
    top: 16,
    bottom: 16,
    left: 0,
    borderRadius: 2,
  },
  questInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 16,
    gap: 16,
  },
  questIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 13,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
    flexShrink: 0,
  },
  questIcon: {
    fontSize: 24,
  },
  questIconDone: {
    fontSize: 20,
  },
  questContent: {
    flex: 1,
    gap: 4,
  },
  questTitle: {
    fontFamily: 'Exo2_600SemiBold',
    fontSize: 16,
    color: '#F4F4FF',
    lineHeight: 22,
  },
  titleCompleted: {
    color: '#4B5280',
    textDecorationLine: 'line-through',
  },
  questDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#9CA3C8',
    lineHeight: 17,
  },
  questRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  rewardPillSmall: {
    backgroundColor: 'rgba(252, 211, 77, 0.08)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rewardPillSmallText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 11,
    color: '#FCD34D',
  },
  questStatText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  questStatus: {
    width: 28,
    alignItems: 'center',
    flexShrink: 0,
  },
  doneCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneCheckmark: {
    fontSize: 12,
    color: '#10B981',
    fontFamily: 'Inter_700Bold',
  },
  pendingCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  numericProgressContainer: {
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  numericProgressLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#9CA3C8',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numericProgressText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 13,
    color: '#F4F4FF',
  },
});
