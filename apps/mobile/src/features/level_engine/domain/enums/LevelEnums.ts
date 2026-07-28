/**
 * src/features/level_engine/domain/enums/LevelEnums.ts
 *
 * Core enumerations for the Level Engine domain.
 */

export type LevelRewardType =
  | 'AVATAR_EVOLUTION'
  | 'CHAPTER_UNLOCK'
  | 'ANIMATION_UNLOCK'
  | 'TITLE_UNLOCK'
  | 'BADGE_UNLOCK'
  | 'PREMIUM_TRIAL'
  | string;

export type UnlockRuleType = 'XP_THRESHOLD' | 'STREAK_REQUIREMENT' | 'CHAPTER_REQUIREMENT';
