/**
 * src/db/repositories/supabase/ProfileRepository.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  IProfileRepository,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  UserSettings,
  UserSettingsInsert,
  UserSettingsUpdate,
} from '../interfaces';
import {
  type Result,
  ProfileNotFoundError,
  UserSettingsNotFoundError,
  DatabaseError,
} from '@/lib/errors';

export class ProfileRepository implements IProfileRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getProfile(userId: string): Promise<Result<Profile>> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116')
          return { success: false, error: new ProfileNotFoundError(userId) };
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

  async upsertProfile(userId: string, profile: ProfileInsert): Promise<Result<Profile>> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .upsert({ ...profile, id: userId })
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

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Result<Profile>> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
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

  async getUserSettings(userId: string): Promise<Result<UserSettings>> {
    try {
      const { data, error } = await this.supabase
        .from('user_settings')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116')
          return { success: false, error: new UserSettingsNotFoundError(userId) };
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

  async upsertUserSettings(
    userId: string,
    settings: UserSettingsInsert,
  ): Promise<Result<UserSettings>> {
    try {
      const { data, error } = await this.supabase
        .from('user_settings')
        .upsert({ ...settings, id: userId })
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

  async updateUserSettings(
    userId: string,
    updates: UserSettingsUpdate,
  ): Promise<Result<UserSettings>> {
    try {
      const { data, error } = await this.supabase
        .from('user_settings')
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
