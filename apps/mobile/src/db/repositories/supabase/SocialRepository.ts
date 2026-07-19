import { type Result } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { type FriendshipRow, type FollowRow, type NotificationRow } from '@/types/social.types';

export class SocialRepository {
  async getFollowers(userId: string): Promise<Result<FollowRow[]>> {
    const { data, error } = await (supabase as any)
      .from('follows')
      .select('*')
      .eq('following_id', userId);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getFollowing(userId: string): Promise<Result<FollowRow[]>> {
    const { data, error } = await (supabase as any)
      .from('follows')
      .select('*')
      .eq('follower_id', userId);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async followUser(followerId: string, followingId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async unfollowUser(followerId: string, followingId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async getFriends(userId: string): Promise<Result<FriendshipRow[]>> {
    const { data, error } = await (supabase as any)
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getFriendRequests(userId: string): Promise<Result<FriendshipRow[]>> {
    const { data, error } = await (supabase as any)
      .from('friendships')
      .select('*')
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async sendFriendRequest(userId: string, friendId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('friendships')
      .insert({ user_id: userId, friend_id: friendId, status: 'pending' });

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async acceptFriendRequest(requestId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async rejectFriendRequest(requestId: string): Promise<Result<void>> {
    const { error } = await (supabase as any).from('friendships').delete().eq('id', requestId);

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async getNotifications(userId: string): Promise<Result<NotificationRow[]>> {
    const { data, error } = await (supabase as any)
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error };
    return { success: true, data };
  }
}
