/**
 * src/features/xp_engine/domain/enums/XpEnums.ts
 *
 * Core enumerations and string unions for the XP Engine domain.
 */

export type XpSource =
  | 'MISSION_CORE'
  | 'MISSION_BOOST'
  | 'MISSION_LIFESTYLE'
  | 'MISSION_LEGENDARY'
  | 'MISSION_RECOVERY'
  | 'DAILY_BONUS'
  | 'STREAK_MILESTONE'
  | 'CHAPTER_COMPLETION'
  | 'MANUAL_GRANT'
  | string; // Extensible for future sources

export type XpModifierType =
  | 'DIFFICULTY_MULTIPLIER'
  | 'STREAK_BONUS'
  | 'CHAPTER_BONUS'
  | 'RECOVERY_BONUS'
  | 'PREMIUM_BONUS'
  | 'AI_DYNAMIC_MODIFIER'
  | string; // Extensible for future modifiers
