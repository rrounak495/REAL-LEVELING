import { type XpModifier, type ActiveModifiersContext } from '../models/XpModifiers';

/**
 * src/features/xp_engine/domain/services/IXpCalculationService.ts
 *
 * Contract for the mathematical engine that applies multipliers to base XP.
 */
export interface IXpCalculationService {
  /**
   * Applies all active modifiers to the base XP amount to calculate the final yield.
   *
   * @param baseAmount The raw XP value from the mission/event
   * @param context The active modifiers to apply
   * @returns The exact integer XP amount to be awarded
   */
  calculateFinalXp(baseAmount: number, context: ActiveModifiersContext): number;

  /**
   * Combines an array of individual modifiers into a single aggregated multiplier.
   * e.g., combining 1.2x (Difficulty) and 1.1x (Streak) into a total multiplier.
   */
  aggregateModifiers(modifiers: readonly XpModifier[]): number;
}
