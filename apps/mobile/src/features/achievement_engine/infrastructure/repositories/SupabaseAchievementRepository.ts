import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type IAchievementRepository } from '../../domain/repositories/IAchievementRepository';
import {
  type AchievementEntity,
  type UserAchievement,
} from '../../domain/models/AchievementEntity';
import { mapError } from '../../../../lib/errors';

/**
 * src/features/achievement_engine/infrastructure/repositories/SupabaseAchievementRepository.ts
 */
export class SupabaseAchievementRepository implements IAchievementRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAchievementDefinition(id: string): Promise<AchievementEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('achievements')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        type: 'BADGE',
        title: data.name,
        description: data.description || '',
        isSecret: false,
        xpReward: data.xp_reward,
        unlockRules: [
          {
            metricType: data.requirement_type,
            targetValue: data.requirement_value,
          },
        ],
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch achievement definition');
    }
  }

  async getAllDefinitions(): Promise<AchievementEntity[]> {
    try {
      const { data, error } = await this.supabase.from('achievements').select('*');

      if (error) throw error;
      return (data || []).map((row) => ({
        id: row.id,
        type: 'BADGE',
        title: row.name,
        description: row.description || '',
        isSecret: false,
        xpReward: row.xp_reward,
        unlockRules: [
          {
            metricType: row.requirement_type,
            targetValue: row.requirement_value,
          },
        ],
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch achievement definitions');
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return (data || []).map((row) => ({
        userId: row.user_id,
        achievementId: row.achievement_id,
        status: 'UNLOCKED',
        currentProgress: 100,
        unlockedAt: row.unlocked_at,
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch user achievements');
    }
  }

  async saveUserAchievement(userAchievement: UserAchievement): Promise<void> {
    try {
      const { error } = await this.supabase.from('user_achievements').upsert({
        user_id: userAchievement.userId,
        achievement_id: userAchievement.achievementId,
        unlocked_at: userAchievement.unlockedAt || new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save user achievement');
    }
  }
}
