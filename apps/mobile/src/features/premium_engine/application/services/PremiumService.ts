import { type IPremiumService } from '../../domain/services/IPremiumServices';
import { type IPremiumRepository } from '../../domain/repositories/IPremiumRepository';
import { type SubscriptionEntity } from '../../domain/models/SubscriptionEntity';
import { AppError } from '../../../../lib/errors';

export class PremiumService implements IPremiumService {
  constructor(private readonly premiumRepo: IPremiumRepository) {}

  async processSubscriptionUpdate(userId: string, payload: Record<string, unknown>): Promise<void> {
    // In a real app, parse the payload from Stripe/RevenueCat
    // For now, this is a stub for Sprint 3.
    // Example:
    // const sub = await parseWebhookPayload(payload);
    // await this.premiumRepo.saveSubscription(sub);
    return Promise.resolve();
  }

  async startTrial(userId: string): Promise<SubscriptionEntity> {
    const existing = await this.premiumRepo.getSubscription(userId);
    if (existing && existing.status !== 'INACTIVE') {
      throw new AppError('User already has an active subscription or trial', 'VALIDATION_ERROR');
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(now.getDate() + 7); // 7 day trial

    const trialSub: SubscriptionEntity = {
      userId,
      status: 'TRIALING',
      tier: 'PRO',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      cancelAtPeriodEnd: true,
    };

    await this.premiumRepo.saveSubscription(trialSub);
    return trialSub;
  }
}
