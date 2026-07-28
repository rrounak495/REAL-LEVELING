import { type StreakStatus, type RecoveryType } from '../enums/StreakEnums';

/**
 * src/features/streak_engine/domain/models/StreakEntity.ts
 */
export interface StreakEntity {
  readonly userId: string;
  readonly currentDailyStreak: number;
  readonly longestDailyStreak: number;

  readonly currentWeeklyStreak: number;
  readonly currentMonthlyStreak: number;

  readonly status: StreakStatus;
  readonly lastActiveDate: string | null; // ISO Date

  readonly availableFreezes: number;
  readonly activeRecoveryType: RecoveryType | null;
}
