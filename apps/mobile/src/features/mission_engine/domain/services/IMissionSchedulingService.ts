/**
 * src/features/mission_engine/domain/services/IMissionSchedulingService.ts
 *
 * Contract for managing the time-based lifecycle of missions.
 */
export interface IMissionSchedulingService {
  /**
   * Automatically schedules the next day's missions for a user.
   * Triggered by a background cron job or app launch.
   */
  scheduleNextMissions(userId: string): Promise<void>;

  /**
   * Fails any incomplete missions from previous days.
   */
  processOverdueMissions(userId: string): Promise<void>;
}
