import * as Crypto from 'expo-crypto';
import {
  type IGoalService,
  type IGoalValidationService,
  type EditGoalPayload,
} from '../../domain/services/IGoalServices';
import { type IGoalRepository } from '../../domain/repositories/IGoalRepository';
import { type GoalEntity, type GoalProgress } from '../../domain/models/GoalEntity';
import { AppError } from '../../../../lib/errors';

export class GoalService implements IGoalService {
  constructor(
    private readonly goalRepo: IGoalRepository,
    private readonly validationService: IGoalValidationService,
  ) {}

  async createGoal(userId: string, payload: EditGoalPayload): Promise<GoalEntity> {
    const canCreate = await this.validationService.canCreateNewGoal(userId);
    if (!canCreate) {
      throw new AppError(
        'User already has an active goal. Complete or abandon it first.',
        'VALIDATION_ERROR',
      );
    }

    this.validationService.validateGoalPayload(payload);

    const newGoal: any = {
      id: Crypto.randomUUID(),
      userId,
      title: payload.title,
      category: payload.category,
      durationDays: payload.durationDays,
      startDate: payload.startDate || new Date().toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (payload.description !== undefined) {
      newGoal.description = payload.description;
    }

    await this.goalRepo.saveGoal(newGoal);
    return newGoal;
  }

  async editGoal(goalId: string, payload: EditGoalPayload): Promise<GoalEntity> {
    this.validationService.validateGoalPayload(payload);

    const goal = await this.goalRepo.getGoalById(goalId);
    if (!goal) {
      throw new AppError('Goal not found', 'NOT_FOUND');
    }

    if (goal.status !== 'ACTIVE') {
      throw new AppError('Cannot edit an inactive goal', 'VALIDATION_ERROR');
    }

    const updatedGoal: any = {
      ...goal,
      title: payload.title,
      category: payload.category,
      durationDays: payload.durationDays,
      updatedAt: new Date().toISOString(),
    };

    if (payload.description !== undefined) {
      updatedGoal.description = payload.description;
    }

    await this.goalRepo.saveGoal(updatedGoal);
    return updatedGoal;
  }

  async abandonGoal(goalId: string): Promise<void> {
    const goal = await this.goalRepo.getGoalById(goalId);
    if (!goal) throw new AppError('Goal not found', 'NOT_FOUND');
    if (goal.status !== 'ACTIVE') throw new AppError('Goal is not active', 'VALIDATION_ERROR');

    const updatedGoal: GoalEntity = {
      ...goal,
      status: 'ABANDONED',
      updatedAt: new Date().toISOString(),
    };
    await this.goalRepo.saveGoal(updatedGoal);
  }

  async completeGoal(goalId: string): Promise<void> {
    const goal = await this.goalRepo.getGoalById(goalId);
    if (!goal) throw new AppError('Goal not found', 'NOT_FOUND');
    if (goal.status !== 'ACTIVE') throw new AppError('Goal is not active', 'VALIDATION_ERROR');

    const updatedGoal: GoalEntity = {
      ...goal,
      status: 'COMPLETED',
      updatedAt: new Date().toISOString(),
    };
    await this.goalRepo.saveGoal(updatedGoal);
  }

  async processDailyGoalProgress(goalId: string, daySuccess: boolean): Promise<GoalProgress> {
    const progress = await this.goalRepo.getGoalProgress(goalId);
    if (!progress) throw new AppError('Goal progress not found', 'NOT_FOUND');

    const goal = await this.goalRepo.getGoalById(goalId);
    if (!goal) throw new AppError('Goal not found', 'NOT_FOUND');
    if (goal.status !== 'ACTIVE') throw new AppError('Goal is not active', 'VALIDATION_ERROR');

    // Move to next day regardless of success (for 21 day challenge format)
    const nextDay = progress.currentDay + 1;
    const completedDays = daySuccess ? progress.completedDays + 1 : progress.completedDays;
    const percentComplete = Math.round((completedDays / goal.durationDays) * 100);

    const newProgress: GoalProgress = {
      goalId,
      currentDay: nextDay,
      completedDays,
      percentComplete,
    };

    await this.goalRepo.updateGoalProgress(newProgress);

    if (completedDays >= goal.durationDays) {
      await this.completeGoal(goalId);
    }

    return newProgress;
  }
}
