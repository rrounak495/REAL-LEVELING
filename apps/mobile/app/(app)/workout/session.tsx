import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  Easing,
  useSharedValue,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/store/session.store';
import { useAuthStore } from '@/store/auth.store';
import { useJourneyStore } from '@/store/journey.store';
import { WorkoutIntegrationService } from '@/features/workout/services/WorkoutIntegrationService';
import { colors, fontFamily, spacing, radius } from '@theme';

const { width } = Dimensions.get('window');

export default function ActiveWorkoutSessionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { todaysObjective } = useJourneyStore();
  const {
    status,
    missionName,
    exercises,
    currentExerciseIndex,
    restTimeRemaining,
    decrementRestTimer,
    completeExercise,
    skipExercise,
    skipRest,
    endSession,
    resetSession,
    workoutLog,
  } = useSessionStore();

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'resting' && restTimeRemaining > 0) {
      interval = setInterval(() => {
        decrementRestTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, restTimeRemaining, decrementRestTimer]);

  // Handle Workout Completion
  useEffect(() => {
    if (status === 'completed') {
      const finalizeWorkout = async () => {
        if (user?.id) {
          // Determine if it's a boss day
          const isBossDay = todaysObjective?.day_type === 'boss';
          const result = await WorkoutIntegrationService.completeSession(
            user.id,
            isBossDay,
            workoutLog,
          );

          // Log XP & route to success
          console.log('Workout Result:', result);
          resetSession();
          router.replace('/journey/success');
        }
      };
      finalizeWorkout();
    }
  }, [status]);

  if (!currentExercise || status === 'idle' || status === 'completed') {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.loadingText}>INITIALIZING SESSION...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const progressPercentage = (currentExerciseIndex / exercises.length) * 100;

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      {/* Top Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.progressHeader}>
          <Text style={styles.missionTitle}>{missionName}</Text>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} / {exercises.length}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {status === 'resting' ? (
          /* REST STATE */
          <Animated.View entering={FadeInDown.duration(400)} style={styles.restContainer}>
            <Text style={styles.restTitle}>REST</Text>
            <Text style={styles.restTimer}>{restTimeRemaining}</Text>
            <Text style={styles.restSubtitle}>Breathe. Lower your heart rate.</Text>

            <GlassCard padding={24} style={styles.upNextCard}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextExercise}>
                {exercises[currentExerciseIndex + 1]?.name || 'Mission Complete'}
              </Text>
            </GlassCard>

            <Button
              size="lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 40 }}
              onPress={skipRest}
            >
              SKIP REST
            </Button>
          </Animated.View>
        ) : (
          /* EXERCISE STATE */
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Media Placeholder */}
            <View style={styles.mediaContainer}>
              <Image source={{ uri: currentExercise.thumbnailUrl }} style={styles.mediaImage} />
              {currentExercise.aiVerificationSupported && (
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>🤖 AI READY</Text>
                </View>
              )}
            </View>

            <View style={styles.exerciseInfoContainer}>
              <Text style={styles.categoryBadge}>{currentExercise.category.toUpperCase()}</Text>
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>

              <View style={styles.targetRow}>
                {currentExercise.reps ? (
                  <View style={styles.targetBox}>
                    <Text style={styles.targetValue}>{currentExercise.reps}</Text>
                    <Text style={styles.targetLabel}>REPS</Text>
                  </View>
                ) : null}
                {currentExercise.durationSeconds ? (
                  <View style={styles.targetBox}>
                    <Text style={styles.targetValue}>{currentExercise.durationSeconds}s</Text>
                    <Text style={styles.targetLabel}>DURATION</Text>
                  </View>
                ) : null}
                {currentExercise.sets ? (
                  <View style={styles.targetBox}>
                    <Text style={styles.targetValue}>{currentExercise.sets}</Text>
                    <Text style={styles.targetLabel}>SETS</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.instructionTitle}>HOW TO PERFORM</Text>
              {currentExercise.instructions.map((inst, i) => (
                <View key={i} style={styles.instructionRow}>
                  <Text style={styles.instructionDot}>•</Text>
                  <Text style={styles.instructionText}>{inst}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Controls */}
      {status !== 'resting' && (
        <View style={styles.bottomControls}>
          <Pressable style={styles.skipButton} onPress={skipExercise}>
            <Text style={styles.skipButtonText}>SKIP</Text>
          </Pressable>

          <Button
            size="lg"
            style={{ flex: 1, backgroundColor: colors.semantic.success }}
            onPress={() => completeExercise()}
          >
            COMPLETE
          </Button>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: fontFamily.mono.regular, color: colors.text.muted, letterSpacing: 2 },

  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 16,
    backgroundColor: 'rgba(5,2,10,0.9)',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.cyan.neon },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  missionTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressText: { fontFamily: fontFamily.mono.semiBold, fontSize: 12, color: colors.cyan.neon },

  scrollContent: { paddingBottom: 120 },

  mediaContainer: {
    width: '100%',
    height: 280,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
  },
  mediaImage: { width: '100%', height: '100%', opacity: 0.8 },
  aiBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  aiBadgeText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.cyan.neon,
    letterSpacing: 1,
  },

  exerciseInfoContainer: { padding: spacing.screenHorizontal, paddingTop: 24 },
  categoryBadge: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.purple.neon,
    letterSpacing: 2,
    marginBottom: 8,
  },
  exerciseName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    letterSpacing: 1,
    marginBottom: 24,
  },

  targetRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  targetBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  targetValue: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 4,
  },
  targetLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1,
  },

  instructionTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.secondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  instructionRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 16 },
  instructionDot: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: colors.cyan.neon,
    marginRight: 12,
  },
  instructionText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },

  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.screenHorizontal + 20,
    backgroundColor: 'rgba(5, 2, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    gap: 16,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: colors.text.secondary,
    letterSpacing: 1,
  },

  // Rest state
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: spacing.screenHorizontal,
  },
  restTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 16,
    color: colors.text.muted,
    letterSpacing: 4,
    marginBottom: 16,
  },
  restTimer: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 80,
    color: colors.cyan.neon,
    marginBottom: 8,
  },
  restSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 60,
  },
  upNextCard: { width: '100%', alignItems: 'center', borderColor: 'rgba(139, 60, 247, 0.2)' },
  upNextLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.purple.neon,
    letterSpacing: 2,
    marginBottom: 8,
  },
  upNextExercise: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: 1,
  },
});
