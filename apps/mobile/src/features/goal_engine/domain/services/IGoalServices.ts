import { type GoalEntity, type GoalProgress } from '../models/GoalEntity';
import { type GoalCategory, type GoalDuration } from '../enums/GoalEnums';

export interface EditGoalPayload {
  readonly title: string;
  readonly description?: string;
  readonly category: GoalCategory;
  readonly durationDays: GoalDuration;
  readonly startDate: string | null;
}

/**
 * src/features/goal_engine/domain/services/IGoalServices.ts
 */
export interface IGoalService {
  createGoal(userId: string, payload: EditGoalPayload): Promise<GoalEntity>;
  editGoal(goalId: string, payload: EditGoalPayload): Promise<GoalEntity>;
  abandonGoal(goalId: string): Promise<void>;
  completeGoal(goalId: string): Promise<void>;

  processDailyGoalProgress(goalId: string, daySuccess: boolean): Promise<GoalProgress>;
}

export interface IGoalValidationService {
  canCreateNewGoal(userId: string): Promise<boolean>;
  validateGoalPayload(payload: EditGoalPayload): boolean;
}
