import { type GoalCategory, type GoalStatus, type GoalDuration } from '../enums/GoalEnums';

/**
 * src/features/goal_engine/domain/models/GoalEntity.ts
 *
 * The core aggregate root for the user's Primary Goal.
 */
export interface GoalEntity {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description?: string;
  readonly category: GoalCategory;

  readonly durationDays: GoalDuration;
  readonly startDate: string | null; // ISO Date

  readonly status: GoalStatus;

  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Snapshot of a user's progress within their active goal.
 */
export interface GoalProgress {
  readonly goalId: string;
  readonly currentDay: number;
  readonly completedDays: number;
  readonly percentComplete: number;
  readonly statusMessage?: string;
}
