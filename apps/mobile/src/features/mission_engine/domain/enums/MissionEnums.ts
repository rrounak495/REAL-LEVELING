/**
 * src/features/mission_engine/domain/enums/MissionEnums.ts
 *
 * Core enums and string unions for the Mission Engine domain.
 */

export type MissionCategory =
  | 'FITNESS'
  | 'STUDY'
  | 'CODING'
  | 'CAREER'
  | 'BUSINESS'
  | 'READING'
  | 'MINDFULNESS'
  | 'HEALTH'
  | 'CUSTOM'
  | string; // Allows unlimited future categories without breaking types

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED';

export type MissionType = 'CORE' | 'BOOST' | 'LIFESTYLE' | 'LEGENDARY' | 'RECOVERY';

export type MissionStatus =
  'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'RECOVERY';

export type CompletionMode = 'QUANTITY' | 'TIME' | 'BOOLEAN';
