/**
 * src/features/mission_engine/domain/services/IDailyLifecycleService.ts
 */

export interface IDailyLifecycleService {
  /**
   * Processes the daily reset for the given user.
   * Returns true if a reset occurred, false if already reset today.
   */
  processDailyReset(userId: string): Promise<boolean>;
}
