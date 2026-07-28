import { type GoalEntity, type GoalProgress } from '../models/GoalEntity';
import { type GoalTemplate } from '../models/GoalTemplate';

/**
 * src/features/goal_engine/domain/repositories/IGoalRepository.ts
 */
export interface IGoalRepository {
  getActiveGoal(userId: string): Promise<GoalEntity | null>;
  getGoalById(goalId: string): Promise<GoalEntity | null>;
  getGoalProgress(goalId: string): Promise<GoalProgress | null>;

  saveGoal(goal: GoalEntity): Promise<void>;
  updateGoalProgress(progress: GoalProgress): Promise<void>;

  getGoalHistory(userId: string): Promise<GoalEntity[]>;
  getTemplatesByCategory(category: string): Promise<GoalTemplate[]>;
}
