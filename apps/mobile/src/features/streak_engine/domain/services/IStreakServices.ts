import { type StreakEntity } from '../models/StreakEntity';
import { type MomentumEntity } from '../models/MomentumEntity';

export interface StreakEvent {
  readonly userId: string;
  readonly oldStreak: number;
  readonly newStreak: number;
  readonly milestoneReached?: number;
}

/**
 * src/features/streak_engine/domain/services/IStreakServices.ts
 */
export interface IStreakService {
  processDailyActivity(userId: string, date: string): Promise<StreakEvent>;
  processMissedDay(userId: string, date: string): Promise<void>;
  applyStreakFreeze(userId: string): Promise<boolean>;
  triggerComebackBonus(userId: string): Promise<void>;
}

export interface IMomentumService {
  calculateMomentum(streak: StreakEntity): MomentumEntity;
  decayMomentum(userId: string, daysInactive: number): Promise<void>;
}

export interface IStreakValidationService {
  canApplyFreeze(streak: StreakEntity): boolean;
  isAtRisk(streak: StreakEntity, currentDate: string): boolean;
}
