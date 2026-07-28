import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useJourneyStore } from '@/store/journey.store';
import { JourneyGenerationService } from '@/features/journey/services/JourneyGenerationService';
import { useSessionStore } from '@/store/session.store';
import { getWorkoutForMission } from '@/features/workout/data/exerciseLibrary';
import { colors, fontFamily, spacing } from '@theme';

export default function JourneyTodayScreen() {
  const router = useRouter();
  const { activeJourney, todaysObjective, isLoading } = useJourneyStore();
  const startSession = useSessionStore((state) => state.startSession);
  if (isLoading || !activeJourney) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          {/* Lightweight skeleton loading state */}
          <ActivityIndicator color={colors.purple[500]} />
          <Text
            style={{ fontFamily: fontFamily.mono.regular, color: colors.text.muted, marginTop: 16 }}
          >
            INITIALIZING MISSION PROTOCOL...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Error recovery state if objective failed to load
  if (!todaysObjective) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>⚠️</Text>
          <Text
            style={{
              fontFamily: fontFamily.rajdhani.bold,
              fontSize: 24,
              color: colors.semantic.dangerNeon,
              marginBottom: 8,
            }}
          >
            MISSION DATA CORRUPTED
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.inter.regular,
              color: colors.text.secondary,
              textAlign: 'center',
              paddingHorizontal: 32,
              marginBottom: 32,
            }}
          >
            The System failed to retrieve today's objective. Please recalibrate to retry.
          </Text>
          <Button
            size="lg"
            style={{ backgroundColor: colors.purple[600] }}
            onPress={() => router.replace('/(app)/(tabs)/')}
          >
            RECALIBRATE (RETURN HOME)
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  const isBoss = todaysObjective.day_type === 'boss';
  const isRecovery = todaysObjective.day_type === 'recovery';

  const handleStartNow = () => {
    const exercises = getWorkoutForMission(todaysObjective.mission_ids);
    const missionName = isBoss ? 'BOSS TRIAL' : isRecovery ? 'ACTIVE RECOVERY' : 'DAILY WORKOUT';
    startSession(missionName, exercises);
    router.replace('/workout/session');
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.journeyType}>
            {(activeJourney.journey_type ?? '').replace('_', ' ').toUpperCase()} JOURNEY
          </Text>
          <Text style={styles.chapterName}>
            {JourneyGenerationService.generateChapterName(
              Math.ceil(activeJourney.current_day / 7),
              activeJourney.journey_type ?? '',
            ).toUpperCase()}
          </Text>
          <Text style={styles.dayProgress}>
            DAY {activeJourney.current_day} OF {activeJourney.duration_days}
          </Text>
        </Animated.View>

        {/* Objective Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard
            padding={32}
            style={[
              styles.objectiveCard,
              isBoss && { borderColor: colors.semantic.dangerNeon },
              isRecovery && { borderColor: colors.cyan.neon },
            ]}
          >
            {/* Visual Icon */}
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 48 }}>{isBoss ? '💀' : isRecovery ? '🧘' : '⚡'}</Text>
            </View>

            {/* Objective Title */}
            <Text
              style={[
                styles.objectiveTitle,
                isBoss && { color: colors.semantic.dangerNeon },
                isRecovery && { color: colors.cyan.neon },
              ]}
            >
              {isBoss ? 'BOSS TRIAL' : isRecovery ? 'ACTIVE RECOVERY' : 'DAILY WORKOUT'}
            </Text>

            {/* System Story */}
            <Text style={styles.storyText}>"SYSTEM: {todaysObjective.story_text}"</Text>

            <View style={styles.divider} />

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>ESTIMATED TIME</Text>
                <Text style={styles.statValue}>~30 MIN</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>DIFFICULTY</Text>
                <Text style={styles.statValue}>MEDIUM</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Reward Preview */}
            <View style={styles.rewardContainer}>
              <Text style={styles.statLabel}>EXPECTED REWARD</Text>
              <Text style={styles.rewardValue}>+200 XP • Journey Progress</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Map Link (Secondary) */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Pressable onPress={() => router.push('/journey/map')}>
            <Text
              style={{
                fontFamily: fontFamily.inter.semiBold,
                color: colors.text.muted,
                fontSize: 14,
              }}
            >
              VIEW JOURNEY MAP
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Uncompeted Primary CTA */}
      <View style={styles.footer}>
        <Button
          size="lg"
          style={Object.assign(
            {},
            styles.ctaButton,
            isBoss && {
              backgroundColor: colors.semantic.danger,
              shadowColor: colors.semantic.danger,
            },
            isRecovery && { backgroundColor: 'rgba(0,255,255,0.2)', shadowColor: colors.cyan.neon },
          )}
          onPress={handleStartNow}
        >
          START NOW
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  journeyType: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.purple[400],
    letterSpacing: 3,
    marginBottom: 8,
  },
  chapterName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 36,
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  dayProgress: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 14,
    color: colors.text.muted,
  },
  objectiveCard: {
    alignItems: 'center',
    borderColor: colors.purple[500],
    borderWidth: 2,
    backgroundColor: 'rgba(20, 15, 30, 0.8)',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  objectiveTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 28,
    color: colors.purple[300],
    letterSpacing: 2,
    marginBottom: 12,
  },
  storyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  rewardContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  rewardValue: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 16,
    color: colors.semantic.success,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.screenHorizontal + 20, // Tab bar padding area
    backgroundColor: 'rgba(5, 2, 10, 0.9)', // Void color with opacity
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  ctaButton: {
    backgroundColor: colors.purple[600],
    shadowColor: colors.purple[500],
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
});
