import { type IStreakValidationService } from '../../domain/services/IStreakServices';
import { type StreakEntity } from '../../domain/models/StreakEntity';

export class StreakValidationService implements IStreakValidationService {
  canApplyFreeze(streak: StreakEntity): boolean {
    if (streak.status === 'FROZEN') return false;
    if (streak.status === 'LOST') return false;
    return streak.availableFreezes > 0;
  }

  isAtRisk(streak: StreakEntity, currentDate: string): boolean {
    if (streak.status !== 'ACTIVE') return false;
    if (!streak.lastActiveDate) return false;

    // Check if the difference between currentDate and lastActiveDate is more than 1 day
    const lastActive = new Date(streak.lastActiveDate);
    const current = new Date(currentDate);

    // Normalize to midnight UTC for pure date math
    lastActive.setUTCHours(0, 0, 0, 0);
    current.setUTCHours(0, 0, 0, 0);

    const diffTime = Math.abs(current.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 1;
  }
}
