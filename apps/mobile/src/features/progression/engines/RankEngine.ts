/**
 * src/features/progression/engines/RankEngine.ts
 *
 * Defines the Rank thresholds and logic for Real Leveling.
 * Ranks are tethered to the player's overall level.
 */

export enum Rank {
  UNRANKED = 'Unranked',
  E_RANK = 'E Rank',
  D_RANK = 'D Rank',
  C_RANK = 'C Rank',
  B_RANK = 'B Rank',
  A_RANK = 'A Rank',
  S_RANK = 'S Rank',
  SS_RANK = 'SS Rank',
  SSS_RANK = 'SSS Rank',
  NATIONAL_RANK = 'National Rank',
  MONARCH = 'Monarch',
}

interface RankThreshold {
  rank: Rank;
  minLevel: number;
}

// Ensure this remains sorted descending for easy searching
const RANK_THRESHOLDS: RankThreshold[] = [
  { rank: Rank.MONARCH, minLevel: 150 },
  { rank: Rank.NATIONAL_RANK, minLevel: 100 },
  { rank: Rank.SSS_RANK, minLevel: 95 },
  { rank: Rank.SS_RANK, minLevel: 90 },
  { rank: Rank.S_RANK, minLevel: 80 },
  { rank: Rank.A_RANK, minLevel: 60 },
  { rank: Rank.B_RANK, minLevel: 40 },
  { rank: Rank.C_RANK, minLevel: 20 },
  { rank: Rank.D_RANK, minLevel: 10 },
  { rank: Rank.E_RANK, minLevel: 5 },
  { rank: Rank.UNRANKED, minLevel: 1 },
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
    return Rank.UNRANKED; // Fallback
  }

  /**
   * Returns the minimum level required for a specific rank.
   */
  static getMinLevelForRank(rank: Rank): number {
    const threshold = RANK_THRESHOLDS.find((t) => t.rank === rank);
    return threshold ? threshold.minLevel : 1;
  }
}
