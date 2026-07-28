import { type IAchievementService } from '../../domain/services/IAchievementServices';
import { type IAchievementRepository } from '../../domain/repositories/IAchievementRepository';
import { type UserAchievement } from '../../domain/models/AchievementEntity';
import { AppError } from '../../../../lib/errors';

export class AchievementService implements IAchievementService {
  constructor(private readonly achievementRepo: IAchievementRepository) {}

  async processEvent(
    userId: string,
    metricType: string,
    newValue: number,
  ): Promise<UserAchievement[]> {
    const unlockedAchievements: UserAchievement[] = [];

    // Get all definitions and user achievements
    const allDefs = await this.achievementRepo.getAllDefinitions();
    const userAchievements = await this.achievementRepo.getUserAchievements(userId);
    const userAchMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    for (const def of allDefs) {
      const existing = userAchMap.get(def.id);

      if (existing?.status === 'UNLOCKED') {
        continue; // Already unlocked
      }

      // Check rules
      let requirementsMet = true;
      let newProgress = existing?.currentProgress || 0;

      for (const rule of def.unlockRules) {
        if (rule.metricType === metricType) {
          newProgress = Math.max(newProgress, newValue);
        }

        if (newProgress < rule.targetValue) {
          requirementsMet = false;
        }
      }

      if (requirementsMet) {
        const newlyUnlocked: UserAchievement = {
          userId,
          achievementId: def.id,
          status: 'UNLOCKED',
          currentProgress: newProgress,
          unlockedAt: new Date().toISOString(),
        };
        await this.achievementRepo.saveUserAchievement(newlyUnlocked);
        unlockedAchievements.push(newlyUnlocked);
      } else if (newProgress > (existing?.currentProgress || 0)) {
        // Just update progress
        const updatedProgress: UserAchievement = {
          userId,
          achievementId: def.id,
          status: 'IN_PROGRESS',
          currentProgress: newProgress,
        };
        await this.achievementRepo.saveUserAchievement(updatedProgress);
      }
    }

    return unlockedAchievements;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const def = await this.achievementRepo.getAchievementDefinition(achievementId);
    if (!def) throw new AppError('Achievement definition not found', 'NOT_FOUND');

    const unlocked: UserAchievement = {
      userId,
      achievementId,
      status: 'UNLOCKED',
      currentProgress: def.unlockRules[0]?.targetValue || 1, // Assume max progress if manually unlocked
      unlockedAt: new Date().toISOString(),
    };

    await this.achievementRepo.saveUserAchievement(unlocked);
    return unlocked;
  }
}
