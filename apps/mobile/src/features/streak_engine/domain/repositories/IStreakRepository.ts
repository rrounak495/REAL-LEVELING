import { type StreakEntity } from '../models/StreakEntity';
import { type MomentumEntity } from '../models/MomentumEntity';

/**
 * src/features/streak_engine/domain/repositories/IStreakRepository.ts
 */
export interface IStreakRepository {
  getStreak(userId: string): Promise<StreakEntity | null>;
  saveStreak(streak: StreakEntity): Promise<void>;

  getMomentum(userId: string): Promise<MomentumEntity | null>;
  saveMomentum(momentum: MomentumEntity): Promise<void>;
}
