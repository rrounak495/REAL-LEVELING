/**
 * src/features/progression/engines/RankEngine.ts
 *
 * Defines the Rank thresholds and logic for Real Leveling.
 * Ranks are tethered to the player's overall level.
 */

export enum Rank {
  IRON = 'Iron',
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  DIAMOND = 'Diamond',
  MASTER = 'Master',
  SHADOW = 'Shadow',
  MONARCH = 'Monarch',
}

interface RankThreshold {
  rank: Rank;
  minLevel: number;
}

// Ensure this remains sorted descending for easy searching
const RANK_THRESHOLDS: RankThreshold[] = [
  { rank: Rank.MONARCH, minLevel: 100 },
  { rank: Rank.SHADOW, minLevel: 80 },
  { rank: Rank.MASTER, minLevel: 60 },
  { rank: Rank.DIAMOND, minLevel: 50 },
  { rank: Rank.PLATINUM, minLevel: 40 },
  { rank: Rank.GOLD, minLevel: 30 },
  { rank: Rank.SILVER, minLevel: 20 },
  { rank: Rank.BRONZE, minLevel: 10 },
  { rank: Rank.IRON, minLevel: 1 },
];

export class RankEngine {
  /**
   * Calculates the current rank based on the player's level.
   */
  static calculateRank(level: number): Rank {
    for (const threshold of RANK_THRESHOLDS) {
      if (level >= threshold.minLevel) {
        return threshold.rank;
      }
    }
    return Rank.IRON; // Fallback
  }

  /**
   * Returns the minimum level required for a specific rank.
   */
  static getMinLevelForRank(rank: Rank): number {
    const threshold = RANK_THRESHOLDS.find((t) => t.rank === rank);
    return threshold ? threshold.minLevel : 1;
  }
}
