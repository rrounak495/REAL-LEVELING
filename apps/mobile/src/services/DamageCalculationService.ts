export type ActivityType =
  'pushup' | 'squat' | 'situp' | 'jumping_jack' | 'plank' | 'walking' | 'running' | 'mission';

export interface ActivitySubmission {
  activityType: ActivityType;
  amount: number; // reps, seconds, kilometers
  objectiveId: string;
  timestamp: number;
}

export interface DamageResult {
  valid: boolean;
  baseDamage: number;
  finalDamage: number;
  isSuspicious: boolean;
  flagReason?: string;
}

// Development Base Rates (per user instructions)
const BASE_RATES: Record<ActivityType, number> = {
  pushup: 2, // per rep
  squat: 1.5, // per rep
  situp: 1.5, // per rep
  jumping_jack: 0.75, // per rep
  plank: 0.2, // per second (1 dmg / 5 secs)
  walking: 40, // per km
  running: 75, // per km
  mission: 50, // default baseline
};

// Daily Caps (Anti-Cheat)
const DAILY_CAPS: Record<ActivityType, number> = {
  pushup: 500,
  squat: 750,
  situp: 500,
  jumping_jack: 2000,
  plank: 1800, // 30 minutes in seconds
  walking: 50, // 50 km
  running: 30, // 30 km
  mission: 10, // Arbitrary limit on mission claims per day
};

// Burst Detection Limits (Max allowed in a single submission)
const BURST_LIMITS: Record<ActivityType, number> = {
  pushup: 100,
  squat: 150,
  situp: 150,
  jumping_jack: 300,
  plank: 600, // 10 minutes max single submission
  walking: 20, // 20 km max single submission
  running: 20, // 20 km max single submission
  mission: 5,
};

export class DamageCalculationService {
  /**
   * Calculates damage from a raw fitness activity submission.
   * This is a domain service - it does not mutate state directly, it returns the calculation.
   * @param submission The user's activity submission
   * @param currentDailyTotal The user's current daily total for this activity type
   * @param phaseMultiplier Any active boss phase multiplier
   */
  static calculateDamage(
    submission: ActivitySubmission,
    currentDailyTotal: number,
    phaseMultiplier: number = 1.0,
  ): DamageResult {
    const rate = BASE_RATES[submission.activityType] || 0;
    const dailyCap = DAILY_CAPS[submission.activityType] || 0;
    const burstLimit = BURST_LIMITS[submission.activityType] || 0;

    // Burst Validation (Anti-cheat)
    if (submission.amount > burstLimit) {
      return {
        valid: false,
        baseDamage: 0,
        finalDamage: 0,
        isSuspicious: true,
        flagReason: `Burst limit exceeded. Submitted: ${submission.amount}, Limit: ${burstLimit}`,
      };
    }

    // Daily Cap Validation (Progressive cap calculation)
    let acceptedAmount = submission.amount;
    const projectedTotal = currentDailyTotal + submission.amount;

    if (projectedTotal > dailyCap) {
      const remainingAllowed = Math.max(0, dailyCap - currentDailyTotal);
      acceptedAmount = remainingAllowed; // Cap them to whatever is left for the day
    }

    if (acceptedAmount <= 0) {
      return {
        valid: true,
        baseDamage: 0,
        finalDamage: 0,
        isSuspicious: false,
        // Not suspicious, just capped out for the day
      };
    }

    // Calculation
    const baseDamage = acceptedAmount * rate;
    const finalDamage = Math.floor(baseDamage * phaseMultiplier);

    return {
      valid: true,
      baseDamage,
      finalDamage,
      isSuspicious: false,
    };
  }
}
