/**
 * src/features/progression/engines/XPEngine.ts
 *
 * Core state transition logic for XP, Levels, and Ranks.
 */
import { LevelEngine } from './LevelEngine';
import { RankEngine, type Rank } from './RankEngine';

export interface ProgressionState {
  totalXp: number;
  level: number;
  rank: Rank;
}

export interface ProgressionResult {
  newState: ProgressionState;
  leveledUp: boolean;
  rankedUp: boolean;
  levelsGained: number;
}

export class XPEngine {
  /**
   * Processes an XP gain and calculates the resulting progression state.
   *
   * @param currentState The user's current progression state.
   * @param xpGained The base amount of XP gained (before multipliers).
   * @param multipliers Optional array of multipliers (e.g. daily bonus, guild bonus).
   * @returns The new progression state and boolean flags for events (level up, rank up).
   */
  static addXp(
    currentState: ProgressionState,
    xpGained: number,
    multipliers: number[] = [1],
  ): ProgressionResult {
    // 1. Calculate effective XP gained
    const totalMultiplier = multipliers.reduce((acc, curr) => acc * curr, 1);
    const effectiveXpGained = Math.floor(xpGained * totalMultiplier);

    // 2. Add to total
    const newTotalXp = currentState.totalXp + effectiveXpGained;

    // 3. Calculate new Level & Rank
    const newLevel = LevelEngine.calculateLevelFromXp(newTotalXp);
    const newRank = RankEngine.calculateRank(newLevel);

    // 4. Determine events
    const leveledUp = newLevel > currentState.level;
    const rankedUp = newRank !== currentState.rank;
    const levelsGained = newLevel - currentState.level;

    return {
      newState: {
        totalXp: newTotalXp,
        level: newLevel,
        rank: newRank,
      },
      leveledUp,
      rankedUp,
      levelsGained,
    };
  }
}
