import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useGuildStore } from '@/store/guild.store';
import { useAuthStore } from '@/store/auth.store';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function GuildScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();
  const {
    activeGuild,
    recommendedGuilds,
    activeMissions,
    members,
    fetchGuildData,
    joinGuild,
    leaveGuild,
  } = useGuildStore();

  useEffect(() => {
    if (user?.id) fetchGuildData(user.id);
  }, [user?.id]);

  if (!activeGuild) {
    return (
      <ScreenContainer>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← BACK</Text>
          </Pressable>
          <Text style={styles.headerTitle}>HUNTER GUILDS</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.subtitle}>
              Join a Hunter Association to participate in global raids and cooperative missions.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>

              {recommendedGuilds.map((guild, index) => (
                <View key={guild.id} style={{ marginBottom: 16 }}>
                  <GlassCard padding={20} style={styles.guildCard}>
                    <View style={styles.guildHeader}>
                      <Text style={styles.guildLogo}>{guild.logo}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.guildName}>{guild.name}</Text>
                        <Text style={styles.guildRank}>
                          {guild.rank} • LVL {guild.level}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.guildDesc}>{guild.description}</Text>

                    <View style={styles.guildMeta}>
                      <Text style={styles.metaText}>👥 {guild.memberCount}/50</Text>
                      <Text style={styles.metaText}>🌍 {guild.region}</Text>
                    </View>

                    <Button size="md" onPress={() => joinGuild(guild.id)}>
                      JOIN GUILD
                    </Button>
                  </GlassCard>
                </View>
              ))}
            </View>

            <Button
              size="lg"
              style={{ marginTop: 24, borderColor: colors.purple[500] }}
              variant="outline"
              onPress={() => {}}
            >
              CREATE NEW GUILD
            </Button>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // GUILD DASHBOARD
  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{activeGuild.name.toUpperCase()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.bannerContainer}>
          <Text style={styles.bannerLogo}>{activeGuild.logo}</Text>
          <Text style={styles.bannerRank}>{activeGuild.rank}</Text>
          <Text style={styles.bannerLevel}>LEVEL {activeGuild.level}</Text>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: '65%' }]} />
          </View>
          <Text style={styles.xpText}>{activeGuild.xp.toLocaleString()} XP / Next Level</Text>
        </Animated.View>

        {/* Cooperative Missions */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={styles.sectionTitle}>ACTIVE MISSIONS</Text>
            <Text style={styles.metaText}>Shared Progress</Text>
          </View>

          {activeMissions.map((mission) => {
            const progressPct = Math.min(
              100,
              Math.round((mission.currentProgress / mission.targetProgress) * 100),
            );
            return (
              <GlassCard
                key={mission.id}
                padding={16}
                style={{ marginBottom: 12, borderColor: colors.purple[500], borderWidth: 2 }}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
                >
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionReward}>+{mission.rewardCoins} 🪙</Text>
                </View>
                <Text style={styles.missionDesc}>{mission.description}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                  <View style={[styles.xpBarBg, { flex: 1, marginTop: 0, height: 6 }]}>
                    <View
                      style={[
                        styles.xpBarFill,
                        { width: `${progressPct}%`, backgroundColor: colors.cyan.neon },
                      ]}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: fontFamily.mono.semiBold,
                      fontSize: 10,
                      color: colors.cyan.neon,
                      marginLeft: 12,
                    }}
                  >
                    {progressPct}%
                  </Text>
                </View>
              </GlassCard>
            );
          })}
        </Animated.View>

        {/* Action Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable style={{ flex: 1 }} onPress={() => router.push('/guild/chat' as any)}>
              <GlassCard
                padding={16}
                style={{ alignItems: 'center', backgroundColor: 'rgba(139, 60, 247, 0.1)' }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>💬</Text>
                <Text
                  style={{
                    fontFamily: fontFamily.inter.bold,
                    fontSize: 12,
                    color: colors.text.primary,
                  }}
                >
                  GUILD CHAT
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.inter.regular,
                    fontSize: 10,
                    color: colors.semantic.successNeon,
                    marginTop: 4,
                  }}
                >
                  3 Online
                </Text>
              </GlassCard>
            </Pressable>

            <Pressable style={{ flex: 1 }} onPress={() => router.push('/boss' as any)}>
              <GlassCard
                padding={16}
                style={{ alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>💀</Text>
                <Text
                  style={{
                    fontFamily: fontFamily.inter.bold,
                    fontSize: 12,
                    color: colors.text.primary,
                  }}
                >
                  GUILD BOSS
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.inter.regular,
                    fontSize: 10,
                    color: colors.semantic.dangerNeon,
                    marginTop: 4,
                  }}
                >
                  Summon Ready
                </Text>
              </GlassCard>
            </Pressable>
          </View>
        </Animated.View>

        {/* Member Leaderboard */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>MEMBER CONTRIBUTION</Text>
          <GlassCard padding={16}>
            {members
              .sort((a, b) => b.contributionScore - a.contributionScore)
              .map((member, idx) => (
                <View
                  key={member.hunterId}
                  style={[styles.memberRow, idx < members.length - 1 && styles.borderBottom]}
                >
                  <Text style={styles.memberRank}>#{idx + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>
                      {member.name} {member.hunterId === 'me' && '(You)'}
                    </Text>
                    <Text style={styles.memberRole}>{member.role.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.memberScore}>
                    {member.contributionScore.toLocaleString()} pts
                  </Text>
                </View>
              ))}
          </GlassCard>
        </Animated.View>

        <Button
          size="md"
          style={{ marginTop: 24, borderColor: colors.semantic.danger }}
          variant="outline"
          onPress={leaveGuild}
        >
          LEAVE GUILD
        </Button>
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
  backButton: { padding: 8, marginLeft: -8, marginRight: 16 },
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
  scrollContent: { paddingHorizontal: spacing.screenHorizontal, paddingTop: 24, paddingBottom: 80 },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 32,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 3,
    marginBottom: 16,
    marginLeft: 8,
  },

  guildCard: { marginBottom: 16, borderColor: 'rgba(255,255,255,0.1)' },
  guildHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  guildLogo: { fontSize: 32, marginRight: 16 },
  guildName: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 22,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  guildRank: { fontFamily: fontFamily.inter.semiBold, fontSize: 12, color: colors.purple[300] },
  guildDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  guildMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metaText: { fontFamily: fontFamily.mono.regular, fontSize: 11, color: colors.text.muted },

  // Dashboard
  bannerContainer: { alignItems: 'center', marginBottom: 32 },
  bannerLogo: { fontSize: 64, marginBottom: 12 },
  bannerRank: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.purple[300],
    letterSpacing: 2,
  },
  bannerLevel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.text.primary,
    letterSpacing: 2,
    marginTop: 4,
  },
  xpBarBg: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  xpBarFill: { height: '100%', backgroundColor: colors.purple[500] },
  xpText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 8,
    letterSpacing: 1,
  },

  missionTitle: { fontFamily: fontFamily.inter.bold, fontSize: 16, color: colors.text.primary },
  missionReward: { fontFamily: fontFamily.inter.bold, fontSize: 14, color: colors.text.gold },
  missionDesc: { fontFamily: fontFamily.inter.regular, fontSize: 13, color: colors.text.secondary },

  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  memberRank: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 14,
    color: colors.text.muted,
    width: 30,
  },
  memberName: { fontFamily: fontFamily.inter.bold, fontSize: 14, color: colors.text.primary },
  memberRole: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 10,
    color: colors.purple[300],
    marginTop: 2,
  },
  memberScore: { fontFamily: fontFamily.mono.semiBold, fontSize: 12, color: colors.cyan.neon },
});
