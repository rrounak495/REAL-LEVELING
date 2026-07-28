import { type UserProfile, type UserPreferences } from '../models/UserProfile';

/**
 * src/features/user_foundation/domain/repositories/IUserProfileRepository.ts
 */
export interface IUserProfileRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
  saveProfile(profile: UserProfile): Promise<void>;
  updateOnboardingStatus(userId: string, status: string): Promise<void>;

  getPreferences(userId: string): Promise<UserPreferences | null>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}
