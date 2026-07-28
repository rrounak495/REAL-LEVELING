/**
 * src/features/xp_engine/domain/models/XpLevel.ts
 *
 * Represents the user's current level state.
 */
export interface XpLevel {
  /** The user's absolute total accumulated XP over their lifetime */
  readonly totalXp: number;

  /** The user's current level (derived from totalXp) */
  readonly currentLevel: number;

  /** Total XP required to reach the next level from the current level */
  readonly xpForNextLevel: number;

  /** XP accumulated within the current level boundary */
  readonly xpIntoCurrentLevel: number;
}
