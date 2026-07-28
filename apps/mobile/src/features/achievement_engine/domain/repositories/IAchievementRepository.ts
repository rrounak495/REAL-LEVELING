import { type AchievementEntity, type UserAchievement } from '../models/AchievementEntity';

/**
 * src/features/achievement_engine/domain/repositories/IAchievementRepository.ts
 */
export interface IAchievementRepository {
  getAchievementDefinition(id: string): Promise<AchievementEntity | null>;
  getAllDefinitions(): Promise<AchievementEntity[]>;

  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  saveUserAchievement(userAchievement: UserAchievement): Promise<void>;
}
