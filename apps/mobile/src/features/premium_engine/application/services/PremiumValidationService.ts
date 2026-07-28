import { type IPremiumValidationService } from '../../domain/services/IPremiumServices';
import { type SubscriptionEntity } from '../../domain/models/SubscriptionEntity';
import { type PremiumFeatureKey } from '../../domain/enums/PremiumEnums';
import { type IPremiumRepository } from '../../domain/repositories/IPremiumRepository';

export class PremiumValidationService implements IPremiumValidationService {
  constructor(private readonly premiumRepo: IPremiumRepository) {}

  isSubscriptionActive(subscription: SubscriptionEntity): boolean {
    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
      return false;
    }
    if (!subscription.currentPeriodEnd) {
      return true; // Assume lifetime if no end date
    }
    const now = new Date();
    const end = new Date(subscription.currentPeriodEnd);
    return now <= end;
  }

  async hasFeatureAccess(userId: string, feature: PremiumFeatureKey): Promise<boolean> {
    // 1. Check if user is premium
    const subscription = await this.premiumRepo.getSubscription(userId);
    const isPremium = subscription ? this.isSubscriptionActive(subscription) : false;
    if (isPremium) return true; // Premium has access to everything

    // 2. Free tier limits
    // Example: Only chapter 1 and 2 are free. Everything else requires premium.
    const featureStr = feature as string;
    if (featureStr.startsWith('CHAPTER_UNLOCK_')) {
      const chapterNum = parseInt(featureStr.replace('CHAPTER_UNLOCK_', ''), 10);
      if (!isNaN(chapterNum) && chapterNum <= 2) {
        return true;
      }
    }

    if (featureStr === 'AI_MISSION_GENERATION') {
      return false; // strictly premium
    }

    if (featureStr === 'ADVANCED_STATS') {
      return false; // strictly premium
    }

    return false; // Default deny
  }
}
