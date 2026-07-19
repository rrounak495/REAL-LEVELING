/**
 * src/db/repositories/supabase/AchievementRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type AchievementRow = Database['public']['Tables']['achievements']['Row'];
export type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row'];
export type BadgeRow = Database['public']['Tables']['badges']['Row'];
export type UserBadgeRow = Database['public']['Tables']['user_badges']['Row'];

export interface IAchievementRepository {
  getAllAchievements(): Promise<Result<AchievementRow[]>>;
  getAllBadges(): Promise<Result<BadgeRow[]>>;
  getUserAchievements(userId: string): Promise<Result<UserAchievementRow[]>>;
  getUserBadges(userId: string): Promise<Result<UserBadgeRow[]>>;
  unlockAchievement(userId: string, achievementId: string): Promise<Result<UserAchievementRow>>;
  unlockBadge(userId: string, badgeId: string): Promise<Result<UserBadgeRow>>;
}

export class AchievementRepository implements IAchievementRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAllAchievements(): Promise<Result<AchievementRow[]>> {
    try {
      const { data, error } = await this.supabase.from('achievements').select('*');
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async getAllBadges(): Promise<Result<BadgeRow[]>> {
    try {
      const { data, error } = await this.supabase.from('badges').select('*');
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async getUserAchievements(userId: string): Promise<Result<UserAchievementRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async getUserBadges(userId: string): Promise<Result<UserBadgeRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async unlockAchievement(
    userId: string,
    achievementId: string,
  ): Promise<Result<UserAchievementRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_achievements')
        .insert({ user_id: userId, achievement_id: achievementId })
        .select()
        .single();
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async unlockBadge(userId: string, badgeId: string): Promise<Result<UserBadgeRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badgeId })
        .select()
        .single();
      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }
}
