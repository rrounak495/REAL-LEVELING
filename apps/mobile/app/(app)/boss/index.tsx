import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ComingSoonCard } from '@/components/ui/ComingSoonCard';
import { colors, fontFamily, radius, spacing } from '@theme';
import { useBossStore } from '@/store/boss.store';
import { useAuthStore } from '@/store/auth.store';

export default function BossHubScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeBosses, fetchActiveBosses, spawnTestBoss, isLoading } = useBossStore();

  useEffect(() => {
    fetchActiveBosses();
  }, [fetchActiveBosses]);

  const worldBosses = activeBosses.filter((b) => b.boss_type === 'world_boss');
  const weeklyBosses = activeBosses.filter((b) => b.boss_type === 'weekly_boss');

  const renderBossCard = (boss: any, index: number) => {
    const hpPct = Math.max(0, (boss.current_hp / boss.total_hp) * 100).toFixed(1);
    const isDefeated = boss.current_hp <= 0 || boss.status === 'defeated';

    return (
      <Animated.View key={boss.id} entering={FadeInDown.delay(index * 100).duration(500)}>
        <Pressable onPress={() => router.push(`/boss/${boss.id}`)}>
          <GlassCard style={styles.bossCard} variant={isDefeated ? 'default' : 'elevated'}>
            <View style={styles.bossImageContainer}>
              <View style={[styles.bossImagePlaceholder, isDefeated && styles.defeatedOverlay]} />
              <View style={styles.rarityBadge}>
                <Text style={styles.rarityText}>{boss.rarity.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.bossInfo}>
              <Text style={styles.bossTitle}>{boss.title || 'Unknown'}</Text>
              <Text style={styles.bossName}>{boss.name}</Text>

              <View style={styles.hpContainer}>
                <View style={styles.hpHeader}>
                  <Text style={styles.hpLabel}>HP</Text>
                  <Text style={styles.hpValue}>{isDefeated ? '0' : hpPct}%</Text>
                </View>
                <View style={styles.hpBarBg}>
                  <View
                    style={[
                      styles.hpBarFill,
                      { width: `${isDefeated ? 0 : hpPct}%` as any },
                      boss.status === 'enraged' && { backgroundColor: colors.semantic.dangerNeon },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.bossFooter}>
                <Text style={styles.levelReq}>Lv {boss.recommended_level} Recommended</Text>
                {isDefeated ? (
                  <Text style={styles.statusDefeated}>DEFEATED</Text>
                ) : (
                  <Text style={styles.statusActive}>ACTIVE</Text>
                )}
              </View>
            </View>
          </GlassCard>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>GATE MISSIONS</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Dev Tools */}
          {__DEV__ && (
            <Animated.View entering={FadeInDown.delay(50).duration(400)}>
              <SectionHeader title="Developer Tools" />
              <GlassCard style={{ padding: 16, marginBottom: 20 }}>
                <Button
                  isLoading={isLoading}
                  style={{ backgroundColor: colors.semantic.danger }}
                  onPress={spawnTestBoss}
                >
                  Spawn Test World Boss
                </Button>
              </GlassCard>
            </Animated.View>
          )}

          {/* World Bosses */}
          <SectionHeader title="World Boss (Co-op Raid)" />
          {worldBosses.length > 0 ? (
            <View style={styles.bossList}>{worldBosses.map((b, i) => renderBossCard(b, i))}</View>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>No dimensional threat detected.</Text>
              <Text style={styles.emptySubtext}>
                The System will alert you when a Boss appears.
              </Text>
              <Button
                size="sm"
                style={{ marginTop: 16 }}
                onPress={() => router.push('/(app)/(tabs)/')}
              >
                VIEW TODAY'S LEVELING
              </Button>
            </GlassCard>
          )}

          {/* Weekly Bosses */}
          <SectionHeader style={{ marginTop: 24 }} title="Weekly Solo Bosses" />
          {weeklyBosses.length > 0 ? (
            <View style={styles.bossList}>{weeklyBosses.map((b, i) => renderBossCard(b, i))}</View>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>Weekly Bosses Reset Soon.</Text>
            </GlassCard>
          )}

          {/* Guild Boss - Coming Soon */}
          <SectionHeader style={{ marginTop: 24 }} title="Guild Raids" />
          <ComingSoonCard
            description="Team up with your Guild to conquer legendary threats. (Unlocks with Guilds update)"
            icon="🛡️"
            title="GUILD BOSS"
          />
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
  header: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  backBtnText: {
    color: colors.purple[300],
    fontFamily: fontFamily.inter.semiBold,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  content: {
    padding: spacing.screenHorizontal,
    paddingTop: 24,
    paddingBottom: 60,
  },
  bossList: {
    gap: 16,
    marginBottom: 16,
  },
  bossCard: {
    padding: 0,
    overflow: 'hidden',
  },
  bossImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  bossImagePlaceholder: {
    flex: 1,
    backgroundColor: '#1a1025',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 60, 247, 0.3)',
  },
  defeatedOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.purple[500],
  },
  rarityText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 10,
    color: colors.purple[300],
    letterSpacing: 1,
  },
  bossInfo: {
    padding: 16,
  },
  bossTitle: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.purple[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bossName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 22,
    color: colors.text.primary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  hpContainer: {
    marginBottom: 16,
  },
  hpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hpLabel: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  hpValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.semantic.dangerNeon,
  },
  hpBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: colors.semantic.danger,
    borderRadius: 3,
  },
  bossFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  levelReq: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  statusActive: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.semantic.successNeon,
    letterSpacing: 1,
  },
  statusDefeated: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
});
