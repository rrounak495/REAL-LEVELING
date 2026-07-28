import { type ILevelValidationService } from '../../domain/services/ILevelServices';
import { type LevelEntity } from '../../domain/models/LevelEntity';
import { type ILevelRepository } from '../../domain/repositories/ILevelRepository';

export class LevelValidationService implements ILevelValidationService {
  constructor(private readonly levelRepo: ILevelRepository) {}

  async canUnlockLevel(userId: string, targetLevel: number): Promise<boolean> {
    const progress = await this.levelRepo.getUserProgress(userId);
    if (!progress) return false;

    // Must be at least the previous level to unlock the target level
    if (progress.currentLevel < targetLevel - 1) {
      return false;
    }

    return true;
  }

  validateLevelDefinition(level: LevelEntity): boolean {
    if (level.levelNumber <= 0) return false;
    if (level.xpRequired < 0) return false;
    if (!level.title || level.title.trim() === '') return false;
    return true;
  }
}
