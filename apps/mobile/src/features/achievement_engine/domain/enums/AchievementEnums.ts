/**
 * src/features/achievement_engine/domain/enums/AchievementEnums.ts
 */

export type AchievementType =
  | 'BADGE'
  | 'TITLE'
  | 'MILESTONE'
  | 'SECRET'
  | 'CHAPTER_COMPLETION'
  | 'MISSION_STREAK'
  | 'XP_MILESTONE'
  | 'PREMIUM';

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export type AchievementStatus = 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED';
