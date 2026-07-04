/**
 * src/db/repositories/supabase/SkillRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  ISkillRepository,
  Skill,
  SkillCategory,
  SkillInsert,
  SkillUpdate,
} from '../interfaces';
import { type Result, DatabaseError, AppError } from '@/lib/errors';

export class SkillRepository implements ISkillRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCategories(): Promise<Result<SkillCategory[]>> {
    try {
      const { data, error } = await this.supabase
        .from('skill_categories')
        .select('*')
        .order('name');

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  async getSkillsByCategory(categoryId: string): Promise<Result<Skill[]>> {
    try {
      const { data, error } = await this.supabase
        .from('skills')
        .select('*')
        .eq('category_id', categoryId)
        .order('name');

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  async createCustomSkill(skill: SkillInsert): Promise<Result<Skill>> {
    if (skill.is_system) {
      return {
        success: false,
        error: new AppError('Clients cannot create system skills', 'INVALID_SKILL_TYPE'),
      };
    }

    try {
      const { data, error } = await this.supabase.from('skills').insert(skill).select().single();

      if (error) return { success: false, error: new DatabaseError(error.message, error) };
      return { success: true, data };
    } catch (e: unknown) {
      return {
        success: false,
        error: new DatabaseError(e instanceof Error ? e.message : 'Unknown database error', e),
      };
    }
  }

  async updateCustomSkill(skillId: string, updates: SkillUpdate): Promise<Result<Skill>> {
    if (updates.is_system) {
      return {
        success: false,
        error: new AppError('Clients cannot modify system skill flags', 'INVALID_SKILL_TYPE'),
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('skills')
        .update(updates)
        .eq('id', skillId)
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
