import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontFamily, radius, spacing } from '@theme';
import { useSocialStore } from '@/store/social.store';

// We would fetch public profile data using this ID. For now we mock it.
export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { sendFriendRequest, followUser, unfollowUser } = useSocialStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const [loading, setLoading] = useState(false);

  // Mock data for showcase
  const user = {
    username: id === '1' ? 'ShadowMonarch' : 'Hunter_001',
    level: 45,
    hunterRank: 'A Rank',
    avatar: '👑',
    followersCount: 1420,
    followingCount: 56,
    friendsCount: 12,
  };

  const handleFollowToggle = async () => {
    setLoading(true);
    if (isFollowing) {
      await unfollowUser('mock-user-id', id as string);
      setIsFollowing(false);
    } else {
      await followUser('mock-user-id', id as string);
      setIsFollowing(true);
    }
    setLoading(false);
  };

  const handleAddFriend = async () => {
    setLoading(true);
    await sendFriendRequest('mock-user-id', id as string);
    setFriendStatus('pending');
    setLoading(false);
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
          <Text style={styles.headerTitle}>HUNTER PROFILE</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <GlassCard style={styles.profileCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>

              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.stats}>
                Lv.{user.level} • {user.hunterRank}
              </Text>

              <View style={styles.socialStatsRow}>
                <View style={styles.socialStat}>
                  <Text style={styles.socialStatValue}>{user.followersCount}</Text>
                  <Text style={styles.socialStatLabel}>Followers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.socialStat}>
                  <Text style={styles.socialStatValue}>{user.followingCount}</Text>
                  <Text style={styles.socialStatLabel}>Following</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.socialStat}>
                  <Text style={styles.socialStatValue}>{user.friendsCount}</Text>
                  <Text style={styles.socialStatLabel}>Friends</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  disabled={loading}
                  style={[styles.actionBtn, isFollowing && styles.actionBtnActive]}
                  onPress={handleFollowToggle}
                >
                  <Text style={[styles.actionBtnText, isFollowing && styles.actionBtnTextActive]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={loading || friendStatus !== 'none'}
                  style={[styles.actionBtn, friendStatus !== 'none' && styles.actionBtnActive]}
                  onPress={handleAddFriend}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      friendStatus !== 'none' && styles.actionBtnTextActive,
                    ]}
                  >
                    {friendStatus === 'friends'
                      ? 'Friends'
                      : friendStatus === 'pending'
                        ? 'Request Sent'
                        : 'Add Friend'}
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Activity Section could go here */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <GlassCard padding={24} style={styles.emptyActivity}>
              <Text style={styles.emptyActivityText}>No recent activity</Text>
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
  },
  profileCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    borderWidth: 2,
    borderColor: colors.purple[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  username: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: 4,
  },
  stats: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 14,
    color: colors.purple[300],
    marginBottom: 24,
  },
  socialStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  socialStat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  socialStatValue: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.text.primary,
  },
  socialStatLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.purple[500],
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    borderWidth: 1,
    borderColor: colors.purple[500],
  },
  actionBtnText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.primary,
  },
  actionBtnTextActive: {
    color: colors.purple[300],
  },
  sectionTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivityText: {
    fontFamily: fontFamily.inter.regular,
    color: colors.text.muted,
  },
});
