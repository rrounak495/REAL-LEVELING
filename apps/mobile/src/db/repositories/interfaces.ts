/**
 * src/db/repositories/interfaces.ts
 *
 * Domain interfaces for data access.
 * These interfaces decouple the application from Supabase, allowing for easy mocking in tests.
 */
import type { Database } from '@/types/database.types';
import type { Result } from '@/lib/errors';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];

export type SkillCategory = Database['public']['Tables']['skill_categories']['Row'];

export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type SkillUpdate = Database['public']['Tables']['skills']['Update'];

export type UserSkill = Database['public']['Tables']['user_skills']['Row'];
export type UserSkillInsert = Database['public']['Tables']['user_skills']['Insert'];
export type UserSkillUpdate = Database['public']['Tables']['user_skills']['Update'];

export interface IProfileRepository {
  getProfile(userId: string): Promise<Result<Profile>>;
  upsertProfile(userId: string, profile: ProfileInsert): Promise<Result<Profile>>;
  updateProfile(userId: string, updates: ProfileUpdate): Promise<Result<Profile>>;

  getUserSettings(userId: string): Promise<Result<UserSettings>>;
  upsertUserSettings(userId: string, settings: UserSettingsInsert): Promise<Result<UserSettings>>;
  updateUserSettings(userId: string, updates: UserSettingsUpdate): Promise<Result<UserSettings>>;
}

export interface ISkillRepository {
  getCategories(): Promise<Result<SkillCategory[]>>;
  getSkillsByCategory(categoryId: string): Promise<Result<Skill[]>>;

  createCustomSkill(skill: SkillInsert): Promise<Result<Skill>>;
  updateCustomSkill(skillId: string, updates: SkillUpdate): Promise<Result<Skill>>;
}

export interface IUserSkillRepository {
  getUserSkills(userId: string): Promise<Result<UserSkill[]>>;
  trackSkill(userId: string, skillId: string): Promise<Result<UserSkill>>;
  updateSkillProgress(
    userId: string,
    skillId: string,
    updates: UserSkillUpdate,
  ): Promise<Result<UserSkill>>;
}
