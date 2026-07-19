/**
 * app/(app)/(tabs)/index.tsx — Hunter OS Dashboard
 * Sprint 9D: Smart Daily Operating System
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { useProgressionStore } from '@/store/progression.store';
import { useAuthStore } from '@/store/auth.store';
import { useAvatarStore } from '@/store/avatar.store';
import { useBossStore } from '@/store/boss.store';
import { useSystemStore } from '@/store/system.store';
import { useJourneyStore } from '@/store/journey.store';
import { useHabitStore } from '@/store/habit.store';
import { getDayState, getGreeting } from '@/utils/timeContext';
import { colors, fontFamily, radius, spacing } from '@theme';

// System Components
import { DailyBriefing } from '@/components/system/DailyBriefing';
import { SystemMomentOverlay } from '@/components/system/SystemMomentOverlay';
// RankRival mock removed for RC-1.2 stability

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();

  // Stores
  const {
    totalXp,
    currentLevel,
    currentRank,
    coins,
    gems,
    fetchFromRemote: fetchProgression,
  } = useProgressionStore();
  const { fetchAvatarData } = useAvatarStore();
  const { fetchActiveBosses } = useBossStore();
  const { activeJourney, todaysObjective, fetchActiveJourney } = useJourneyStore();
  const { initializeSystem, refreshInsights, nextBestAction } = useSystemStore();

  // Time Context
  const [dayState, setDayState] = useState(getDayState());
  const [greeting, setGreeting] = useState(getGreeting(dayState));

  useEffect(() => {
    const updateTime = () => {
      const state = getDayState();
      setDayState(state);
      setGreeting(getGreeting(state));
    };
    const timer = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Initialization
  useEffect(() => {
    if (user?.id) {
      fetchProgression();
      fetchAvatarData(user.id, currentLevel);
      fetchActiveBosses();
      fetchActiveJourney();
      initializeSystem(user.id).then(() => {
        // Refresh insights with full OS context
        refreshInsights({
          bossState: useBossStore.getState(),
          progressionState: useProgressionStore.getState(),
          socialState: {},
          journeyState: useJourneyStore.getState(),
          habitState: useHabitStore.getState(),
          dayState: getDayState(),
        });
      });
    }
  }, [user?.id, dayState]); // Refresh when dayState changes to push new habits

  const statCardWidth = (width - 40 - 24) / 3;

  return (
    <>
      <StatusBar style="light" />
      <DailyBriefing />
      <SystemMomentOverlay />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hunter OS Header ── */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.heroSection}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <AvatarDisplay />
            <Text style={styles.heroName}>HUNTER</Text>
            <View style={styles.rankPill}>
              <Text style={styles.rankPillText}>
                {currentRank} • LVL {currentLevel}
              </Text>
            </View>
          </Animated.View>

          {/* ── Primary Priority Engine (One Action) ── */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
            {nextBestAction ? (
              <GlassCard
                padding={24}
                style={[
                  styles.priorityCard,
                  nextBestAction.type === 'urgency'
                    ? { borderColor: colors.semantic.dangerNeon }
                    : nextBestAction.type === 'habit'
                      ? { borderColor: colors.cyan.neon }
                      : { borderColor: colors.purple[500] },
                ]}
              >
                <View style={styles.priorityHeader}>
                  <Text style={styles.priorityLabel}>SYSTEM PRIORITY</Text>
                  <Text style={styles.priorityType}>{nextBestAction.type.toUpperCase()}</Text>
                </View>

                <Text
                  style={[
                    styles.priorityTitle,
                    nextBestAction.type === 'urgency' && { color: colors.semantic.dangerNeon },
                    nextBestAction.type === 'habit' && { color: colors.cyan.neon },
                  ]}
                >
                  {nextBestAction.title}
                </Text>

                <Text style={styles.priorityDesc}>"SYSTEM: {nextBestAction.description}"</Text>

                {nextBestAction.actionLabel && (
                  <Button
                    size="lg"
                    style={
                      Object.assign(
                        {},
                        styles.priorityButton,
                        nextBestAction.type === 'urgency'
                          ? { backgroundColor: colors.semantic.danger }
                          : nextBestAction.type === 'habit'
                            ? {
                                backgroundColor: 'rgba(0, 255, 255, 0.2)',
                                borderWidth: 1,
                                borderColor: colors.cyan.neon,
                              }
                            : { backgroundColor: colors.purple[600] },
                      ) as any
                    }
                    onPress={() => router.push(nextBestAction.actionRoute as any)}
                  >
                    {nextBestAction.actionLabel}
                  </Button>
                )}
              </GlassCard>
            ) : (
              /* Fallback if queue is completely empty */
              <GlassCard
                padding={24}
                style={{ alignItems: 'center', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Text style={{ fontSize: 32, marginBottom: 12 }}>🧘</Text>
                <Text
                  style={{
                    fontFamily: fontFamily.rajdhani.bold,
                    fontSize: 24,
                    color: colors.text.primary,
                    marginBottom: 8,
                  }}
                >
                  SYSTEM OPTIMAL
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.inter.regular,
                    fontSize: 14,
                    color: colors.text.secondary,
                    textAlign: 'center',
                  }}
                >
                  All immediate objectives are complete. Rest and recover.
                </Text>
              </GlassCard>
            )}
          </Animated.View>

          {/* ── Hunter Calendar / Planner Widget ── */}
          <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.section}>
            <Pressable onPress={() => router.push('/planner' as any)}>
              <GlassCard padding={16} style={styles.calendarWidget}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>📅</Text>
                    <View>
                      <Text
                        style={{
                          fontFamily: fontFamily.inter.bold,
                          fontSize: 14,
                          color: colors.text.primary,
                        }}
                      >
                        Daily Planner
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.inter.regular,
                          fontSize: 12,
                          color: colors.text.muted,
                        }}
                      >
                        View today's full schedule
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: fontFamily.inter.bold,
                      color: colors.purple.neon,
                      fontSize: 18,
                    }}
                  >
                    →
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* ── Guild Community Widget ── */}
          <Animated.View entering={FadeInDown.delay(175).duration(500)} style={styles.section}>
            <Pressable onPress={() => router.push('/guild' as any)}>
              <GlassCard
                padding={16}
                style={[styles.calendarWidget, { borderColor: colors.purple[500] }]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>🛡️</Text>
                    <View>
                      <Text
                        style={{
                          fontFamily: fontFamily.inter.bold,
                          fontSize: 14,
                          color: colors.text.primary,
                        }}
                      >
                        Hunter Guild
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.inter.regular,
                          fontSize: 12,
                          color: colors.text.muted,
                        }}
                      >
                        Join raids & co-op missions
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: fontFamily.inter.bold,
                      color: colors.purple.neon,
                      fontSize: 18,
                    }}
                  >
                    →
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* ── Stats ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsRow}>
            <StatCard icon="🔥" label="STREAK" style={{ width: statCardWidth }} value={0} />
            <StatCard
              icon="🪙"
              label="COINS"
              style={{ width: statCardWidth }}
              value={coins.toLocaleString()}
              valueColor={colors.text.gold}
            />
            <StatCard
              icon="💎"
              label="GEMS"
              style={{ width: statCardWidth }}
              value={gems}
              valueColor={colors.cyan.neon}
            />
          </Animated.View>

          {/* ── Rank Rival (Social Context) ── */}
          {/* Removed RankRival placeholder as it broke layout on native and was incomplete */}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg.void },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 120,
  },

  heroSection: { alignItems: 'center', marginBottom: spacing.sectionGap },
  greetingText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
    marginBottom: 16,
  },
  heroName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 30,
    color: colors.text.primary,
    letterSpacing: 4,
    marginTop: -4,
  },
  rankPill: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[500],
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginTop: 8,
  },
  rankPillText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.purple[300],
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  section: { marginBottom: spacing.sectionGap },

  priorityCard: { borderWidth: 2, backgroundColor: 'rgba(20, 15, 30, 0.8)' },
  priorityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priorityLabel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
  },
  priorityType: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  priorityTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 26,
    color: colors.purple[300],
    letterSpacing: 1,
    marginBottom: 8,
  },
  priorityDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 24,
    lineHeight: 20,
  },
  priorityButton: { shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },

  calendarWidget: {
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sectionGap,
  },
});
