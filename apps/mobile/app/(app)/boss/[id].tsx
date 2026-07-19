import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors, fontFamily, radius, spacing } from '@theme';
import { useBossStore } from '@/store/boss.store';
import { useAuthStore } from '@/store/auth.store';
import { type ActivitySubmission } from '@/services/DamageCalculationService';

export default function BossBattleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentBoss,
    currentBossPhases,
    currentBossObjectives,
    leaderboard,
    userParticipant,
    isLoading,
    fetchBossDetails,
    subscribeToBoss,
    unsubscribeFromBoss,
    submitDamage,
  } = useBossStore();

  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && user?.id) {
      fetchBossDetails(id as string, user.id);
      subscribeToBoss(id as string);
    }
    return () => {
      unsubscribeFromBoss();
    };
  }, [id, user?.id, fetchBossDetails, subscribeToBoss, unsubscribeFromBoss]);

  useEffect(() => {
    if (currentBossObjectives.length > 0 && !selectedObjectiveId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedObjectiveId(currentBossObjectives[0]?.id || '');
    }
  }, [currentBossObjectives]);

  const handleDevSubmit = async () => {
    if (!user?.id || !currentBoss || !selectedObjectiveId || !amountInput) return;
    const amount = parseInt(amountInput, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    setSubmitting(true);

    const obj = currentBossObjectives.find((o) => o.id === selectedObjectiveId);
    if (!obj) return;

    const submission: ActivitySubmission = {
      activityType: obj.activity_type as any,
      amount,
      objectiveId: obj.id,
      timestamp: Date.now(),
    };

    const success = await submitDamage(user.id, submission);
    setSubmitting(false);

    if (success) {
      setAmountInput('');
      // No alert needed, UI will update real-time
    } else {
      Alert.alert('Error', 'Failed to submit damage.');
    }
  };

  const isDefeated = currentBoss
    ? currentBoss.current_hp <= 0 || currentBoss.status === 'defeated'
    : false;
  const hpPct = currentBoss
    ? Math.max(0, (currentBoss.current_hp / currentBoss.total_hp) * 100)
    : 0;

  const hpBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${isDefeated ? 0 : hpPct}%`, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  if (!currentBoss || (isLoading && !currentBoss)) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.purple[500]} size="large" />
        <Text style={{ color: colors.text.muted, marginTop: 16 }}>Loading Boss Data...</Text>
      </View>
    );
  }

  // Active Phase
  const activePhase = currentBossPhases
    .filter((p) => hpPct <= p.hp_threshold_pct)
    .sort((a, b) => a.hp_threshold_pct - b.hp_threshold_pct)[0];

  const phaseName = activePhase ? activePhase.phase_name : 'Phase 1';
  const isEnraged = activePhase?.visual_state === 'enraged';

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← Retreat</Text>
            </Pressable>
            <View style={styles.participantBadge}>
              <Text style={styles.participantText}>👁️ {leaderboard.length} Hunters</Text>
            </View>
          </View>

          {/* Cinematic Boss Art Area */}
          <Animated.View entering={FadeInDown.duration(800)} style={styles.bossArtArea}>
            <View style={[styles.bossPlaceholder, isEnraged && styles.enragedPlaceholder]}>
              <Text style={styles.bossPlaceholderText}>
                {isDefeated ? 'DEFEATED' : 'BOSS ARTWORK'}
              </Text>
            </View>
            <View style={styles.bossNameOverlay}>
              <Text style={styles.bossTitle}>{currentBoss.title || 'Unknown Threat'}</Text>
              <Text style={[styles.bossName, isEnraged && { color: colors.semantic.dangerNeon }]}>
                {currentBoss.name}
              </Text>
            </View>
          </Animated.View>

          {/* HP Bar */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.hpSection}>
            <View style={styles.hpHeader}>
              <Text style={styles.hpLabel}>HP</Text>
              <Text style={styles.hpValues}>
                {currentBoss.current_hp.toLocaleString()} / {currentBoss.total_hp.toLocaleString()}
              </Text>
            </View>
            <View style={styles.hpBarBg}>
              <Animated.View
                style={[
                  styles.hpBarFill,
                  hpBarStyle,
                  isEnraged && { backgroundColor: colors.semantic.danger },
                ]}
              />
            </View>
            <View style={styles.phaseHeader}>
              <Text style={[styles.phaseText, isEnraged && { color: colors.semantic.dangerNeon }]}>
                {phaseName} {isEnraged ? ' (ENRAGED)' : ''}
              </Text>
              <Text style={styles.timeRemaining}>Time Remaining: 48:00:00</Text>
            </View>
          </Animated.View>

          {/* Action Form (Dev Mode) */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
            <SectionHeader title="Launch Attack (Dev Self-Report)" />
            <GlassCard padding={16} variant={isDefeated ? 'default' : 'active'}>
              {isDefeated ? (
                <Text style={styles.defeatedText}>
                  The boss has been defeated. Rewards are being calculated.
                </Text>
              ) : (
                <View>
                  <Text style={styles.devNote}>
                    Development Note: This form mocks the upcoming AI verification. Submissions are
                    sent securely to the BossEngine RPC.
                  </Text>

                  <View style={styles.objectiveRow}>
                    {currentBossObjectives.map((obj) => (
                      <Pressable
                        key={obj.id}
                        style={[
                          styles.objBtn,
                          selectedObjectiveId === obj.id && styles.objBtnSelected,
                        ]}
                        onPress={() => setSelectedObjectiveId(obj.id)}
                      >
                        <Text
                          style={[
                            styles.objBtnText,
                            selectedObjectiveId === obj.id && styles.objBtnTextSelected,
                          ]}
                        >
                          {obj.activity_type.toUpperCase()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View style={styles.inputRow}>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Amount (e.g. 20 reps / 5 km)"
                      placeholderTextColor={colors.text.muted}
                      style={styles.input}
                      value={amountInput}
                      onChangeText={setAmountInput}
                    />
                    <Button
                      disabled={!amountInput || submitting}
                      isLoading={submitting}
                      onPress={handleDevSubmit}
                    >
                      STRIKE
                    </Button>
                  </View>
                </View>
              )}
            </GlassCard>
          </Animated.View>

          {/* User Status / Personal Milestones */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
            <SectionHeader title="Your Contribution" />
            <GlassCard padding={16}>
              <View style={styles.userStatsRow}>
                <View style={styles.userStatBlock}>
                  <Text style={styles.userStatLabel}>DAMAGE DEALT</Text>
                  <Text style={styles.userStatValue}>
                    {userParticipant?.total_damage.toLocaleString() || '0'}
                  </Text>
                </View>
                <View style={styles.userStatBlock}>
                  <Text style={styles.userStatLabel}>RANK</Text>
                  <Text style={styles.userStatValue}>
                    {leaderboard.findIndex((p) => p.user_id === user?.id) >= 0
                      ? `#${leaderboard.findIndex((p) => p.user_id === user?.id) + 1}`
                      : 'Unranked'}
                  </Text>
                </View>
              </View>

              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneLabel}>Daily Goal Progress</Text>
                <Text style={styles.milestoneTarget}>1,000 DMG / 5,000</Text>
              </View>
              <View style={styles.milestoneBg}>
                <View style={[styles.milestoneFill, { width: '20%' }]} />
                {/* 25%, 50%, 75% markers */}
                <View style={[styles.milestoneMarker, { left: '25%' }]} />
                <View style={[styles.milestoneMarker, { left: '50%' }]} />
                <View style={[styles.milestoneMarker, { left: '75%' }]} />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Leaderboard */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.section}>
            <SectionHeader title="Top Hunters" />
            <GlassCard padding={0}>
              {leaderboard.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: colors.text.muted, fontFamily: fontFamily.inter.regular }}>
                    No hunters have dealt damage yet.
                  </Text>
                </View>
              ) : (
                leaderboard.slice(0, 10).map((participant, index) => (
                  <View
                    key={participant.id}
                    style={[
                      styles.leaderboardRow,
                      index < leaderboard.length - 1 && styles.leaderboardRowBorder,
                    ]}
                  >
                    <Text style={styles.rankNum}>{index + 1}</Text>
                    <View style={styles.lbProfile}>
                      <View style={styles.lbAvatar} />
                      <Text style={styles.lbName}>
                        {participant.profiles?.username || 'Hunter'}
                      </Text>
                    </View>
                    <Text style={styles.lbDamage}>
                      {participant.total_damage.toLocaleString()} DMG
                    </Text>
                  </View>
                ))
              )}
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
  content: {
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 56,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.md,
  },
  backBtnText: {
    color: colors.purple[300],
    fontFamily: fontFamily.inter.semiBold,
  },
  participantBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  participantText: {
    color: colors.text.primary,
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
  },
  bossArtArea: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  bossPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enragedPlaceholder: {
    backgroundColor: '#301015',
  },
  bossPlaceholderText: {
    color: 'rgba(255,255,255,0.1)',
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    letterSpacing: 8,
  },
  bossNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 24,
    paddingTop: 60,
    // Note: Would use LinearGradient here for real app
    backgroundColor: 'rgba(5, 5, 5, 0.8)',
  },
  bossTitle: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.purple[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  bossName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 36,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  hpSection: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: -20,
    zIndex: 2,
    marginBottom: 24,
  },
  hpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  hpLabel: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 18,
    color: colors.text.secondary,
  },
  hpValues: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  hpBarBg: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: colors.purple.neon,
    borderRadius: 6,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  phaseText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: colors.purple[300],
  },
  timeRemaining: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  section: {
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: 24,
  },
  devNote: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.semantic.warning,
    marginBottom: 16,
    lineHeight: 18,
  },
  defeatedText: {
    fontFamily: fontFamily.inter.bold,
    color: colors.text.primary,
    textAlign: 'center',
    padding: 16,
  },
  objectiveRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  objBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  objBtnSelected: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[500],
  },
  objBtnText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  objBtnTextSelected: {
    color: colors.purple[300],
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: colors.text.primary,
    fontFamily: fontFamily.mono.regular,
    paddingHorizontal: 16,
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userStatBlock: {
    flex: 1,
  },
  userStatLabel: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  userStatValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 24,
    color: colors.purple[300],
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  milestoneLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  milestoneTarget: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  milestoneBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    position: 'relative',
  },
  milestoneFill: {
    height: '100%',
    backgroundColor: colors.cyan.neon,
    borderRadius: 3,
  },
  milestoneMarker: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leaderboardRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rankNum: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    color: colors.text.muted,
    width: 32,
  },
  lbProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lbAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  lbName: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.primary,
  },
  lbDamage: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 14,
    color: colors.purple[300],
  },
});
