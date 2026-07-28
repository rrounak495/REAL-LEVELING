import { type XpModifierType } from '../enums/XpEnums';

/**
 * src/features/xp_engine/domain/models/XpModifiers.ts
 *
 * Represents the collection of active modifiers that apply to a specific XP event.
 */
export interface XpModifier {
  readonly type: XpModifierType;
  /** Multiplier value. e.g. 1.2 = +20% bonus */
  readonly multiplier: number;
  readonly description?: string;
}

export interface ActiveModifiersContext {
  readonly userId: string;
  readonly modifiers: readonly XpModifier[];

  /** The aggregated multiplier resulting from all active modifiers */
  readonly totalMultiplier: number;
}
