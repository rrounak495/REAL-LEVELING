import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type ExtendedDatabase } from '../../../../types/extended-database.types';
import { type IXpRepository } from '../../domain/repositories/IXpRepository';
import { type XpTransaction } from '../../domain/models/XpTransaction';
import { type XpLevel } from '../../domain/models/XpLevel';
import { mapError } from '../../../../lib/errors';
import { type XpSource } from '../../domain/enums/XpEnums';

export class SupabaseXpRepository implements IXpRepository {
  private readonly supabase: SupabaseClient<ExtendedDatabase>;

  constructor(client: SupabaseClient<Database>) {
    this.supabase = client as unknown as SupabaseClient<ExtendedDatabase>;
  }

  async getTotalXp(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data.xp || 0;
    } catch (error) {
      throw mapError(error, 'Failed to fetch total XP');
    }
  }

  async getXpLevel(userId: string): Promise<XpLevel> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const currentLevel = data.level || 1;
      const totalXp = data.xp || 0;
      const xpForNextLevel = Math.pow(currentLevel, 1.5) * 100;

      return {
        totalXp,
        currentLevel,
        xpForNextLevel,
        xpIntoCurrentLevel: totalXp - (Math.pow(currentLevel - 1, 1.5) * 100 || 0),
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch XP Level');
    }
  }

  async getTransactionHistory(userId: string, limit: number = 50): Promise<XpTransaction[]> {
    try {
      const { data, error } = await this.supabase
        .from('rewards_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        source: (row.reward_type as XpSource) || 'MISSION_CORE',
        baseAmount: row.xp || 0,
        finalAmount: row.xp || 0,
        ...(row.source_id ? { referenceId: row.source_id } : {}),
        appliedModifiers: [],
        timestamp: row.created_at,
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch XP transaction history');
    }
  }

  async saveTransaction(transaction: XpTransaction): Promise<void> {
    try {
      const { error: insertError } = await this.supabase.from('rewards_history').insert({
        id: transaction.id,
        user_id: transaction.userId,
        reward_type: transaction.source,
        xp: transaction.finalAmount,
        source: 'xp_engine',
        source_id: transaction.referenceId || null,
      });

      if (insertError) throw insertError;
    } catch (error) {
      throw mapError(error, 'Failed to save XP transaction');
    }
  }
}
