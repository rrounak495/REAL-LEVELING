import { type XpSource, type XpModifierType } from '../enums/XpEnums';

/**
 * src/features/xp_engine/domain/models/XpTransaction.ts
 *
 * Represents an immutable record of XP awarded to the user.
 * Essential for auditing, level rollbacks (if needed), and analytics.
 */
export interface XpTransaction {
  readonly id: string;
  readonly userId: string;
  readonly source: XpSource;
  readonly baseAmount: number;
  readonly finalAmount: number;

  /** The specific entity that triggered this XP (e.g., missionId) */
  readonly referenceId?: string;

  /** Snapshot of all modifiers applied to this transaction */
  readonly appliedModifiers: readonly XpModifierSnapshot[];

  readonly timestamp: string; // ISO date
}

/**
 * A snapshot of a specific modifier applied during a transaction.
 */
export interface XpModifierSnapshot {
  readonly type: XpModifierType;
  readonly multiplier: number; // e.g., 1.5 for 50% bonus
  readonly reason?: string;
}
