import { type XpTransaction } from '../models/XpTransaction';
import { type XpLevel } from '../models/XpLevel';

/**
 * src/features/xp_engine/domain/repositories/IXpRepository.ts
 *
 * Contract for XP data persistence.
 */
export interface IXpRepository {
  /** Retrieves the user's current absolute XP total */
  getTotalXp(userId: string): Promise<number>;

  /** Retrieves the user's current level data */
  getXpLevel(userId: string): Promise<XpLevel>;

  /** Retrieves the history of XP transactions for auditing/display */
  getTransactionHistory(userId: string, limit?: number): Promise<XpTransaction[]>;

  /**
   * Atomically saves a new XP transaction and updates the user's total XP.
   * This must be handled in a single transaction (e.g., Supabase RPC) to prevent race conditions.
   */
  saveTransaction(transaction: XpTransaction): Promise<void>;
}
