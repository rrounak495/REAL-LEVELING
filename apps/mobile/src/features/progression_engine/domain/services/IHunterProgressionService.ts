/**
 * src/features/progression_engine/domain/services/IHunterProgressionService.ts
 */

export interface ProgressionResult {
  readonly leveledUp: boolean;
  readonly levelsGained: number;
  readonly oldLevel: number;
  readonly newLevel: number;
  readonly currentXp: number;
  readonly lifetimeXp: number;
  readonly xpRequiredForNext: number;
  readonly duplicate: boolean;
}

export interface IHunterProgressionService {
  /**
   * Process a mission completion, preventing duplicate rewards for the same day,
   * calculating unbounded level growth, preserving XP overflow, and saving to persistence.
   */
  processMissionCompletion(
    userId: string,
    missionId: string,
    xpReward: number,
  ): Promise<ProgressionResult>;
}
