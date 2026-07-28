import { type SubscriptionEntity, type PurchaseHistoryItem } from '../models/SubscriptionEntity';
import { type PremiumFeature } from '../models/PremiumFeature';
import { type PremiumFeatureKey } from '../enums/PremiumEnums';

/**
 * src/features/premium_engine/domain/repositories/IPremiumRepository.ts
 */
export interface IPremiumRepository {
  getSubscription(userId: string): Promise<SubscriptionEntity | null>;
  saveSubscription(subscription: SubscriptionEntity): Promise<void>;

  getPurchaseHistory(userId: string): Promise<PurchaseHistoryItem[]>;
  getFeatureDefinition(key: PremiumFeatureKey): Promise<PremiumFeature | null>;
}
