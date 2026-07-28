import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type IPremiumRepository } from '../../domain/repositories/IPremiumRepository';
import {
  type SubscriptionEntity,
  type PurchaseHistoryItem,
} from '../../domain/models/SubscriptionEntity';
import { type PremiumFeature } from '../../domain/models/PremiumFeature';
import { type PremiumFeatureKey } from '../../domain/enums/PremiumEnums';
import { mapError } from '../../../../lib/errors';

/**
 * src/features/premium_engine/infrastructure/repositories/SupabasePremiumRepository.ts
 */
export class SupabasePremiumRepository implements IPremiumRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSubscription(userId: string): Promise<SubscriptionEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles') // Assuming premium status is mapped to profiles.premium_status
        .select('premium_status')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      const isPremium = (data as unknown as Record<string, unknown>).premium_status === 'PREMIUM';

      return {
        userId,
        tier: isPremium ? 'PRO' : 'FREE',
        status: isPremium ? 'ACTIVE' : 'INACTIVE',
        cancelAtPeriodEnd: false,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch subscription');
    }
  }

  async saveSubscription(subscription: SubscriptionEntity): Promise<void> {
    // To be implemented correctly with billing Webhooks table
  }

  async getPurchaseHistory(userId: string): Promise<PurchaseHistoryItem[]> {
    return [];
  }

  async getFeatureDefinition(key: PremiumFeatureKey): Promise<PremiumFeature | null> {
    return null;
  }
}
