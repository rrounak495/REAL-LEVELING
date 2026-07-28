import {
  type AchievementType,
  type AchievementTier,
  type AchievementStatus,
} from '../enums/AchievementEnums';
import { type AchievementUnlockRule } from './AchievementUnlockRule';

/**
 * src/features/achievement_engine/domain/models/AchievementEntity.ts
 */
export interface AchievementEntity {
  readonly id: string;
  readonly type: AchievementType;
  readonly tier?: AchievementTier;

  readonly title: string;
  readonly description: string;
  readonly iconUrl?: string;

  readonly isSecret: boolean; // If true, description is hidden until unlocked

  readonly xpReward: number;
  readonly unlockRules: readonly AchievementUnlockRule[];
}

export interface UserAchievement {
  readonly userId: string;
  readonly achievementId: string;
  readonly status: AchievementStatus;
  readonly currentProgress: number; // For tracked milestones
  readonly unlockedAt?: string;
}
