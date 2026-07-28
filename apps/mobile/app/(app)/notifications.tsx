import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, spacing } from '@theme';
import { useSocialStore } from '@/store/social.store';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    friendRequests,
    notifications,
    fetchSocialData,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useSocialStore();
  const MOCK_USER_ID = 'mock-user-id'; // Replace with real auth user ID

  useEffect(() => {
    fetchSocialData(MOCK_USER_ID);
  }, [fetchSocialData]);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        </Animated.View>

        <FlatList
          ListEmptyComponent={
            <GlassCard padding={24} style={styles.emptyCard}>
              <Text style={styles.emptyText}>No new notifications.</Text>
            </GlassCard>
          }
          contentContainerStyle={styles.content}
          data={[...friendRequests, ...notifications]}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // If it's a friend request
            if ('status' in item) {
              return (
                <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                  <GlassCard style={styles.notificationCard}>
                    <View style={styles.notificationHeader}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>🤝</Text>
                      </View>
                      <View style={styles.notificationTextContainer}>
                        <Text style={styles.notificationMessage}>
                          <Text style={styles.boldText}>Hunter {item.user_id.substring(0, 4)}</Text>{' '}
                          sent you a friend request.
                        </Text>
                        <Text style={styles.timeText}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.actionsRow}>
                      <Button
                        size="sm"
                        style={styles.actionBtn}
                        onPress={() => acceptFriendRequest(item.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        style={styles.actionBtn}
                        variant="outline"
                        onPress={() => rejectFriendRequest(item.id)}
                      >
                        Reject
                      </Button>
                    </View>
                  </GlassCard>
                </Animated.View>
              );
            }

            // Regular notification
            return (
              <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                <GlassCard style={styles.notificationCard}>
                  <View style={styles.notificationHeader}>
                    <View style={styles.iconCircle}>
                      <Text style={styles.iconText}>🔔</Text>
                    </View>
                    <View style={styles.notificationTextContainer}>
                      <Text style={styles.notificationMessage}>Notification type: {item.type}</Text>
                      <Text style={styles.timeText}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </Animated.View>
            );
          }}
        />
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
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  boldText: {
    fontFamily: fontFamily.inter.semiBold,
    color: colors.text.primary,
  },
  timeText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingLeft: 52, // Align with text
  },
  actionBtn: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.inter.regular,
    color: colors.text.muted,
  },
});
