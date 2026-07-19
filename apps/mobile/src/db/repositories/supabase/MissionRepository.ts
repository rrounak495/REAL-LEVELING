/**
 * src/db/repositories/supabase/MissionRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export type MissionRow = Database['public']['Tables']['user_missions']['Row'];
export type MissionInsert = Database['public']['Tables']['user_missions']['Insert'];
export type MissionUpdate = Database['public']['Tables']['user_missions']['Update'];

export interface IMissionRepository {
  getActiveMissions(userId: string): Promise<Result<MissionRow[]>>;
  upsertMissions(missions: MissionInsert[]): Promise<Result<MissionRow[]>>;
  updateProgress(
    missionId: string,
    progress: number,
    isCompleted: boolean,
  ): Promise<Result<MissionRow>>;
  markClaimed(missionId: string): Promise<Result<MissionRow>>;
}

export class MissionRepository implements IMissionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getActiveMissions(userId: string): Promise<Result<MissionRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async upsertMissions(missions: MissionInsert[]): Promise<Result<MissionRow[]>> {
    try {
      const { data, error } = await this.supabase.from('user_missions').upsert(missions).select();

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data: data || [] };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown error', e),
      };
    }
  }

  async updateProgress(
    missionId: string,
    progress: number,
    isCompleted: boolean,
  ): Promise<Result<MissionRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_missions')
        .update({ current_progress: progress, is_completed: isCompleted })
        .eq('id', missionId)
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

  async markClaimed(missionId: string): Promise<Result<MissionRow>> {
    try {
      const { data, error } = await this.supabase
        .from('user_missions')
        .update({ is_claimed: true })
        .eq('id', missionId)
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
