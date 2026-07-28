import { type PremiumFeatureKey } from '../enums/PremiumEnums';

/**
 * src/features/premium_engine/domain/models/PremiumFeature.ts
 */
export interface PremiumFeature {
  readonly key: PremiumFeatureKey;
  readonly name: string;
  readonly description: string;
  readonly isAvailableInTrial: boolean;
}
