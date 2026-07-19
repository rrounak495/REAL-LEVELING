/**
 * app/(app)/(tabs)/tasks.tsx — Premium Tasks / Quest Board
 * Sprint 5.1: RPG Quest Board UI
 */
import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MissionCard } from '@/components/missions/MissionCard';
import { useMissionStore } from '@/store/mission.store';
import { useAchievementStore } from '@/store/achievement.store';
import { useAuthStore } from '@/store/auth.store';
import { colors, fontFamily, radius, spacing } from '@theme';

export default function TasksScreen() {
  const { user } = useAuthStore();
  const { dailyMissions, weeklyMissions, initialize, incrementProgress, claimReward } =
    useMissionStore();
  const { stats, fetchData: fetchAchievementData } = useAchievementStore();

  useEffect(() => {
    if (user?.id) {
      initialize();
      fetchAchievementData(user.id);
    }
  }, [user?.id]);

  const completedToday = dailyMissions.filter((m) => m.is_claimed).length;
  const totalDaily = dailyMissions.length;
  const completedWeekly = weeklyMissions.filter((m) => m.is_claimed).length;
  const totalWeekly = weeklyMissions.length;

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <Text style={styles.headerTitle}>QUEST BOARD</Text>
            <Text style={styles.headerSubtitle}>Complete missions to grow stronger</Text>
          </Animated.View>

          {/* ── Summary Cards ── */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.summaryRow}>
            <StatCard
              compact
              icon="📋"
              label="DAILY"
              style={styles.summaryCard}
              value={`${completedToday}/${totalDaily}`}
            />
            <StatCard
              compact
              icon="📅"
              label="WEEKLY"
              style={styles.summaryCard}
              value={`${completedWeekly}/${totalWeekly}`}
            />
            <StatCard
              compact
              icon="🔥"
              label="STREAK"
              style={styles.summaryCard}
              value={stats?.current_streak || 0}
            />
          </Animated.View>

          {/* ── Daily Missions ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
            <SectionHeader title="Daily Missions" />
            {dailyMissions.length === 0 ? (
              <GlassCard padding={24} style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>No daily missions available</Text>
                <Text style={styles.emptySubtext}>Check back tomorrow, Hunter</Text>
              </GlassCard>
            ) : (
              dailyMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClaim={claimReward}
                  onSimulateProgress={incrementProgress}
                />
              ))
            )}
          </Animated.View>

          {/* ── Weekly Missions ── */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
            <SectionHeader title="Weekly Missions" />
            {weeklyMissions.length === 0 ? (
              <GlassCard padding={24} style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>No weekly missions available</Text>
                <Text style={styles.emptySubtext}>New missions drop every Monday</Text>
              </GlassCard>
            ) : (
              weeklyMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClaim={claimReward}
                  onSimulateProgress={incrementProgress}
                />
              ))
            )}
          </Animated.View>

          {/* ── Completed Missions ── */}
          {completedToday > 0 && (
            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
              <SectionHeader title="Completed Today" />
              {dailyMissions
                .filter((m) => m.is_claimed)
                .map((mission) => (
                  <MissionCard
                    key={`completed-${mission.id}`}
                    mission={mission}
                    onClaim={() => {}}
                    onSimulateProgress={() => {}}
                  />
                ))}
            </Animated.View>
          )}

          {/* ── Future Workout Programs ── */}
          <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.section}>
            <SectionHeader title="Workout Programs" />
            <GlassCard padding={24} style={styles.placeholderCard}>
              <Text style={styles.placeholderEmoji}>🏋️</Text>
              <Text style={styles.placeholderTitle}>Coming Soon</Text>
              <Text style={styles.placeholderSubtext}>
                Structured weekly training programs tailored to your goal.
              </Text>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.void,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 56,
    paddingBottom: 120,
  },

  // ── Header ──
  header: {
    marginBottom: spacing.sectionGap,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 34,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },

  // ── Summary Row ──
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sectionGap,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 9,
    color: colors.text.muted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 22,
    color: colors.text.primary,
  },
  summaryTotal: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 14,
    color: colors.text.muted,
  },
  summarySubtext: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },

  // ── Sections ──
  section: {
    marginBottom: spacing.sectionGap,
  },
  sectionTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.componentSm,
    paddingLeft: spacing[2] + 3,
    borderLeftWidth: 3,
    borderLeftColor: colors.purple.neon,
  },

  // ── Empty State ──
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
    fontSize: 15,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.muted,
  },

  // ── Placeholder State ──
  placeholderCard: {
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.2)',
    backgroundColor: 'rgba(20, 15, 30, 0.6)',
  },
  placeholderEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  placeholderTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.purple[300],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  placeholderSubtext: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
