import AsyncStorage from '@react-native-async-storage/async-storage';
import { type GoalEntity, type GoalProgress } from '../../domain/models/GoalEntity';
import { type GoalTemplate } from '../../domain/models/GoalTemplate';
import { type IGoalRepository } from '../../domain/repositories/IGoalRepository';

const STORAGE_KEY_GOALS = '@real_leveling_goals';
const STORAGE_KEY_PROGRESS = '@real_leveling_goal_progress';

export class LocalGoalRepository implements IGoalRepository {
  private async getStoredGoals(): Promise<Record<string, GoalEntity>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_GOALS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('LocalGoalRepository: Error reading goals', e);
      return {};
    }
  }

  private async saveStoredGoals(data: Record<string, GoalEntity>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(data));
    } catch (e) {
      console.error('LocalGoalRepository: Error saving goals', e);
    }
  }

  private async getStoredProgress(): Promise<Record<string, GoalProgress>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('LocalGoalRepository: Error reading progress', e);
      return {};
    }
  }

  private async saveStoredProgress(data: Record<string, GoalProgress>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
    } catch (e) {
      console.error('LocalGoalRepository: Error saving progress', e);
    }
  }

  async getActiveGoal(userId: string): Promise<GoalEntity | null> {
    const goals = await this.getStoredGoals();
    for (const key in goals) {
      const goal = goals[key];
      if (goal && goal.userId === userId && (goal.status as string) === 'ACTIVE') {
        return goal as GoalEntity;
      }
    }
    return null;
  }

  async getGoalById(goalId: string): Promise<GoalEntity | null> {
    const goals = await this.getStoredGoals();
    return goals[goalId] || null;
  }

  async getGoalProgress(goalId: string): Promise<GoalProgress | null> {
    const progressMap = await this.getStoredProgress();
    return progressMap[goalId] || null;
  }

  async saveGoal(goal: GoalEntity): Promise<void> {
    const goals = await this.getStoredGoals();
    goals[goal.id] = goal;
    await this.saveStoredGoals(goals);

    // Auto-initialize progress for a new goal if not present
    const progressMap = await this.getStoredProgress();
    if (!progressMap[goal.id]) {
      progressMap[goal.id] = {
        goalId: goal.id,
        currentDay: 1,
        completedDays: 0,
        percentComplete: 0,
        statusMessage: 'Journey initialized.',
      } as GoalProgress;
      await this.saveStoredProgress(progressMap);
    }
  }

  async updateGoalProgress(progress: GoalProgress): Promise<void> {
    const progressMap = await this.getStoredProgress();
    progressMap[progress.goalId] = progress;
    await this.saveStoredProgress(progressMap);
  }

  async getGoalHistory(userId: string): Promise<GoalEntity[]> {
    const goals = await this.getStoredGoals();
    return Object.values(goals).filter(
      (g) => g.userId === userId && (g.status === 'COMPLETED' || g.status === 'ABANDONED'),
    );
  }

  async getTemplatesByCategory(category: string): Promise<GoalTemplate[]> {
    // Return empty for now as this requires a pre-seeded local database of templates.
    // In MVP Sprint 1, templates are handled locally or via onboarding.
    return [];
  }
}
