/**
 * src/db/repositories/supabase/StatsRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type UserStatsRow = Database['public']['Tables']['user_stats']['Row'];
export type UserStatsUpdate = Database['public']['Tables']['user_stats']['Update'];

export interface IStatsRepository {
  getStats(userId: string): Promise<Result<UserStatsRow>>;
  updateStats(userId: string, updates: UserStatsUpdate): Promise<Result<UserStatsRow>>;
}

export class StatsRepository implements IStatsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getStats(userId: string): Promise<Result<UserStatsRow>> {
    try {
      let { data, error } = await this.supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Not found, create it
        const insertRes = await this.supabase
          .from('user_stats')
          .insert({ user_id: userId })
          .select()
          .single();
        if (insertRes.error)
          return {
            success: false,
            error: new DatabaseError(insertRes.error.message, insertRes.error),
          };
        data = insertRes.data;
      } else if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: data! };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async updateStats(userId: string, updates: UserStatsUpdate): Promise<Result<UserStatsRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
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
