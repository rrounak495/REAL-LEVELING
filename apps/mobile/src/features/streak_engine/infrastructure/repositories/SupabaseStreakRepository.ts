import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type ExtendedDatabase } from '../../../../types/extended-database.types';
import { type IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { type StreakEntity } from '../../domain/models/StreakEntity';
import { type MomentumEntity } from '../../domain/models/MomentumEntity';
import { mapError } from '../../../../lib/errors';

export class SupabaseStreakRepository implements IStreakRepository {
  private readonly supabase: SupabaseClient<ExtendedDatabase>;

  constructor(client: SupabaseClient<Database>) {
    this.supabase = client as unknown as SupabaseClient<ExtendedDatabase>;
  }

  async getStreak(userId: string): Promise<StreakEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        userId,
        currentDailyStreak: data.current_streak || 0,
        longestDailyStreak: data.longest_streak || 0,
        currentWeeklyStreak: 0,
        currentMonthlyStreak: 0,
        status: 'ACTIVE',
        lastActiveDate: data.last_active_date || new Date().toISOString(),
        availableFreezes: 0,
        activeRecoveryType: null,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch streak');
    }
  }

  async saveStreak(streak: StreakEntity): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('stats')
        .update({
          current_streak: streak.currentDailyStreak,
          longest_streak: streak.longestDailyStreak,
          last_active_date: streak.lastActiveDate,
        })
        .eq('user_id', streak.userId);

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save streak');
    }
  }

  async getMomentum(userId: string): Promise<MomentumEntity | null> {
    return {
      userId,
      score: 50,
      tier: 'WARMING_UP',
      multiplier: 1.0,
    };
  }

  async saveMomentum(momentum: MomentumEntity): Promise<void> {
    // Stub
  }
}
