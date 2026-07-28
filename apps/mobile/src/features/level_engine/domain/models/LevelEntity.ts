import { type LevelRewardType, type UnlockRuleType } from '../enums/LevelEnums';

/**
 * src/features/level_engine/domain/models/LevelEntity.ts
 *
 * Represents a distinct Level within the system.
 */
export interface LevelEntity {
  readonly levelNumber: number;
  readonly title: string;
  readonly xpRequired: number; // Cumulative or relative XP required to reach this level
  readonly description?: string;

  readonly rewards: readonly LevelReward[];
  readonly unlockRules: readonly LevelUnlockRule[];
}

export interface LevelReward {
  readonly id: string;
  readonly type: LevelRewardType;
  readonly referenceId: string; // ID of the specific avatar, chapter, etc.
  readonly metadata?: Record<string, unknown>;
}

export interface LevelUnlockRule {
  readonly type: UnlockRuleType;
  readonly targetValue: number | string;
}

/**
 * Represents the user's progression state.
 */
export interface LevelProgress {
  readonly userId: string;
  readonly currentLevel: number;
  readonly currentXp: number;
  readonly totalLifetimeXp: number;
  readonly xpRequiredForNext: number;
  readonly isMaxLevel: boolean;
}
