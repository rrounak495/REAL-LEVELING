/**
 * src/db/repositories/supabase/ProgressionRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError, AppError } from '@/lib/errors';

export type UserProgressionRow = Database['public']['Tables']['user_progression']['Row'];
export type UserProgressionInsert = Database['public']['Tables']['user_progression']['Insert'];
export type UserProgressionUpdate = Database['public']['Tables']['user_progression']['Update'];

export interface IProgressionRepository {
  getProgression(userId: string): Promise<Result<UserProgressionRow>>;
  initializeProgression(userId: string): Promise<Result<UserProgressionRow>>;
  updateProgression(
    userId: string,
    updates: Omit<UserProgressionUpdate, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Result<UserProgressionRow>>;
}

export class ProgressionRepository implements IProgressionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Fetches the user's progression row.
   */
  async getProgression(userId: string): Promise<Result<UserProgressionRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_progression')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // We'll return a specific error or null-equivalent so callers can handle it
          return {
            success: false,
            error: new AppError(
              `Progression not found for user: ${userId}`,
              'PROGRESSION_NOT_FOUND',
            ),
          };
        }
        return { success: false, error: new DatabaseError(error.message, error) };
      }
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  /**
   * Initializes a new progression row for the user.
   */
  async initializeProgression(userId: string): Promise<Result<UserProgressionRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_progression')
        .insert([{ id: userId }])
        .select()
        .single();

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  /**
   * Updates the user's progression (XP, Level, Rank, Coins, Gems).
   */
  async updateProgression(
    userId: string,
    updates: Omit<UserProgressionUpdate, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Result<UserProgressionRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_progression')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }
}
