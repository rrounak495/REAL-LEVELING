/**
 * constants/game-balance.ts — Game Balance Constants
 *
 * SINGLE SOURCE OF TRUTH for all game balance numbers.
 * Never hardcode XP amounts, level thresholds, or multipliers in components.
 * If balance needs tuning, change it here — everything updates automatically.
 *
 * XP Curve: XP_to_level = 100 * level^1.8
 * (Approved in Game Design Document)
 */

// ── XP System ─────────────────────────────────────────────────────────────

/** XP required to reach a given level from level 1. */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.8));
}

/** XP delta between consecutive levels. */
export function xpBetweenLevels(fromLevel: number, toLevel: number): number {
  return xpRequiredForLevel(toLevel) - xpRequiredForLevel(fromLevel);
}

/** Maximum player level (SS rank cap). */
export const MAX_LEVEL = 100;

/** Starting level for new players. */
export const STARTING_LEVEL = 1;

// ── Stat System ───────────────────────────────────────────────────────────

/** Maximum value any stat can reach at MAX_LEVEL. */
export const MAX_STAT_VALUE = 100;

/** Starting stat value for new players. */
export const STARTING_STAT_VALUE = 1;

/** XP multiplier when completing quests aligned to your primary stat. */
export const PRIMARY_STAT_XP_MULTIPLIER = 1.25;

// ── Streak System ─────────────────────────────────────────────────────────

/** Streak bonus XP per day of streak. */
export const STREAK_BONUS_XP_PER_DAY = 5;

/** Maximum streak bonus XP (caps at 30 days). */
export const MAX_STREAK_BONUS_XP = 150;

/** Grace period in hours after midnight before streak breaks. */
export const STREAK_GRACE_PERIOD_HOURS = 6;

// ── Quest XP Rewards ─────────────────────────────────────────────────────

export const QUEST_BASE_XP: Record<string, number> = {
  F: 10,
  E: 25,
  D: 50,
  C: 100,
  B: 200,
  A: 400,
  S: 750,
  SS: 1500,
  SSS: 3000,
};

// ── Freemium Limits ───────────────────────────────────────────────────────

/** Max AI-generated quests per week for free users. */
export const FREE_AI_QUESTS_PER_WEEK = 3;

/** Max AI-generated quests per week for Premium users. */
export const PREMIUM_AI_QUESTS_PER_WEEK = Infinity;
