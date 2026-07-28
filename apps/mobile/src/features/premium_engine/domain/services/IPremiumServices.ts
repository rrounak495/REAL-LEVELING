import { type SubscriptionEntity } from '../models/SubscriptionEntity';
import { type PremiumFeatureKey } from '../enums/PremiumEnums';

/**
 * src/features/premium_engine/domain/services/IPremiumServices.ts
 */
export interface IPremiumService {
  /**
   * Central orchestrator for handling webhook events from Stripe/RevenueCat.
   */
  processSubscriptionUpdate(userId: string, payload: Record<string, unknown>): Promise<void>;

  startTrial(userId: string): Promise<SubscriptionEntity>;
}

export interface IPremiumValidationService {
  /**
   * Core guard check used across the app to gate premium functionality.
   */
  hasFeatureAccess(userId: string, feature: PremiumFeatureKey): Promise<boolean>;

  isSubscriptionActive(subscription: SubscriptionEntity): boolean;
}
