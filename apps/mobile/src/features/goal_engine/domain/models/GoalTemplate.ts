import { type GoalCategory, type GoalDuration } from '../enums/GoalEnums';

/**
 * src/features/goal_engine/domain/models/GoalTemplate.ts
 *
 * Pre-defined goals or AI-suggested goals.
 */
export interface GoalTemplate {
  readonly templateId: string;
  readonly title: string;
  readonly description: string;
  readonly category: GoalCategory;
  readonly recommendedDuration: GoalDuration;
  readonly difficultyRating: number;
  readonly aiMetadata?: Record<string, unknown>;
}
