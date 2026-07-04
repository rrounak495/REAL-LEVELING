/**
 * src/db/repositories/supabase/UserSkillRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { IUserSkillRepository, UserSkill, UserSkillUpdate } from '../interfaces';
import { type Result, DatabaseError } from '@/lib/errors';

export class UserSkillRepository implements IUserSkillRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getUserSkills(userId: string): Promise<Result<UserSkill[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  async trackSkill(userId: string, skillId: string): Promise<Result<UserSkill>> {
    try {
      const { data, error } = await this.supabase
        .from('user_skills')
        .insert({ user_id: userId, skill_id: skillId })
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

  async updateSkillProgress(
    userId: string,
    skillId: string,
    updates: UserSkillUpdate,
  ): Promise<Result<UserSkill>> {
    try {
      const { data, error } = await this.supabase
        .from('user_skills')
        .update({ ...updates, last_activity_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('skill_id', skillId)
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
