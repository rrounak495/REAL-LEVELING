/**
 * src/features/user_foundation/domain/models/UserProfile.ts
 */

export type OnboardingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type PremiumStatus = 'FREE' | 'PREMIUM' | 'TRIAL';

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly displayName?: string;
  readonly avatarUrl?: string;

  readonly onboardingStatus: OnboardingStatus;
  readonly experienceLevel: string; // e.g., BEGINNER, INTERMEDIATE
  readonly primaryGoalCategory: string; // e.g., FITNESS, CAREER
  readonly premiumStatus: PremiumStatus;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserPreferences {
  readonly userId: string;
  readonly notificationsEnabled: boolean;
  readonly timezone: string;
  readonly theme: 'light' | 'dark' | 'system';
}
