import {
  type ILevelService,
  type ILevelValidationService,
  type LevelUpEvent,
} from '../../domain/services/ILevelServices';
import { type ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { AppError } from '../../../../lib/errors';

export class LevelService implements ILevelService {
  constructor(
    private readonly levelRepo: ILevelRepository,
    private readonly validationService: ILevelValidationService,
  ) {}

  async checkLevelUp(userId: string, totalXp: number): Promise<LevelUpEvent | null> {
    const progress = await this.levelRepo.getUserProgress(userId);
    if (!progress) return null;

    const currentLevel = progress.currentLevel;
    const nextLevelDef = await this.levelRepo.getLevelDefinition(currentLevel + 1);

    if (!nextLevelDef) {
      // User is at max level or definition doesn't exist
      return null;
    }

    if (totalXp >= nextLevelDef.xpRequired) {
      // Can they unlock it?
      const canUnlock = await this.validationService.canUnlockLevel(
        userId,
        nextLevelDef.levelNumber,
      );
      if (canUnlock) {
        // We found a level up!
        return {
          userId,
          oldLevel: currentLevel,
          newLevel: nextLevelDef.levelNumber,
          newRewards: nextLevelDef.rewards,
        };
      }
    }

    return null;
  }

  async grantLevelRewards(userId: string, level: number): Promise<void> {
    const levelDef = await this.levelRepo.getLevelDefinition(level);
    if (!levelDef) throw new AppError('Level definition not found', 'NOT_FOUND');

    // Here we would interact with InventoryService / UnlockService to actually grant the rewards
    // based on levelDef.rewards.
  }
}
