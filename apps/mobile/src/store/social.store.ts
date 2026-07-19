import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { type FriendshipRow, type FollowRow, type NotificationRow } from '@/types/social.types';

export interface SocialState {
  followers: FollowRow[];
  following: FollowRow[];
  friends: FriendshipRow[];
  friendRequests: FriendshipRow[];
  notifications: NotificationRow[];
  isLoading: boolean;
  error: string | null;

  fetchSocialData: (userId: string) => Promise<void>;
  followUser: (followerId: string, followingId: string) => Promise<void>;
  unfollowUser: (followerId: string, followingId: string) => Promise<void>;
  sendFriendRequest: (userId: string, friendId: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  followers: [],
  following: [],
  friends: [],
  friendRequests: [],
  notifications: [],
  isLoading: false,
  error: null,

  fetchSocialData: async (userId: string) => {
    set({ isLoading: true, error: null });

    const [followersRes, followingRes, friendsRes, requestsRes, notificationsRes] =
      await Promise.all([
        repositories.social.getFollowers(userId),
        repositories.social.getFollowing(userId),
        repositories.social.getFriends(userId),
        repositories.social.getFriendRequests(userId),
        repositories.social.getNotifications(userId),
      ]);

    set({
      followers: followersRes.success ? followersRes.data : [],
      following: followingRes.success ? followingRes.data : [],
      friends: friendsRes.success ? friendsRes.data : [],
      friendRequests: requestsRes.success ? requestsRes.data : [],
      notifications: notificationsRes.success ? notificationsRes.data : [],
      isLoading: false,
    });
  },

  followUser: async (followerId, followingId) => {
    await repositories.social.followUser(followerId, followingId);
    // Refresh to get updated following count
    await get().fetchSocialData(followerId);
  },

  unfollowUser: async (followerId, followingId) => {
    await repositories.social.unfollowUser(followerId, followingId);
    await get().fetchSocialData(followerId);
  },

  sendFriendRequest: async (userId, friendId) => {
    const res = await repositories.social.sendFriendRequest(userId, friendId);
    return res.success;
  },

  acceptFriendRequest: async (requestId) => {
    await repositories.social.acceptFriendRequest(requestId);
    // Assume we have the user's ID somewhere to refresh, but for now we might need to filter manually
    set((state) => ({
      friendRequests: state.friendRequests.filter((req) => req.id !== requestId),
      // Note: we should probably fetch to put them in the friends list securely
    }));
  },

  rejectFriendRequest: async (requestId) => {
    await repositories.social.rejectFriendRequest(requestId);
    set((state) => ({
      friendRequests: state.friendRequests.filter((req) => req.id !== requestId),
    }));
  },
}));
