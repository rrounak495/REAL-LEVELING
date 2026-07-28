import { type IXpModifierService } from '../../domain/services/IXpModifierService';
import { type XpSource } from '../../domain/enums/XpEnums';
import { type ActiveModifiersContext, type XpModifier } from '../../domain/models/XpModifiers';
import { type IStreakRepository } from '../../../streak_engine/domain/repositories/IStreakRepository';
import { type IPremiumRepository } from '../../../premium_engine/domain/repositories/IPremiumRepository';
import { type IXpCalculationService } from '../../domain/services/IXpCalculationService';

export class XpModifierService implements IXpModifierService {
  constructor(
    private readonly streakRepo: IStreakRepository,
    private readonly premiumRepo: IPremiumRepository,
    private readonly calcService: IXpCalculationService,
  ) {}

  async getActiveModifiers(
    userId: string,
    source: XpSource,
    additionalModifiers?: Record<string, number>,
  ): Promise<ActiveModifiersContext> {
    const modifiers: XpModifier[] = [];

    // Check Premium Bonus
    const premiumSub = await this.premiumRepo.getSubscription(userId);
    const isPremium = premiumSub?.status === 'ACTIVE' || premiumSub?.status === 'TRIALING';
    if (isPremium) {
      modifiers.push({
        type: 'PREMIUM_BONUS',
        multiplier: 1.2,
        description: '20% Premium Bonus',
      });
    }

    // Check Streak Bonus
    const streak = await this.streakRepo.getStreak(userId);
    if (streak && streak.currentDailyStreak >= 3) {
      // 1% extra per day over 2, capped at 25%
      const bonusPct = Math.min(0.25, (streak.currentDailyStreak - 2) * 0.01);
      modifiers.push({
        type: 'STREAK_BONUS',
        multiplier: 1.0 + bonusPct,
        description: `Streak Bonus (${streak.currentDailyStreak} Days)`,
      });
    }

    // Additional external modifiers (like mission difficulty or specific mission types)
    if (additionalModifiers) {
      Object.entries(additionalModifiers).forEach(([key, value]) => {
        modifiers.push({
          type: key as any,
          multiplier: value,
          description: `Custom Modifier: ${key}`,
        });
      });
    }

    const totalMultiplier = this.calcService.aggregateModifiers(modifiers);

    return {
      userId,
      modifiers,
      totalMultiplier,
    };
  }
}
