/**
 * src/db/repositories/supabase/RewardsHistoryRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type RewardHistoryInsert = Database['public']['Tables']['rewards_history']['Insert'];
export type RewardHistoryRow = Database['public']['Tables']['rewards_history']['Row'];

export interface IRewardsHistoryRepository {
  logReward(entry: RewardHistoryInsert): Promise<Result<RewardHistoryRow>>;
  getHistory(userId: string, limit?: number): Promise<Result<RewardHistoryRow[]>>;
}

export class RewardsHistoryRepository implements IRewardsHistoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async logReward(entry: RewardHistoryInsert): Promise<Result<RewardHistoryRow>> {
    try {
      const { data, error } = await this.supabase
        .from('rewards_history')
        .insert(entry)
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

  async getHistory(userId: string, limit = 50): Promise<Result<RewardHistoryRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('rewards_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }
}
