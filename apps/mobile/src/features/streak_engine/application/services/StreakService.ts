import {
  type IStreakService,
  type IStreakValidationService,
  type StreakEvent,
} from '../../domain/services/IStreakServices';
import { type IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { type StreakEntity } from '../../domain/models/StreakEntity';

export class StreakService implements IStreakService {
  constructor(
    private readonly streakRepo: IStreakRepository,
    private readonly validationService: IStreakValidationService,
  ) {}

  async processDailyActivity(userId: string, date: string): Promise<StreakEvent> {
    let streak = await this.streakRepo.getStreak(userId);

    if (!streak) {
      streak = {
        userId,
        currentDailyStreak: 0,
        longestDailyStreak: 0,
        currentWeeklyStreak: 0,
        currentMonthlyStreak: 0,
        status: 'ACTIVE',
        lastActiveDate: null,
        availableFreezes: 1,
        activeRecoveryType: null,
      };
    }

    const oldStreak = streak.currentDailyStreak;
    let newStreak = oldStreak + 1;

    // Check if streak was lost and they are starting over
    if (this.validationService.isAtRisk(streak, date)) {
      if (streak.status === 'FROZEN') {
        // Unfreeze
        newStreak = oldStreak + 1;
      } else {
        // Streak lost
        newStreak = 1;
      }
    }

    const updatedStreak: StreakEntity = {
      ...streak,
      currentDailyStreak: newStreak,
      longestDailyStreak: Math.max(streak.longestDailyStreak, newStreak),
      status: 'ACTIVE',
      lastActiveDate: date,
      activeRecoveryType: null, // clear recovery if they had it
    };

    await this.streakRepo.saveStreak(updatedStreak);

    return {
      userId,
      oldStreak,
      newStreak,
      ...(newStreak % 7 === 0 ? { milestoneReached: newStreak } : {}),
    };
  }

  async processMissedDay(userId: string, date: string): Promise<void> {
    const streak = await this.streakRepo.getStreak(userId);
    if (!streak) return;

    if (this.validationService.isAtRisk(streak, date)) {
      if (streak.status === 'FROZEN') {
        // Freeze consumed, move to active but don't reset count
        const updatedStreak: StreakEntity = {
          ...streak,
          status: 'ACTIVE',
          availableFreezes: Math.max(0, streak.availableFreezes - 1),
        };
        await this.streakRepo.saveStreak(updatedStreak);
      } else {
        const updatedStreak: StreakEntity = {
          ...streak,
          status: 'LOST',
          currentDailyStreak: 0,
        };
        await this.streakRepo.saveStreak(updatedStreak);
      }
    }
  }

  async applyStreakFreeze(userId: string): Promise<boolean> {
    const streak = await this.streakRepo.getStreak(userId);
    if (!streak) return false;

    if (this.validationService.canApplyFreeze(streak)) {
      const updatedStreak: StreakEntity = {
        ...streak,
        status: 'FROZEN',
        availableFreezes: streak.availableFreezes - 1,
      };
      await this.streakRepo.saveStreak(updatedStreak);
      return true;
    }

    return false;
  }

  async triggerComebackBonus(userId: string): Promise<void> {
    const streak = await this.streakRepo.getStreak(userId);
    if (!streak) return;

    if (streak.status === 'LOST') {
      const updatedStreak: StreakEntity = {
        ...streak,
        status: 'LOST',
        activeRecoveryType: 'COMEBACK_BONUS',
      };
      await this.streakRepo.saveStreak(updatedStreak);
    }
  }
}
