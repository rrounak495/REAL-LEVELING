export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

export interface FriendshipRow {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export interface FollowRow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export type PostType = 'standard_post' | 'level_up' | 'workout' | 'boss' | 'achievement';

export interface FeedPostRow {
  id: string;
  user_id: string;
  type: PostType;
  content: string | null;
  image_url: string | null;
  tag: string | null;
  xp_earned: number | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export type ReactionType = 'fire' | 'power' | 'respect' | 'lightning' | 'heart';

export interface PostReactionRow {
  id: string;
  post_id: string;
  user_id: string;
  reaction: ReactionType;
  created_at: string;
}

export interface PostCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'new_follower'
  | 'post_like'
  | 'post_comment'
  | 'comment_reply';

export interface NotificationRow {
  id: string;
  user_id: string;
  actor_id: string;
  type: NotificationType;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

// Extends public profile logic
export interface PublicProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  rank: string;
  followers_count: number;
  following_count: number;
  friends_count: number;
  is_following?: boolean;
  friendship_status?: FriendshipStatus | null;
}
