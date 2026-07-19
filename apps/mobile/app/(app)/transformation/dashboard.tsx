import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAuthStore } from '@/store/auth.store';
import { useTransformationStore } from '@/store/transformation.store';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function TransformationDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, strengthRecords, lifeStats, fetchTransformationData, isLoading } =
    useTransformationStore();

  useEffect(() => {
    if (user?.id) {
      fetchTransformationData(user.id);
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ fontFamily: fontFamily.mono.regular, color: colors.text.muted }}>
            LOADING TRANSFORMATION DATA...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Placeholder records if none exist for UI demo purposes
  const displayRecords =
    strengthRecords.length > 0
      ? strengthRecords
      : [
          {
            id: '1',
            exercise_key: 'Push-ups',
            value: 45,
            unit: 'reps',
            is_pr: true,
            date: new Date().toISOString(),
          },
          {
            id: '2',
            exercise_key: 'Plank',
            value: 120,
            unit: 'sec',
            is_pr: true,
            date: new Date().toISOString(),
          },
        ];

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headerTitle}>TRANSFORMATION</Text>
          <Text style={styles.headerSubtitle}>Your physical evolution in the real world.</Text>
        </Animated.View>

        {/* Physical Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <SectionHeader title="Physical Baseline" />
          <GlassCard padding={24} style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.label}>STARTING WEIGHT</Text>
                <Text style={styles.value}>{profile?.start_weight || '--'} kg</Text>
              </View>
              <View>
                <Text style={styles.label}>CURRENT WEIGHT</Text>
                <Text style={[styles.value, { color: colors.semantic.success }]}>
                  {profile?.current_weight || '--'} kg
                </Text>
              </View>
              <View>
                <Text style={styles.label}>GOAL WEIGHT</Text>
                <Text style={styles.value}>{profile?.goal_weight || '--'} kg</Text>
              </View>
            </View>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push('/transformation/measurements')}
            >
              <Text style={styles.actionButtonText}>UPDATE MEASUREMENTS</Text>
            </Pressable>
          </GlassCard>
        </Animated.View>

        {/* Strength Evolution */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <SectionHeader title="Strength Evolution (PRs)" />
          {displayRecords.map((record, index) => (
            <GlassCard
              key={record.id || index}
              padding={16}
              style={[styles.card, { marginBottom: 8 }]}
            >
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginRight: 16 }}>💪</Text>
                  <View>
                    <Text style={styles.recordName}>{record.exercise_key}</Text>
                    <Text style={styles.recordDate}>
                      Set on {new Date(record.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.recordValue}>
                    {record.value} {record.unit}
                  </Text>
                  {record.is_pr && <Text style={styles.prBadge}>NEW PR</Text>}
                </View>
              </View>
            </GlassCard>
          ))}
        </Animated.View>

        {/* Lifetime History */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <SectionHeader title="Hunter Life History" />
          <GlassCard padding={24} style={styles.card}>
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>TOTAL WORKOUTS</Text>
                <Text style={styles.value}>{lifeStats?.total_workout_days || 0}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>JOURNEYS CLEARED</Text>
                <Text style={styles.value}>{lifeStats?.journeys_completed || 0}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>BOSSES DEFEATED</Text>
                <Text style={styles.value}>{lifeStats?.bosses_defeated || 0}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>LIFETIME XP</Text>
                <Text style={[styles.value, { color: colors.purple.neon }]}>
                  {lifeStats?.lifetime_xp || 0}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Action Links */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={{ marginTop: 24, gap: 16 }}
        >
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/transformation/photos')}
          >
            <Text style={styles.secondaryButtonText}>📸 PROGRESS PHOTOS</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/transformation/review')}
          >
            <Text style={styles.secondaryButtonText}>📊 SYSTEM REVIEW REPORTS</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: { marginBottom: spacing.sectionGap },
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
  card: { marginBottom: spacing.sectionGap, borderColor: 'rgba(255,255,255,0.05)' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: { fontFamily: fontFamily.mono.semiBold, fontSize: 18, color: colors.text.primary },
  actionButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.purple[500],
  },
  actionButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.purple.neon,
    letterSpacing: 1,
  },
  recordName: { fontFamily: fontFamily.inter.bold, fontSize: 16, color: colors.text.primary },
  recordDate: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
  recordValue: { fontFamily: fontFamily.exo2.bold, fontSize: 20, color: colors.text.primary },
  prBadge: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.semantic.success,
    marginTop: 2,
  },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: { width: '45%', marginBottom: 16 },
  secondaryButton: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
    letterSpacing: 1,
  },
});
