import { type SupabaseClient } from '@supabase/supabase-js';
import { type IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { type UserProfile, type UserPreferences } from '../../domain/models/UserProfile';

/**
 * src/features/user_foundation/infrastructure/repositories/SupabaseProfileRepository.ts
 */
export class SupabaseProfileRepository implements IUserProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      onboardingStatus: data.onboarding_status,
      experienceLevel: data.experience_level,
      primaryGoalCategory: data.primary_goal_category,
      premiumStatus: data.premium_status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as UserProfile;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    const { error } = await this.supabase.from('profiles').upsert({
      id: profile.id,
      username: `hunter_${profile.id.substring(0, 8)}`,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl,
      onboarding_status: profile.onboardingStatus,
      experience_level: profile.experienceLevel,
      primary_goal_category: profile.primaryGoalCategory,
      premium_status: profile.premiumStatus,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  async updateOnboardingStatus(userId: string, status: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .update({ onboarding_status: status })
      .eq('id', userId);

    if (error) throw error;
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      userId: data.user_id,
      notificationsEnabled: data.notifications_enabled,
      timezone: data.timezone,
      theme: data.theme,
    };
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    const { error } = await this.supabase.from('user_preferences').upsert({
      user_id: preferences.userId,
      notifications_enabled: preferences.notificationsEnabled,
      timezone: preferences.timezone,
      theme: preferences.theme,
    });

    if (error) throw error;
  }
}
