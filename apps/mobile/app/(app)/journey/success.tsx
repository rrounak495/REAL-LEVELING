import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useJourneyStore } from '@/store/journey.store';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function JourneySuccessScreen() {
  const router = useRouter();
  const { activeJourney, todaysObjective } = useJourneyStore();
  const [xpGained] = useState(() => Math.floor(Math.random() * 100) + 150); // Simulated XP

  const handleReturnHome = () => {
    router.replace('/(app)/(tabs)/');
  };

  if (!activeJourney || !todaysObjective) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Button onPress={handleReturnHome}>RETURN HOME</Button>
        </View>
      </ScreenContainer>
    );
  }

  const isBoss = todaysObjective.day_type === 'boss';

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <Animated.Text entering={ZoomIn.delay(200).springify()} style={styles.successEmoji}>
            {isBoss ? '👑' : '✨'}
          </Animated.Text>
          <Text style={styles.successTitle}>{isBoss ? 'BOSS DEFEATED' : 'OBJECTIVE COMPLETE'}</Text>
          <Text style={styles.successSubtitle}>The System acknowledges your progress.</Text>
        </Animated.View>

        {/* Rewards Section */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <GlassCard padding={24} style={styles.card}>
            <Text style={styles.sectionTitle}>REWARDS ACQUIRED</Text>

            <View style={styles.rewardRow}>
              <View style={styles.rewardIconBg}>
                <Text style={styles.rewardIcon}>⚡</Text>
              </View>
              <View style={styles.rewardTextContainer}>
                <Text style={styles.rewardName}>Experience Points</Text>
                <Text style={styles.rewardValue}>+{xpGained} XP</Text>
              </View>
            </View>

            {isBoss && (
              <View style={styles.rewardRow}>
                <View
                  style={[
                    styles.rewardIconBg,
                    {
                      backgroundColor: 'rgba(255, 0, 85, 0.1)',
                      borderColor: colors.semantic.dangerNeon,
                    },
                  ]}
                >
                  <Text style={styles.rewardIcon}>🩸</Text>
                </View>
                <View style={styles.rewardTextContainer}>
                  <Text style={styles.rewardName}>Boss Core</Text>
                  <Text style={[styles.rewardValue, { color: colors.semantic.dangerNeon }]}>
                    +1 Item
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>JOURNEY PROGRESS</Text>
              <Text style={styles.progressValue}>
                DAY {activeJourney.current_day} / {activeJourney.duration_days}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.round((activeJourney.current_day / activeJourney.duration_days) * 100)}%`,
                  },
                ]}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Next Day Preview */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={{ marginTop: 16 }}>
          <Text style={[styles.sectionTitle, { marginLeft: 16, marginBottom: 8 }]}>
            NEXT DAY PREVIEW
          </Text>
          <GlassCard padding={16} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.rewardIconBg, { width: 40, height: 40, borderRadius: 20 }]}>
              <Text style={{ fontSize: 16 }}>📅</Text>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{
                  fontFamily: fontFamily.inter.semiBold,
                  color: colors.text.primary,
                  fontSize: 16,
                }}
              >
                Day {activeJourney.current_day + 1}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.inter.regular,
                  color: colors.text.muted,
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Objective details locked until tomorrow.
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      {/* Return Home CTA */}
      <View style={styles.footer}>
        <Button
          size="lg"
          style={{ backgroundColor: colors.purple[600] }}
          onPress={handleReturnHome}
        >
          RETURN HOME
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 80,
    paddingBottom: 140,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.semantic.success,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  card: {
    borderColor: colors.purple[500],
    borderWidth: 1,
    backgroundColor: 'rgba(20, 15, 30, 0.8)',
  },
  sectionTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
    marginBottom: 16,
  },
  rewardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  rewardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderWidth: 1,
    borderColor: colors.purple[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIcon: { fontSize: 24 },
  rewardTextContainer: { marginLeft: 16 },
  rewardName: { fontFamily: fontFamily.inter.semiBold, fontSize: 16, color: colors.text.primary },
  rewardValue: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 18,
    color: colors.purple.neon,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    marginVertical: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  progressValue: { fontFamily: fontFamily.mono.semiBold, fontSize: 14, color: colors.text.primary },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.semantic.success, borderRadius: 4 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.screenHorizontal + 20,
    backgroundColor: 'rgba(5, 2, 10, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});
