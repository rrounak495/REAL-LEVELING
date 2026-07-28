import { type XpSource } from '../enums/XpEnums';
import { type XpTransaction } from '../models/XpTransaction';

/**
 * Result returned when XP is successfully awarded.
 */
export interface AwardXpResult {
  readonly transaction: XpTransaction;
  readonly leveledUp: boolean;
  readonly newLevel: number;
}

/**
 * src/features/xp_engine/domain/services/IXpAwardService.ts
 *
 * Contract for the primary entry point to grant XP to a user.
 */
export interface IXpAwardService {
  /**
   * High-level orchestration method that:
   * 1. Gathers modifiers via IXpModifierService
   * 2. Calculates final amount via IXpCalculationService
   * 3. Creates the XpTransaction
   * 4. Persists the transaction via IXpRepository
   * 5. Determines if a level-up occurred
   */
  awardXp(
    userId: string,
    source: XpSource,
    baseAmount: number,
    referenceId?: string,
  ): Promise<AwardXpResult>;
}
