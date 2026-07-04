/**
 * src/features/progression/engines/LevelEngine.ts
 *
 * Core mathematics for level scaling.
 * Supports infinite scaling based on a polynomial progression curve.
 */

export class LevelEngine {
  /**
   * Base XP required for Level 2 (from Level 1).
   */
  private static readonly BASE_XP = 1000;

  /**
   * The exponent that dictates how steeply the XP requirement scales.
   * E.g. 1.5 means each level requires more XP than the last in a curved manner.
   */
  private static readonly EXPONENT = 1.5;

  /**
   * Maximum level supported (though the math scales infinitely, we can cap it if needed).
   */
  public static readonly MAX_LEVEL = 100;

  /**
   * Calculates the TOTAL cumulative XP required to reach a specific level.
   * Total XP = BaseXP * (Level - 1) ^ Exponent
   */
  static calculateTotalXpRequiredForLevel(level: number): number {
    if (level <= 1) return 0;
    // We calculate total XP from start to this level
    // A simple formula for cumulative XP threshold:
    return Math.floor(this.BASE_XP * Math.pow(level - 1, this.EXPONENT));
  }

  /**
   * Determines the current level based on the total accumulated XP.
   */
  static calculateLevelFromXp(totalXp: number): number {
    if (totalXp < 0) return 1;
    if (totalXp === 0) return 1;

    // Inverse of the total XP formula:
    // Level = (TotalXP / BaseXP) ^ (1 / Exponent) + 1
    const rawLevel = Math.pow(totalXp / this.BASE_XP, 1 / this.EXPONENT) + 1;
    return Math.floor(rawLevel);
  }

  /**
   * Returns how much XP is needed for the CURRENT level up.
   * (Difference between XP threshold for Next Level and XP threshold for Current Level)
   */
  static calculateXpForNextLevel(currentLevel: number): number {
    const currentThreshold = this.calculateTotalXpRequiredForLevel(currentLevel);
    const nextThreshold = this.calculateTotalXpRequiredForLevel(currentLevel + 1);
    return nextThreshold - currentThreshold;
  }

  /**
   * Returns the progress towards the next level as a percentage (0.0 to 1.0).
   */
  static calculateProgressPercentage(totalXp: number, currentLevel: number): number {
    const currentLevelTotalXp = this.calculateTotalXpRequiredForLevel(currentLevel);
    const nextLevelTotalXp = this.calculateTotalXpRequiredForLevel(currentLevel + 1);

    const xpIntoLevel = totalXp - currentLevelTotalXp;
    const xpNeededForNext = nextLevelTotalXp - currentLevelTotalXp;

    if (xpNeededForNext <= 0) return 1;
    return Math.max(0, Math.min(1, xpIntoLevel / xpNeededForNext));
  }
}
