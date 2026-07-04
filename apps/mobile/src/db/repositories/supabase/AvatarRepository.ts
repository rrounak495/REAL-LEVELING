/**
 * src/db/repositories/supabase/AvatarRepository.ts
 *
 * Manages reading and writing of the `avatar_configs` table.
 * Follows the same Result<T, E> pattern as other repositories.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError, AppError } from '@/lib/errors';

export type AvatarConfigRow = Database['public']['Tables']['avatar_configs']['Row'];
export type AvatarConfigInsert = Database['public']['Tables']['avatar_configs']['Insert'];
export type AvatarConfigUpdate = Database['public']['Tables']['avatar_configs']['Update'];

export interface IAvatarRepository {
  getAvatarConfig(userId: string): Promise<Result<AvatarConfigRow>>;
  upsertAvatarConfig(
    userId: string,
    config: Omit<AvatarConfigInsert, 'id'>,
  ): Promise<Result<AvatarConfigRow>>;
  updateAvatarConfig(userId: string, updates: AvatarConfigUpdate): Promise<Result<AvatarConfigRow>>;
}

export class AvatarRepository implements IAvatarRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAvatarConfig(userId: string): Promise<Result<AvatarConfigRow>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_configs')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: new AppError(`Avatar config not found for user: ${userId}`, 'AVATAR_NOT_FOUND'),
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

  async upsertAvatarConfig(
    userId: string,
    config: Omit<AvatarConfigInsert, 'id'>,
  ): Promise<Result<AvatarConfigRow>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_configs')
        .upsert({ ...config, id: userId })
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

  async updateAvatarConfig(
    userId: string,
    updates: AvatarConfigUpdate,
  ): Promise<Result<AvatarConfigRow>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_configs')
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
