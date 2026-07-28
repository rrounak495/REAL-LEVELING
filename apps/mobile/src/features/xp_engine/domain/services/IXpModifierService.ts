import { type XpSource } from '../enums/XpEnums';
import { type ActiveModifiersContext } from '../models/XpModifiers';

/**
 * src/features/xp_engine/domain/services/IXpModifierService.ts
 *
 * Contract for fetching and aggregating all active bonus multipliers for a user.
 * This service knows how to talk to the Goal/Streak/Chapter domains to gather current context.
 */
export interface IXpModifierService {
  /**
   * Evaluates the user's current context (streak, active premium, chapter)
   * and the specific XP source to determine all applicable multipliers.
   *
   * @param userId The user's ID
   * @param source The source triggering the XP
   * @param additionalModifiers Optional specific modifiers (e.g., mission difficulty modifier)
   */
  getActiveModifiers(
    userId: string,
    source: XpSource,
    additionalModifiers?: Record<string, number>,
  ): Promise<ActiveModifiersContext>;
}
