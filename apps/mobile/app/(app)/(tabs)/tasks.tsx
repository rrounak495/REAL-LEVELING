/**
 * app/(app)/(tabs)/tasks.tsx — Premium Tasks / Mission Management Screen
 *
 * Sprint 1: UI Foundation + Sprint 2: Bottom Sheet
 * Preserves existing header (Quest Board title, subtitle, stat cards).
 * Everything below the header uses the premium segmented tab layout.
 * "+" FAB opens Add Task bottom sheet. Tapping a card opens Edit mode.
 *
 * No persistence. No Supabase. No CRUD. No stores beyond existing.
 * Pure premium UI foundation matching the approved reference design.
 */
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  LinearTransition,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatCard } from '@/components/ui/StatCard';
import {
  TaskTabs,
  TaskSectionHeader,
  TaskCard,
  TaskBottomSheet,
  type TaskTabKey,
  type TaskCardData,
} from '@/components/tasks';
import { useTaskStore, getTaskDisplayTime, getTaskDisplayRepeat } from '@/store/task.store';
import { type CustomTask } from '@/types/task.types';
import { useMissionStore } from '@/store/mission.store';
import { useAchievementStore } from '@/store/achievement.store';
import { useAuthStore } from '@/store/auth.store';

import { useLiveProgress } from '@/features/progress/hooks/useLiveProgress';
import { colors, fontFamily, spacing, radius } from '@theme';


// Helper to convert CustomTask to TaskCardData format for the UI
function mapTaskToCardData(task: CustomTask): TaskCardData {
  const displayTime = getTaskDisplayTime(task);
  const completedAtTime = task.completedAt
    ? new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return {
    id: task.id,
    title: task.title,
    xp: task.xp,
    ...(displayTime ? { time: displayTime } : {}),
    repeat: getTaskDisplayRepeat(task),
    isCompleted: task.completed,
    ...(completedAtTime ? { completedAt: completedAtTime } : {}),
  };
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function TasksScreen() {
  const { user } = useAuthStore();
  const { initialize } = useMissionStore();
  const { stats, fetchData: fetchAchievementData } = useAchievementStore();

  useEffect(() => {
    if (user?.id) {
      initialize();
      fetchAchievementData(user.id);
    }
  }, [user?.id]);
  // ── Live Progress Hook (Sprint 5) ──
  const liveProgress = useLiveProgress();

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState<TaskTabKey>('mytasks');


  const allTasks = useTaskStore((s) => s.tasks);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const processDailyReset = useTaskStore((s) => s.processDailyReset);

  const currentDayOfWeek = new Date().getDay();
  const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
  const todayStr = new Date().toLocaleDateString();

  const pendingTasks = allTasks.filter((t) => {
    if ((t as any).isDeleted) return false;
    if (t.completed) return false;
    if (t.repeat === 'weekdays' && !isWeekday) return false;
    return true;
  });

  const completedTasks = allTasks.filter((t) => {
    if ((t as any).isDeleted) return false;
    if (!t.completed) return false;
    if (!t.completedAt) return false;
    const completedDateStr = new Date(t.completedAt).toLocaleDateString();
    return completedDateStr === todayStr;
  });

  // ── Auto Reset ──
  useEffect(() => {
    processDailyReset();
  }, [processDailyReset]);

  // ── Bottom Sheet State (Sprint 2 & 3) ──
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editTask, setEditTask] = useState<CustomTask | null>(null);

  const handleAddPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditTask(null);
    setSheetVisible(true);
  }, []);

  // ── Progress Bar Animation ──
  const progressAnimStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${liveProgress.completionPercentage}%`, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  const handleTaskEdit = useCallback(
    (taskId: string) => {
      const found = allTasks.find((t) => t.id === taskId);
      if (found) {
        setEditTask(found);
        setSheetVisible(true);
      }
    },
    [allTasks],
  );

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleComplete(taskId);
    },
    [toggleComplete],
  );



  const handleSheetClose = useCallback(() => {
    setSheetVisible(false);
    setEditTask(null);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ EXISTING HEADER — PRESERVED EXACTLY ═══ */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>QUEST BOARD</Text>
                <Text style={styles.headerSubtitle}>{liveProgress.headerCaption}</Text>
              </View>

            </View>
          </Animated.View>

          {/* ═══ HEADER PROGRESS BAR (Sprint 5) ═══ */}
          <Animated.View
            entering={FadeInDown.delay(50).duration(500)}
            style={styles.progressBarContainer}
          >
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, progressAnimStyle]} />
            </View>
          </Animated.View>

          {/* ═══ EXISTING SUMMARY CARDS — PRESERVED EXACTLY ═══ */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.summaryRow}>
            <StatCard
              compact
              icon="📋"
              label="DAILY"
              style={styles.summaryCard}
              value={`${liveProgress.completedToday}/${liveProgress.totalToday}`}
            />
            <StatCard
              compact
              icon="📅"
              label="WEEKLY"
              style={styles.summaryCard}
              value={`${liveProgress.completedWeekly}/${liveProgress.totalWeekly}`}
            />
            <StatCard
              compact
              icon="🔥"
              label="STREAK"
              style={styles.summaryCard}
              value={liveProgress.currentStreak}
            />
          </Animated.View>

          {/* ═══ NEW: SEGMENTED TABS ═══ */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.tabsContainer}
          >
            <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </Animated.View>

          {/* ═══ TAB CONTENT ═══ */}
          <Animated.View
            key={activeTab}
            entering={FadeInDown.duration(300).delay(100)}
            style={styles.contentContainer}
          >


            {activeTab === 'mytasks' && (
              <View style={styles.listContainer}>
                <TaskSectionHeader title="MY TASKS" />
                <Animated.FlatList
                  ListEmptyComponent={
                    <View style={styles.premiumEmptyState}>
                      <Text style={styles.emptyIcon}>📜</Text>
                      <Text style={styles.emptyTitle}>NO ACTIVE QUESTS</Text>
                      <Text style={styles.emptyDescription}>
                        Your quest log is empty. Tap the + button to assign yourself a new
                        objective.
                      </Text>
                    </View>
                  }
                  data={pendingTasks}
                  itemLayoutAnimation={LinearTransition.springify().damping(20)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TaskCard
                      task={mapTaskToCardData(item)}
                      onPress={handleTaskEdit}
                      onToggle={handleTaskToggle}
                    />
                  )}
                  scrollEnabled={false}
                />
              </View>
            )}

            {activeTab === 'completed' && (
              <View>
                {/* ═══ COMPLETED DASHBOARD SUMMARY ═══ */}
                <View style={styles.dashboardSummary}>
                  <Text style={styles.dashboardTitle}>TODAY'S PROGRESS</Text>
                  <View style={styles.dashboardGrid}>
                    <View style={styles.dashboardMetric}>
                      <Text style={styles.dashboardMetricValue}>{completedTasks.length}</Text>
                      <Text style={styles.dashboardMetricLabel}>Tasks</Text>
                    </View>
                    <View style={styles.dashboardMetric}>
                      <Text style={styles.dashboardMetricValue}>
                        {liveProgress.completedToday - completedTasks.length}
                      </Text>
                      <Text style={styles.dashboardMetricLabel}>Missions</Text>
                    </View>
                    <View style={styles.dashboardMetric}>
                      <Text style={[styles.dashboardMetricValue, { color: colors.purple[300] }]}>
                        +{liveProgress.xpEarnedToday}
                      </Text>
                      <Text style={styles.dashboardMetricLabel}>XP Earned</Text>
                    </View>
                    <View style={styles.dashboardMetric}>
                      <Text
                        style={[styles.dashboardMetricValue, { color: colors.semantic.success }]}
                      >
                        {Math.round(liveProgress.completionPercentage)}%
                      </Text>
                      <Text style={styles.dashboardMetricLabel}>Completion</Text>
                    </View>
                  </View>
                </View>

                <TaskSectionHeader title="COMPLETED ITEMS" />
                <Animated.FlatList
                  ListEmptyComponent={
                    <View style={styles.premiumEmptyState}>
                      <Text style={styles.emptyIcon}>⚔️</Text>
                      <Text style={styles.emptyTitle}>THE DAY IS STILL YOUNG</Text>
                      <Text style={styles.emptyDescription}>
                        Every great hunter starts with a single completed mission. Begin your
                        training.
                      </Text>
                    </View>
                  }
                  data={completedTasks}
                  initialNumToRender={10}
                  itemLayoutAnimation={LinearTransition.springify().damping(20)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TaskCard
                      task={mapTaskToCardData(item)}
                      onPress={handleTaskEdit}
                      onToggle={handleTaskToggle}
                    />
                  )}
                  scrollEnabled={false}
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* ═══ FAB "+" Button (Absolute) ═══ */}
        <View style={styles.fabContainer}>
          <Pressable
            accessibilityLabel="Add new task"
            accessibilityRole="button"
            style={styles.fab}
            onPress={handleAddPress}
          >
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>
        </View>

        {/* ═══ BOTTOM SHEET (Sprint 2) ═══ */}
        <TaskBottomSheet editTask={editTask} visible={sheetVisible} onClose={handleSheetClose} />
      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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

  // ── Header (Preserved) ──
  header: {
    marginBottom: spacing.sectionGap,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
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

  // ── Summary Row (Preserved) ──
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

  // ── Header Progress Bar (Sprint 5) ──
  progressBarContainer: {
    marginBottom: spacing.sectionGap,
    paddingHorizontal: 4,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.semantic.success,
    borderRadius: 3,
  },

  // ── Tabs ──
  tabsContainer: {
    marginBottom: spacing.sectionGap,
  },

  // ── Content ──
  contentContainer: {
    // Content flows naturally below tabs
  },
  listContainer: {
    paddingBottom: spacing.screenVertical,
  },

  // ── Completed Dashboard (Sprint 5) ──
  dashboardSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: spacing.sectionGap,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dashboardTitle: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
    marginBottom: 16,
  },
  dashboardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dashboardMetric: {
    alignItems: 'center',
    gap: 4,
  },
  dashboardMetricValue: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
  },
  dashboardMetricLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.secondary,
  },

  // ── Empty States ──
  emptyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.sectionGap,
  },
  premiumEmptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 18,
    color: colors.text.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── FAB (Sprint 2) ──
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purple[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.purple[400],
  },
  fabIcon: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -1,
  },
});
