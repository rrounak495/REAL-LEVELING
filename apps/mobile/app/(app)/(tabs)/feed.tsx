/**
 * app/(app)/(tabs)/feed.tsx — Hunter Activity Feed
 * Sprint 5.1: Social Feed with mock data
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Link, useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { colors, fontFamily, radius, spacing } from '@theme';
import { useFeedStore } from '@/store/feed.store';
import { type FeedPostRow } from '@/types/social.types';

const TYPE_COLORS: Record<string, string> = {
  level_up: 'rgba(168, 85, 247, 0.2)',
  workout: 'rgba(16, 185, 129, 0.2)',
  boss: 'rgba(239, 68, 68, 0.2)',
  achievement: 'rgba(252, 211, 77, 0.2)',
  standard_post: 'rgba(56, 189, 248, 0.2)',
};

const TYPE_BORDER_COLORS: Record<string, string> = {
  level_up: 'rgba(168, 85, 247, 0.4)',
  workout: 'rgba(16, 185, 129, 0.4)',
  boss: 'rgba(239, 68, 68, 0.4)',
  achievement: 'rgba(252, 211, 77, 0.4)',
  standard_post: 'rgba(56, 189, 248, 0.4)',
};

const EMOJI_MAP: Record<string, string> = {
  level_up: '⚡',
  workout: '💪',
  boss: '🐉',
  achievement: '🏅',
  standard_post: '📸',
};

function FeedCard({
  item,
  index,
  currentUserId,
}: {
  item: FeedPostRow;
  index: number;
  currentUserId: string;
}) {
  const [liked, setLiked] = useState(false);
  const toggleReaction = useFeedStore((state) => state.toggleReaction);
  const router = useRouter();

  const handleLike = () => {
    toggleReaction(item.id, currentUserId, 'fire', !liked);
    setLiked(!liked);
  };

  const isMe = item.user_id === currentUserId;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <GlassCard
        style={[
          styles.feedCard,
          { borderLeftColor: TYPE_BORDER_COLORS[item.type] || TYPE_BORDER_COLORS.standard_post },
        ]}
      >
        {/* Header */}
        <View style={styles.feedHeader}>
          <Pressable
            style={[
              styles.feedIconCircle,
              { backgroundColor: TYPE_COLORS[item.type] || TYPE_COLORS.standard_post },
            ]}
            onPress={() => router.push(`/profile/${item.user_id}`)}
          >
            <Text style={styles.feedIconText}>{EMOJI_MAP[item.type] || '💬'}</Text>
          </Pressable>
          <View style={styles.feedHeaderText}>
            <Pressable onPress={() => router.push(`/profile/${item.user_id}`)}>
              <Text style={[styles.feedUsername, isMe && styles.feedUsernameYou]}>
                {isMe ? 'You' : 'Hunter'}
              </Text>
            </Pressable>
            <Text style={styles.feedTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Content */}
        {item.tag && (
          <View style={styles.feedTags}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </View>
        )}
        <Text style={styles.feedMessage}>{item.content}</Text>

        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.feedImage} />}

        {/* Social Actions */}
        <View style={styles.socialBar}>
          <Pressable style={styles.socialAction} onPress={handleLike}>
            <Text style={[styles.socialIcon, liked && styles.socialIconLiked]}>
              {liked ? '🔥' : '🤍'}
            </Text>
            <Text style={[styles.socialText, liked && styles.socialTextLiked]}>
              {item.likes_count}
            </Text>
          </Pressable>
          <Pressable style={styles.socialAction}>
            <Text style={styles.socialIcon}>💬</Text>
            <Text style={styles.socialText}>{item.comments_count}</Text>
          </Pressable>
          <Pressable style={styles.socialAction}>
            <Text style={styles.socialIcon}>↗️</Text>
            <Text style={styles.socialText}>Share</Text>
          </Pressable>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function FeedScreen() {
  const { posts, isLoading, isRefreshing, fetchGlobalFeed, createPost } = useFeedStore();
  const [modalVisible, setModalVisible] = useState(false);
  const MOCK_USER_ID = 'mock-user-id'; // Replace with real auth user ID

  useEffect(() => {
    fetchGlobalFeed();
  }, [fetchGlobalFeed]);

  const onRefresh = useCallback(() => {
    fetchGlobalFeed(true);
  }, [fetchGlobalFeed]);

  const handleCreatePost = async (post: {
    imageUri: string | null;
    caption: string;
    tag: string;
  }) => {
    await createPost(MOCK_USER_ID, 'standard_post', post.caption, post.imageUri, post.tag);
    setModalVisible(false);
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        {/* ── Header ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headerTitle}>HUNTER FEED</Text>
          <Text style={styles.headerSubtitle}>Activity from the Hunter Network</Text>
        </Animated.View>

        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            !isLoading ? (
              <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={{ marginTop: 24 }}
              >
                <GlassCard style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 40, marginBottom: 12 }}>🌱</Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.rajdhani.bold,
                      fontSize: 20,
                      color: colors.text.primary,
                      marginBottom: 8,
                    }}
                  >
                    Your Hunter journey starts here.
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.inter.regular,
                      fontSize: 14,
                      color: colors.text.secondary,
                      textAlign: 'center',
                      marginBottom: 16,
                    }}
                  >
                    Share your first leveling moment.
                  </Text>
                  <Button size="sm" onPress={() => setModalVisible(true)}>
                    CREATE POST
                  </Button>
                </GlassCard>
              </Animated.View>
            ) : null
          }
          ListHeaderComponent={
            <Animated.View entering={FadeInDown.delay(50).duration(400)}>
              <Pressable style={styles.uploadBtn} onPress={() => setModalVisible(true)}>
                <GlassCard style={styles.uploadCard} variant="active">
                  <Text style={styles.uploadIcon}>📸</Text>
                  <View style={styles.uploadTextContainer}>
                    <Text style={styles.uploadTitle}>Upload Your Leveling</Text>
                    <Text style={styles.uploadSubtitle}>Share your workout or progress</Text>
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>
          }
          contentContainerStyle={styles.listContent}
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              colors={[colors.purple[400]]}
              refreshing={isRefreshing}
              tintColor={colors.purple[400]}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item, index }) => (
            <FeedCard currentUserId={MOCK_USER_ID} index={index + 1} item={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreatePost}
      />
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
    paddingBottom: spacing.componentMd,
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
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 120,
  },
  separator: {
    height: 16,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderWidth: 1,
    borderColor: colors.purple[500],
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.purple[300],
  },

  // ── Upload Button ──
  uploadBtn: {
    marginBottom: 24,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    color: colors.text.primary,
  },
  uploadSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // ── Feed Card ──
  feedCard: {
    borderLeftWidth: 3,
    padding: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  feedIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedIconText: {
    fontSize: 20,
  },
  feedHeaderText: {
    flex: 1,
  },
  feedUsername: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 15,
    color: colors.text.primary,
  },
  feedUsernameYou: {
    color: colors.purple[400],
  },
  feedTime: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  feedRankPill: {
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  feedRankText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.purple[300],
    letterSpacing: 0.5,
  },
  feedMessage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  feedImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: radius.md,
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  feedTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  xpPill: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  feedXp: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.purple[300],
  },
  socialBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
    gap: 24,
  },
  socialAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  socialIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  socialIconLiked: {
    opacity: 1,
  },
  socialText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  socialTextLiked: {
    color: colors.semantic.danger,
  },
});
