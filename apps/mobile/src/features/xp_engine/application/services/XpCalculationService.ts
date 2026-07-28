import { type IXpCalculationService } from '../../domain/services/IXpCalculationService';
import { type XpModifier, type ActiveModifiersContext } from '../../domain/models/XpModifiers';

export class XpCalculationService implements IXpCalculationService {
  calculateFinalXp(baseAmount: number, context: ActiveModifiersContext): number {
    return Math.max(1, Math.round(baseAmount * context.totalMultiplier));
  }

  aggregateModifiers(modifiers: readonly XpModifier[]): number {
    if (modifiers.length === 0) return 1.0;

    // Additive stacking for modifiers (e.g., 20% bonus + 10% bonus = 30% bonus, multiplier = 1.3)
    const totalBonus = modifiers.reduce((sum, mod) => {
      // multiplier 1.2 means 0.2 bonus
      return sum + (mod.multiplier - 1.0);
    }, 0);

    return 1.0 + totalBonus;
  }
}
