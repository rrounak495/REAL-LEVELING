/**
 * src/db/repositories/supabase/AvatarEvolutionRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type AvatarEvolutionLevelRow =
  Database['public']['Tables']['avatar_evolution_levels']['Row'];

export interface IAvatarEvolutionRepository {
  getEvolutionLevels(): Promise<Result<AvatarEvolutionLevelRow[]>>;
  getEvolutionLevel(level: number): Promise<Result<AvatarEvolutionLevelRow>>;
}

export class AvatarEvolutionRepository implements IAvatarEvolutionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getEvolutionLevels(): Promise<Result<AvatarEvolutionLevelRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_evolution_levels')
        .select('*')
        .order('level', { ascending: true });

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: data as AvatarEvolutionLevelRow[] };
    } catch (e) {
      return {
        success: false,
        error: new DatabaseError('Failed to fetch avatar evolution levels', e),
      };
    }
  }

  async getEvolutionLevel(level: number): Promise<Result<AvatarEvolutionLevelRow>> {
    try {
      const { data, error } = await this.supabase
        .from('avatar_evolution_levels')
        .select('*')
        .eq('level', level)
        .single();

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: data as AvatarEvolutionLevelRow };
    } catch (e) {
      return {
        success: false,
        error: new DatabaseError(`Failed to fetch avatar evolution level ${level}`, e),
      };
    }
  }
}
