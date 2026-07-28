import {
  type IGoalValidationService,
  type EditGoalPayload,
} from '../../domain/services/IGoalServices';
import { type IGoalRepository } from '../../domain/repositories/IGoalRepository';
import { ValidationError } from '../../../../lib/errors';

export class GoalValidationService implements IGoalValidationService {
  constructor(private readonly goalRepo: IGoalRepository) {}

  async canCreateNewGoal(userId: string): Promise<boolean> {
    const activeGoal = await this.goalRepo.getActiveGoal(userId);
    return activeGoal === null;
  }

  validateGoalPayload(payload: EditGoalPayload): boolean {
    if (!payload.title || payload.title.trim().length < 3) {
      throw new ValidationError('Goal title must be at least 3 characters long');
    }
    if (!payload.category) {
      throw new ValidationError('Goal category is required');
    }
    if (!payload.durationDays || payload.durationDays <= 0) {
      throw new ValidationError('Goal duration is invalid');
    }
    return true;
  }
}
