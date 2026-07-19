import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTransformationStore } from '@/store/transformation.store';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function SystemReviewScreen() {
  const router = useRouter();
  const { profile, lifeStats } = useTransformationStore();

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </Pressable>
          <Text style={styles.headerTitle}>SYSTEM REPORT</Text>
          <Text style={styles.headerSubtitle}>
            Your transformation is accelerating. Here is your recent progress.
          </Text>
        </Animated.View>

        {/* Weekly Summary */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <SectionHeader title="Weekly Highlights" />
          <GlassCard padding={24} style={[styles.card, { borderColor: colors.cyan.neon }]}>
            <Text style={styles.systemMessage}>
              "SYSTEM: Exceptional consistency detected. Your strength evolution is accelerating
              beyond initial parameters."
            </Text>

            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>WORKOUTS</Text>
                <Text style={styles.statValue}>4</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>RECOVERY</Text>
                <Text style={styles.statValue}>2</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>NEW PRs</Text>
                <Text style={[styles.statValue, { color: colors.semantic.success }]}>1</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Share-worthy Monthly Report Hook */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <SectionHeader title="Monthly Archives" />
          <GlassCard padding={24} style={[styles.card, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🏆</Text>
            <Text style={styles.monthTitle}>LAST MONTH</Text>
            <Text style={styles.monthDesc}>
              You completed your first Boss encounter and gained 2 levels.
            </Text>
            <Pressable style={styles.shareButton}>
              <Text style={styles.shareButtonText}>SHARE REPORT</Text>
            </Pressable>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: spacing.screenHorizontal, paddingTop: 60, paddingBottom: 60 },
  header: { marginBottom: spacing.sectionGap },
  backButton: { marginBottom: 16 },
  backText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.purple.neon,
    letterSpacing: 1,
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
    lineHeight: 22,
  },
  card: { marginBottom: spacing.sectionGap, borderColor: 'rgba(255,255,255,0.05)' },
  systemMessage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 24,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0, 255, 255, 0.3)',
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  statBox: { alignItems: 'center' },
  statLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: { fontFamily: fontFamily.exo2.bold, fontSize: 24, color: colors.text.primary },
  monthTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.text.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  monthDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shareButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.primary,
    letterSpacing: 1,
  },
});
