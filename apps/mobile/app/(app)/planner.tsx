import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useHabitStore } from '@/store/habit.store';
import { useJourneyStore } from '@/store/journey.store';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function PlannerScreen() {
  const router = useRouter();
  const { habits, markHabitCompleted } = useHabitStore();
  const { todaysObjective, todaysObjectiveCompleted } = useJourneyStore();

  const handleHabitPress = (id: string) => {
    if (!habits[id]?.completedAt) {
      markHabitCompleted(id);
    }
  };

  const isCompleted = (id: string) => {
    const habit = habits[id];
    if (!habit?.completedAt) return false;
    // Check if completed today
    return new Date(habit.completedAt).toDateString() === new Date().toDateString();
  };

  const hasSchedule = Object.keys(habits).length > 0 || todaysObjective != null;

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </Pressable>
        <Text style={styles.headerTitle}>DAILY PLANNER</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasSchedule ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🗓️</Text>
            <Text
              style={{
                fontFamily: fontFamily.rajdhani.bold,
                fontSize: 24,
                color: colors.text.primary,
                marginBottom: 8,
              }}
            >
              SCHEDULE EMPTY
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.inter.regular,
                fontSize: 14,
                color: colors.text.secondary,
                textAlign: 'center',
                marginBottom: 32,
                paddingHorizontal: 20,
              }}
            >
              Your daily schedule has not been generated yet. Begin your journey to populate your
              objectives.
            </Text>
            <Button
              size="lg"
              style={{ backgroundColor: colors.purple.neon } as any}
              onPress={() => router.push('/journey' as any)}
            >
              <Text style={{ fontFamily: fontFamily.inter.bold, color: '#000' }}>
                START JOURNEY
              </Text>
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.timeLabel}>MORNING</Text>
              <Pressable onPress={() => handleHabitPress('morning_hydration')}>
                <GlassCard
                  padding={20}
                  style={[
                    styles.taskCard,
                    isCompleted('morning_hydration') && styles.taskCompleted,
                  ]}
                >
                  <View style={styles.taskHeader}>
                    <Text style={{ fontSize: 24, marginRight: 16 }}>💧</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.taskTitle,
                          isCompleted('morning_hydration') && { color: colors.text.muted },
                        ]}
                      >
                        Morning Hydration
                      </Text>
                      <Text style={styles.taskDesc}>Log 500ml of water</Text>
                    </View>
                    {isCompleted('morning_hydration') && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </GlassCard>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.timeLabel}>AFTERNOON</Text>
              <Pressable
                onPress={() => {
                  if (!todaysObjectiveCompleted) {
                    router.push('/journey/today');
                  }
                }}
              >
                <GlassCard
                  padding={20}
                  style={[
                    styles.taskCard,
                    todaysObjectiveCompleted && styles.taskCompleted,
                    { borderColor: colors.purple[500] },
                  ]}
                >
                  <View style={styles.taskHeader}>
                    <Text style={{ fontSize: 24, marginRight: 16 }}>⚔️</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.taskTitle,
                          todaysObjectiveCompleted && { color: colors.text.muted },
                        ]}
                      >
                        {todaysObjective?.day_type === 'boss' ? 'Boss Trial' : 'Daily Workout'}
                      </Text>
                      <Text style={styles.taskDesc}>Core Journey Objective</Text>
                    </View>
                    {todaysObjectiveCompleted && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </GlassCard>
              </Pressable>

              {todaysObjectiveCompleted && (
                <Pressable
                  style={{ marginTop: 12 }}
                  onPress={() => handleHabitPress('afternoon_stretch')}
                >
                  <GlassCard
                    padding={20}
                    style={[
                      styles.taskCard,
                      isCompleted('afternoon_stretch') && styles.taskCompleted,
                    ]}
                  >
                    <View style={styles.taskHeader}>
                      <Text style={{ fontSize: 24, marginRight: 16 }}>🧘</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.taskTitle,
                            isCompleted('afternoon_stretch') && { color: colors.text.muted },
                          ]}
                        >
                          Active Recovery
                        </Text>
                        <Text style={styles.taskDesc}>5-Minute Post-Workout Stretch</Text>
                      </View>
                      {isCompleted('afternoon_stretch') && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                  </GlassCard>
                </Pressable>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.timeLabel}>EVENING</Text>
              <Pressable onPress={() => handleHabitPress('sleep_prep')}>
                <GlassCard
                  padding={20}
                  style={[styles.taskCard, isCompleted('sleep_prep') && styles.taskCompleted]}
                >
                  <View style={styles.taskHeader}>
                    <Text style={{ fontSize: 24, marginRight: 16 }}>🌙</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.taskTitle,
                          isCompleted('sleep_prep') && { color: colors.text.muted },
                        ]}
                      >
                        Sleep Protocol
                      </Text>
                      <Text style={styles.taskDesc}>Prepare for optimal recovery</Text>
                    </View>
                    {isCompleted('sleep_prep') && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </GlassCard>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 16,
  },
  backButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 32,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 32,
  },
  timeLabel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 3,
    marginBottom: 16,
    marginLeft: 8,
  },
  taskCard: {
    backgroundColor: 'rgba(20, 15, 30, 0.4)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  taskCompleted: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  taskDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
  },
  checkMark: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 24,
    color: colors.semantic.success,
    marginLeft: 16,
  },
});
