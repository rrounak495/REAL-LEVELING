/**
 * app/(app)/(tabs)/ranks.tsx — Hunter Rankings / Leaderboard
 * Sprint 5.4: Leaderboard with extended tabs, search, and premium podium.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { useProgressionStore } from '@/store/progression.store';
import { useSocialStore } from '@/store/social.store';
import { useBottomTabBarPadding } from '@/components/navigation/FloatingTabBar';
import { colors, fontFamily, radius, spacing } from '@theme';

interface LeaderboardEntry {
  id?: string;
  rank: number;
  username: string;
  level: number;
  hunterRank: string;
  xp: number;
  avatar: string;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'ShadowMonarch',
    level: 95,
    hunterRank: 'SSS Rank',
    xp: 285000,
    avatar: '👑',
  },
  { rank: 2, username: 'IronWill', level: 88, hunterRank: 'SS Rank', xp: 245000, avatar: '⚔️' },
  { rank: 3, username: 'BeastSlayer', level: 82, hunterRank: 'S Rank', xp: 220000, avatar: '🐉' },
  { rank: 4, username: 'PhantomHunter', level: 76, hunterRank: 'S Rank', xp: 198000, avatar: '👻' },
  { rank: 5, username: 'NightBlade', level: 68, hunterRank: 'A Rank', xp: 175000, avatar: '🗡️' },
  { rank: 6, username: 'GateKeeper', level: 55, hunterRank: 'A Rank', xp: 142000, avatar: '🚪' },
  { rank: 7, username: 'DragonPulse', level: 48, hunterRank: 'B Rank', xp: 118000, avatar: '🔥' },
  { rank: 8, username: 'StormBreaker', level: 42, hunterRank: 'B Rank', xp: 95000, avatar: '⚡' },
  { rank: 9, username: 'FrostBite', level: 35, hunterRank: 'C Rank', xp: 72000, avatar: '❄️' },
  { rank: 10, username: 'ThunderFist', level: 28, hunterRank: 'C Rank', xp: 55000, avatar: '👊' },
];

const TABS = [
  'Global',
  'Country',
  'State',
  'City',
  'Friends',
  'Weekly',
  'Monthly',
  'All-Time',
  'Guild (Soon)',
];

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const medalColors = {
    1: '#FFD700',
    2: '#C0C0C0',
    3: '#CD7F32',
  };
  const medalColor = medalColors[position];
  const isFirst = position === 1;

  return (
    <Animated.View
      entering={FadeInUp.delay(position * 100)
        .springify()
        .damping(12)}
      style={[styles.podiumWrapper, isFirst && styles.podiumWrapperFirst]}
    >
      <View
        style={[styles.podiumCard, isFirst && styles.podiumCardFirst, { shadowColor: medalColor }]}
      >
        {isFirst && <Text style={styles.podiumCrown}>👑</Text>}
        <View style={[styles.podiumAvatar, { borderColor: medalColor, shadowColor: medalColor }]}>
          <Text style={styles.podiumAvatarText}>{entry.avatar}</Text>
        </View>
        <Text style={[styles.podiumRankNum, { color: medalColor }]}>#{entry.rank}</Text>
        <Text numberOfLines={1} style={styles.podiumName}>
          {entry.username}
        </Text>
        <Text style={styles.podiumLevel}>Lv.{entry.level}</Text>
        <View
          style={[
            styles.podiumRankPill,
            { borderColor: medalColor + '60', backgroundColor: medalColor + '10' },
          ]}
        >
          <Text style={[styles.podiumRankText, { color: medalColor }]}>{entry.hunterRank}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(300 + index * 40).duration(300)}>
      <GlassCard padding={14} style={styles.rowCard}>
        <View style={styles.row}>
          <Text style={styles.rowRank}>#{entry.rank}</Text>
          <View style={styles.rowAvatarCircle}>
            <Text style={styles.rowAvatarText}>{entry.avatar}</Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowName}>{entry.username}</Text>
            <Text style={styles.rowHunterRank}>{entry.hunterRank}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowLevel}>Lv.{entry.level}</Text>
            <Text style={styles.rowXp}>{(entry.xp / 1000).toFixed(0)}k XP</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function RanksScreen() {
  const bottomPadding = useBottomTabBarPadding();
  const [activeTab, setActiveTab] = useState(TABS[0]!);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLevel, currentRank } = useProgressionStore();
  const { fetchSocialData, friends } = useSocialStore();
  const MOCK_USER_ID = 'mock-user-id';

  useEffect(() => {
    fetchSocialData(MOCK_USER_ID);
  }, [fetchSocialData]);

  // Here we would dynamically generate leaderboard from `friends` if activeTab === 'Friends'
  // using MOCK_LEADERBOARD for showcase logic.
  let listData = MOCK_LEADERBOARD;
  if (activeTab === 'Friends') {
    listData = MOCK_LEADERBOARD.slice(3, 7); // Mock filtered friends list
  }

  const top3 = listData.slice(0, 3);
  const filteredRest = listData
    .slice(3)
    .filter((entry) => entry.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        {/* ── Sticky Your Position Hero ── */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stickyHeader}>
          <Text style={styles.headerTitle}>HUNTER RANKINGS</Text>

          <GlassCard style={styles.yourHeroCard} variant="active">
            <View style={styles.yourHeroRow}>
              <View style={styles.yourHeroLeft}>
                <Text style={styles.yourHeroLabel}>YOUR WORLD RANK</Text>
                <Text style={styles.yourHeroRankNum}>#142,084</Text>
                <Text style={styles.yourHeroPercentile}>Top 2% of Hunters</Text>
              </View>
              <View style={styles.yourHeroRight}>
                <View style={styles.movementBadge}>
                  <Text style={styles.movementIcon}>▲</Text>
                  <Text style={styles.movementText}>+45</Text>
                </View>
                <Text style={styles.yourHeroStats}>
                  Lv.{currentLevel} • {currentRank}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* ── Tab Selector (Horizontal Scroll) ── */}
          <ScrollView
            horizontal
            contentContainerStyle={styles.tabScrollContent}
            showsHorizontalScrollIndicator={false}
            style={styles.tabScroll}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const isSoon = tab.includes('Soon');
              return (
                <Pressable
                  key={tab}
                  style={[
                    styles.tabPill,
                    isActive && styles.tabPillActive,
                    isSoon && styles.tabPillDisabled,
                  ]}
                  onPress={() => !isSoon && setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                      isSoon && styles.tabTextDisabled,
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Search Bar ── */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.searchContainer}
          >
            <GlassCard padding={12} style={styles.searchCard}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search hunters..."
                placeholderTextColor={colors.text.muted}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </GlassCard>
          </Animated.View>

          {/* ── Top 3 Podium ── */}
          {searchQuery === '' && (
            <View style={styles.podiumRow}>
              <PodiumCard entry={top3[1]!} position={2} />
              <PodiumCard entry={top3[0]!} position={1} />
              <PodiumCard entry={top3[2]!} position={3} />
            </View>
          )}

          {/* ── Remaining Leaderboard ── */}
          <View style={styles.listSection}>
            {filteredRest.map((entry, i) => (
              <LeaderboardRow key={entry.rank} entry={entry} index={i} />
            ))}
            {filteredRest.length === 0 && (
              <Text style={styles.emptySearch}>No hunters found for "{searchQuery}"</Text>
            )}
          </View>
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
  stickyHeader: {
    paddingTop: 56,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: 'rgba(9, 9, 14, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 28,
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: 16,
  },

  // ── Your Position Hero ──
  yourHeroCard: {
    padding: 16,
    marginBottom: 16,
  },
  yourHeroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yourHeroLeft: {
    flex: 1,
  },
  yourHeroLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.purple[300],
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  yourHeroRankNum: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    lineHeight: 36,
  },
  yourHeroPercentile: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.semantic.success,
    marginTop: 2,
  },
  yourHeroRight: {
    alignItems: 'flex-end',
  },
  movementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
    marginBottom: 8,
  },
  movementIcon: {
    fontSize: 10,
    color: colors.semantic.successNeon,
  },
  movementText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.semantic.successNeon,
  },
  yourHeroStats: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 13,
    color: colors.text.secondary,
  },

  // ── Tabs ──
  tabScroll: {
    marginHorizontal: -spacing.screenHorizontal,
  },
  tabScrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 16,
    gap: 8,
  },
  tabPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabPillActive: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[500],
  },
  tabPillDisabled: {
    opacity: 0.5,
  },
  tabText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.purple[300],
  },
  tabTextDisabled: {
    color: colors.text.muted,
  },

  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 20,
  },

  // ── Search ──
  searchContainer: {
    marginBottom: 24,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: 4,
  },
  emptySearch: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 40,
  },

  // ── Podium ──
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.sectionGap,
    gap: 8,
  },
  podiumWrapper: {
    flex: 1,
  },
  podiumWrapperFirst: {
    zIndex: 10,
  },
  podiumCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  podiumCardFirst: {
    paddingVertical: 24,
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  podiumCrown: {
    fontSize: 24,
    marginBottom: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  podiumAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  podiumAvatarText: {
    fontSize: 26,
  },
  podiumRankNum: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  podiumName: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumLevel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  podiumRankPill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  podiumRankText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },

  // ── Leaderboard Rows ──
  listSection: {
    gap: 10,
    marginBottom: spacing.sectionGap,
  },
  rowCard: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowRank: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.text.muted,
    width: 36,
  },
  rowAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(139, 60, 247, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    fontSize: 20,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 15,
    color: colors.text.primary,
  },
  rowHunterRank: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowLevel: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 15,
    color: colors.purple[400],
  },
  rowXp: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 4,
  },
});
