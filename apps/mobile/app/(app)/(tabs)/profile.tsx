/**
 * app/(app)/(tabs)/profile.tsx — Hunter Passport
 * Sprint 10: Hunter Life Engine
 */
import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { useAuthStore } from '@/store/auth.store';
import { useProgressionStore } from '@/store/progression.store';
import { useAvatarStore } from '@/store/avatar.store';
import { useLifeStore } from '@/store/life.store';
import { useJourneyStore } from '@/store/journey.store';
import { useGuildStore } from '@/store/guild.store';
import { colors, fontFamily, radius, spacing } from '@theme';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();

  const { currentLevel, currentRank } = useProgressionStore();
  const { currentStage, fetchAvatarData } = useAvatarStore();
  const { activeJourney } = useJourneyStore();
  const { passport, statistics, initializeLifeEngine } = useLifeStore();
  const { activeGuild, fetchGuildData } = useGuildStore();

  useEffect(() => {
    if (user?.id) {
      fetchAvatarData(user.id, currentLevel);
      initializeLifeEngine(user.id);
      fetchGuildData(user.id);
    }
  }, [user?.id, currentLevel]);

  const statCardWidth = (width - 40 - 12) / 2;

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.toLocaleString('default', { month: 'short' }).toUpperCase()} ${d.getFullYear()}`;
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HUNTER PASSPORT ── */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.passportContainer}>
            <GlassCard padding={0} style={styles.passportCard}>
              {/* Header / ID */}
              <View style={styles.passportHeader}>
                <Text style={styles.passportTitle}>HUNTER PASSPORT</Text>
                <Text style={styles.passportId}>{passport.hunterId}</Text>
              </View>

              <View style={styles.passportBody}>
                {/* Left: Avatar */}
                <View style={styles.passportAvatarCol}>
                  <View style={styles.avatarWrapper}>
                    <AvatarDisplay />
                  </View>
                  <Text style={styles.rankText}>{currentRank}</Text>
                  <Text style={styles.evoStage}>{currentStage?.stage_name || 'Awakened'}</Text>
                </View>

                {/* Right: Details */}
                <View style={styles.passportDetailsCol}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>LEVEL</Text>
                    <Text style={styles.detailValue}>{currentLevel}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>TITLE</Text>
                    <Text style={styles.detailValue}>{passport.lifetimeTitle}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ACTIVE JOURNEY</Text>
                    <Text style={styles.detailValue}>
                      {activeJourney
                        ? (activeJourney.journey_type ?? '').replace('_', ' ').toUpperCase()
                        : 'NONE'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>GUILD</Text>
                    <Text style={styles.detailValue}>
                      {activeGuild ? activeGuild.name.toUpperCase() : 'NONE'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>REGION</Text>
                    <Text style={styles.detailValue}>{passport.region}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>HUNTER SINCE</Text>
                    <Text style={styles.detailValue}>{formatDate(passport.hunterSince)}</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* ── LIFE STATISTICS ── */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>LIFE STATISTICS</Text>

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { width: statCardWidth }]}>
                <Text style={styles.statBoxLabel}>JOURNEY DAYS</Text>
                <Text style={styles.statBoxValue}>{statistics.totalJourneyDays}</Text>
              </View>
              <View style={[styles.statBox, { width: statCardWidth }]}>
                <Text style={styles.statBoxLabel}>BOSSES DEFEATED</Text>
                <Text style={styles.statBoxValue}>{statistics.totalBossesDefeated}</Text>
              </View>
              <View style={[styles.statBox, { width: statCardWidth }]}>
                <Text style={styles.statBoxLabel}>TRAINING TIME</Text>
                <Text style={styles.statBoxValue}>
                  {Math.floor(statistics.lifetimeTrainingTimeMinutes / 60)}h
                </Text>
              </View>
              <View style={[styles.statBox, { width: statCardWidth }]}>
                <Text style={styles.statBoxLabel}>RECORDS (PR)</Text>
                <Text style={styles.statBoxValue}>{statistics.personalRecordsCount}</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── HUNTER HISTORY (Links) ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>HUNTER HISTORY</Text>

            <Link asChild href="/trophy-room">
              <Pressable style={styles.historyLink}>
                <GlassCard padding={16} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyIcon}>🏆</Text>
                    <View style={styles.historyTextContainer}>
                      <Text style={styles.historyTitle}>Trophy Room</Text>
                      <Text style={styles.historyDesc}>View achievements, badges, and titles</Text>
                    </View>
                    <Text style={styles.historyArrow}>→</Text>
                  </View>
                </GlassCard>
              </Pressable>
            </Link>

            <Link asChild href="/memory-vault">
              <Pressable style={styles.historyLink}>
                <GlassCard padding={16} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyIcon}>🗄️</Text>
                    <View style={styles.historyTextContainer}>
                      <Text style={styles.historyTitle}>Memory Vault</Text>
                      <Text style={styles.historyDesc}>
                        Archives, completed journeys, and reports
                      </Text>
                    </View>
                    <Text style={styles.historyArrow}>→</Text>
                  </View>
                </GlassCard>
              </Pressable>
            </Link>

            <Link asChild href="/timeline">
              <Pressable style={styles.historyLink}>
                <GlassCard padding={16} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyIcon}>📜</Text>
                    <View style={styles.historyTextContainer}>
                      <Text style={styles.historyTitle}>Lifetime Timeline</Text>
                      <Text style={styles.historyDesc}>Chronological history and Hunter Diary</Text>
                    </View>
                    <Text style={styles.historyArrow}>→</Text>
                  </View>
                </GlassCard>
              </Pressable>
            </Link>
          </Animated.View>
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

  passportContainer: { marginBottom: 32 },
  passportCard: {
    backgroundColor: 'rgba(20, 15, 30, 0.9)',
    borderWidth: 2,
    borderColor: colors.purple[500],
    overflow: 'hidden',
  },
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.purple[900],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.purple[500],
  },
  passportTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 18,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  passportId: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },

  passportBody: { flexDirection: 'row', padding: 16 },
  passportAvatarCol: { width: 100, alignItems: 'center', marginRight: 16 },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: colors.purple[500],
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 14,
    color: colors.purple[300],
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  evoStage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  passportDetailsCol: { flex: 1, justifyContent: 'space-between' },
  detailRow: { marginBottom: 8 },
  detailLabel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  detailValue: { fontFamily: fontFamily.inter.bold, fontSize: 14, color: colors.text.primary },

  section: { marginBottom: 32 },
  sectionTitle: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 3,
    marginBottom: 16,
    marginLeft: 8,
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  statBoxLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  statBoxValue: { fontFamily: fontFamily.exo2.bold, fontSize: 24, color: colors.text.primary },

  historyLink: { marginBottom: 12 },
  historyCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyIcon: { fontSize: 28, marginRight: 16 },
  historyTextContainer: { flex: 1 },
  historyTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  historyDesc: { fontFamily: fontFamily.inter.regular, fontSize: 12, color: colors.text.muted },
  historyArrow: { fontFamily: fontFamily.inter.bold, color: colors.purple.neon, fontSize: 20 },
});
