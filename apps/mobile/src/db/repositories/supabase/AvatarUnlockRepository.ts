/**
 * src/db/repositories/supabase/AvatarUnlockRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type AvatarUnlockRow = Database['public']['Tables']['avatar_unlocks']['Row'];
export type UserAvatarUnlockRow = Database['public']['Tables']['user_avatar_unlocks']['Row'];

export interface IAvatarUnlockRepository {
  getAvailableUnlocksForStage(level: number): Promise<Result<AvatarUnlockRow[]>>;
  getUserUnlocks(userId: string): Promise<Result<UserAvatarUnlockRow[]>>;
  grantUnlock(userId: string, unlockId: string): Promise<Result<void>>;
}

export class AvatarUnlockRepository implements IAvatarUnlockRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAvailableUnlocksForStage(level: number): Promise<Result<AvatarUnlockRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_unlocks')
        .select('*')
        .eq('required_level', level);

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: data as AvatarUnlockRow[] };
    } catch (e) {
      return {
        success: false,
        error: new DatabaseError(`Failed to fetch available unlocks for stage ${level}`, e),
      };
    }
  }

  async getUserUnlocks(userId: string): Promise<Result<UserAvatarUnlockRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_avatar_unlocks')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: data as UserAvatarUnlockRow[] };
    } catch (e) {
      return {
        success: false,
        error: new DatabaseError(`Failed to fetch unlocks for user ${userId}`, e),
      };
    }
  }

  async grantUnlock(userId: string, unlockId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.from('user_avatar_unlocks').insert({
        user_id: userId,
        unlock_id: unlockId,
      });

      if (error && error.code !== '23505') {
        // Ignore unique constraint violations
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: undefined };
    } catch (e) {
      return {
        success: false,
        error: new DatabaseError(`Failed to grant unlock ${unlockId} to user ${userId}`, e),
      };
    }
  }
}
