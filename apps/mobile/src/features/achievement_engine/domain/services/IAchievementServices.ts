import { type UserAchievement } from '../models/AchievementEntity';

/**
 * src/features/achievement_engine/domain/services/IAchievementServices.ts
 */
export interface IAchievementService {
  /**
   * Processes a specific event to see if it unlocks an achievement.
   */
  processEvent(userId: string, metricType: string, newValue: number): Promise<UserAchievement[]>;

  /**
   * Unlocks an achievement manually (e.g., secret achievement via QR code).
   */
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
}
