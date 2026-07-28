import { type SubscriptionTier, type SubscriptionStatus } from '../enums/PremiumEnums';

/**
 * src/features/premium_engine/domain/models/SubscriptionEntity.ts
 */
export interface SubscriptionEntity {
  readonly userId: string;
  readonly tier: SubscriptionTier;
  readonly status: SubscriptionStatus;

  readonly currentPeriodStart?: string; // ISO
  readonly currentPeriodEnd?: string; // ISO
  readonly cancelAtPeriodEnd: boolean;

  readonly stripeCustomerId?: string;
  readonly stripeSubscriptionId?: string;
}

export interface PurchaseHistoryItem {
  readonly id: string;
  readonly userId: string;
  readonly amount: number;
  readonly currency: string;
  readonly date: string;
  readonly description: string;
}
