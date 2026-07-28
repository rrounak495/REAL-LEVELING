import { type MomentumTier } from '../enums/StreakEnums';

/**
 * src/features/streak_engine/domain/models/MomentumEntity.ts
 *
 * Momentum acts as a multiplier or visual state representing the user's velocity.
 */
export interface MomentumEntity {
  readonly userId: string;
  readonly score: number; // 0 to 100
  readonly tier: MomentumTier;
  readonly multiplier: number;
}
