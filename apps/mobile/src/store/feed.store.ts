import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import {
  type FeedPostRow,
  type PostType,
  type ReactionType,
  type PostCommentRow,
} from '@/types/social.types';

export interface FeedState {
  posts: FeedPostRow[];
  comments: Record<string, PostCommentRow[]>; // postId -> comments
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  fetchGlobalFeed: (refresh?: boolean) => Promise<void>;
  fetchUserFeed: (userId: string, refresh?: boolean) => Promise<void>;
  createPost: (
    userId: string,
    type: PostType,
    content: string | null,
    imageUri: string | null,
    tag: string | null,
  ) => Promise<boolean>;
  deletePost: (postId: string, userId: string) => Promise<boolean>;
  toggleReaction: (
    postId: string,
    userId: string,
    reaction: ReactionType,
    isAdding: boolean,
  ) => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (
    postId: string,
    userId: string,
    content: string,
    parentId?: string | null,
  ) => Promise<boolean>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  comments: {},
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchGlobalFeed: async (refresh = false) => {
    if (refresh) set({ isRefreshing: true });
    else set({ isLoading: true });

    // Since we mock backend auth sometimes, we will fetch standard feed
    const res = await repositories.feed.getFeedPosts(20, 0);

    if (res.success) {
      set({ posts: res.data, error: null });
    } else {
      set({ error: res.error?.message || 'Failed to fetch feed' });
    }

    set({ isLoading: false, isRefreshing: false });
  },

  fetchUserFeed: async (userId: string, refresh = false) => {
    if (refresh) set({ isRefreshing: true });
    else set({ isLoading: true });

    const res = await repositories.feed.getUserPosts(userId, 20, 0);

    if (res.success) {
      set({ posts: res.data, error: null });
    } else {
      set({ error: res.error?.message || 'Failed to fetch feed' });
    }

    set({ isLoading: false, isRefreshing: false });
  },

  createPost: async (userId, type, content, imageUri, tag) => {
    set({ isLoading: true });
    let uploadedUrl: string | null = null;

    if (imageUri) {
      const uploadRes = await repositories.storage.uploadFeedImage(userId, imageUri);
      if (uploadRes.success) {
        uploadedUrl = uploadRes.data;
      }
    }

    const res = await repositories.feed.createPost(userId, type, content, uploadedUrl, tag);
    if (res.success) {
      // Add immediately to top of feed
      set((state) => ({
        posts: [res.data, ...state.posts],
        isLoading: false,
      }));
      return true;
    }

    set({ isLoading: false, error: res.error?.message });
    return false;
  },

  deletePost: async (postId, userId) => {
    const res = await repositories.feed.deletePost(postId, userId);
    if (res.success) {
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
      return true;
    }
    return false;
  },

  toggleReaction: async (postId, userId, reaction, isAdding) => {
    // Optimistic UI update
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id === postId) {
          return { ...p, likes_count: p.likes_count + (isAdding ? 1 : -1) };
        }
        return p;
      }),
    }));

    if (isAdding) {
      await repositories.feed.reactToPost(postId, userId, reaction);
    } else {
      await repositories.feed.removeReaction(postId, userId, reaction);
    }
  },

  fetchComments: async (postId) => {
    const res = await repositories.feed.getComments(postId);
    if (res.success) {
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: res.data,
        },
      }));
    }
  },

  addComment: async (postId, userId, content, parentId = null) => {
    const res = await repositories.feed.addComment(postId, userId, content, parentId);
    if (res.success) {
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: [...(state.comments[postId] || []), res.data],
        },
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p,
        ),
      }));
      return true;
    }
    return false;
  },
}));
