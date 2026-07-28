/**
 * src/features/premium_engine/domain/enums/PremiumEnums.ts
 */

export type SubscriptionTier = 'FREE' | 'PRO' | 'ELITE';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INACTIVE';

export type PremiumFeatureKey =
  | 'ADVANCED_AI_COACHING'
  | 'UNLIMITED_MISSIONS'
  | 'CUSTOM_CHAPTERS'
  | 'PRIORITY_SUPPORT'
  | 'EXCLUSIVE_AVATARS';
