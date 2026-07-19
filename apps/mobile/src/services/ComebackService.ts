import { type ComebackTier } from '@/types/system.types';

export class ComebackService {
  /**
   * Evaluates the number of inactive days and returns the appropriate tier.
   * Days inactive must be full progression days.
   */
  static evaluateComebackTier(daysInactive: number): ComebackTier {
    if (daysInactive < 3) return 'normal';
    if (daysInactive >= 3 && daysInactive <= 6) return 'return_protocol';
    if (daysInactive >= 7 && daysInactive <= 13) return 'recovery_protocol';
    return 'reawakening_protocol';
  }

  /**
   * Helper to determine days inactive based on the user's timezone.
   */
  static calculateDaysInactive(lastProgressDateIso: string, timezoneOffsetMinutes: number): number {
    const now = new Date();
    // Offset correction logic could be applied here if we relied entirely on the client,
    // but typically we'd use the raw UTC date and user's timezone string on the backend.
    // For this prototype, we'll do a simple diff.
    const lastProgress = new Date(lastProgressDateIso);
    const diffTime = Math.abs(now.getTime() - lastProgress.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
