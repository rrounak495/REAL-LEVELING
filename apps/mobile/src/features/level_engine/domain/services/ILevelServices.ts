import { type LevelEntity, type LevelReward } from '../models/LevelEntity';

/**
 * Event triggered when a user levels up.
 */
export interface LevelUpEvent {
  readonly userId: string;
  readonly oldLevel: number;
  readonly newLevel: number;
  readonly newRewards: readonly LevelReward[];
}

/**
 * src/features/level_engine/domain/services/ILevelService.ts
 */
export interface ILevelService {
  /** Checks if the user's current XP triggers a level up */
  checkLevelUp(userId: string, totalXp: number): Promise<LevelUpEvent | null>;

  /** Grants rewards associated with a newly reached level */
  grantLevelRewards(userId: string, level: number): Promise<void>;
}

/**
 * src/features/level_engine/domain/services/ILevelValidationService.ts
 */
export interface ILevelValidationService {
  canUnlockLevel(userId: string, targetLevel: number): Promise<boolean>;
  validateLevelDefinition(level: LevelEntity): boolean;
}
