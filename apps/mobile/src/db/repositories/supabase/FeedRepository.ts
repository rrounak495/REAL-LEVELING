import { type Result } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import {
  type FeedPostRow,
  PostReactionRow,
  type PostCommentRow,
  type PostType,
  type ReactionType,
} from '@/types/social.types';

export class FeedRepository {
  async getFeedPosts(limit = 20, offset = 0): Promise<Result<FeedPostRow[]>> {
    const { data, error } = await (supabase as any)
      .from('feed_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getUserPosts(userId: string, limit = 20, offset = 0): Promise<Result<FeedPostRow[]>> {
    const { data, error } = await (supabase as any)
      .from('feed_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async createPost(
    userId: string,
    type: PostType,
    content: string | null,
    imageUrl: string | null,
    tag: string | null,
  ): Promise<Result<FeedPostRow>> {
    const { data, error } = await (supabase as any)
      .from('feed_posts')
      .insert({ user_id: userId, type, content, image_url: imageUrl, tag })
      .select()
      .single();

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async deletePost(postId: string, userId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('feed_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async reactToPost(postId: string, userId: string, reaction: ReactionType): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('post_reactions')
      .insert({ post_id: postId, user_id: userId, reaction });

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async removeReaction(
    postId: string,
    userId: string,
    reaction: ReactionType,
  ): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('reaction', reaction);

    if (error) return { success: false, error };
    return { success: true, data: undefined };
  }

  async getComments(postId: string): Promise<Result<PostCommentRow[]>> {
    const { data, error } = await (supabase as any)
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async addComment(
    postId: string,
    userId: string,
    content: string,
    parentId?: string | null,
  ): Promise<Result<PostCommentRow>> {
    const { data, error } = await (supabase as any)
      .from('post_comments')
      .insert({ post_id: postId, user_id: userId, content, parent_id: parentId })
      .select()
      .single();

    if (error) return { success: false, error };
    return { success: true, data };
  }
}
