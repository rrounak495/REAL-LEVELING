/**
 * src/features/goal_engine/domain/enums/GoalEnums.ts
 */

export type GoalCategory =
  'FITNESS' | 'NUTRITION' | 'MENTAL' | 'SKILL' | 'LIFESTYLE' | 'CUSTOM' | string;

export type GoalStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'FAILED';

export type GoalDuration = 7 | 14 | 21 | 30 | 60 | 90 | number;
