import { type IMomentumService } from '../../domain/services/IStreakServices';
import { type MomentumEntity } from '../../domain/models/MomentumEntity';
import { type StreakEntity } from '../../domain/models/StreakEntity';
import { type MomentumTier } from '../../domain/enums/StreakEnums';

export class MomentumService implements IMomentumService {
  calculateMomentum(streak: StreakEntity): MomentumEntity {
    // Score based on daily streak (capped at 100 for formula)
    const rawScore = Math.min(100, streak.currentDailyStreak * 3.33);
    const score = Math.round(rawScore);

    let tier: MomentumTier = 'COLD';
    let multiplier = 1.0;

    if (score >= 90) {
      tier = 'UNSTOPPABLE';
      multiplier = 1.25;
    } else if (score >= 60) {
      tier = 'ON_FIRE';
      multiplier = 1.15;
    } else if (score >= 30) {
      tier = 'WARMING_UP';
      multiplier = 1.05;
    }

    return {
      userId: streak.userId,
      score,
      tier,
      multiplier,
    };
  }

  async decayMomentum(userId: string, daysInactive: number): Promise<void> {
    // In a full implementation, momentum decay might be persisted independently.
    // For now, it's calculated on-the-fly based on the streak, so if the streak is lost, momentum is lost.
    // We could store score in a MomentumRepository in the future.
    return;
  }
}
