/**
 * src/features/mission_engine/domain/services/IMissionNotificationService.ts
 *
 * Contract for abstracting external notification APIs (e.g. Expo Notifications).
 */
export interface IMissionNotificationService {
  /**
   * Schedules a reminder for a specific mission.
   * @param missionId ID of the mission
   * @param time ISO time string
   */
  scheduleReminder(missionId: string, time: string): Promise<void>;

  /**
   * Schedules a "Recovery" reminder if a user fails a mission.
   */
  scheduleRecoveryReminder(missionId: string): Promise<void>;

  /**
   * Sends a daily summary notification to the user.
   */
  sendDailySummary(userId: string, completedCount: number, totalCount: number): Promise<void>;

  /**
   * Sends an immediate push notification or in-app toast when a mission is completed.
   */
  sendMissionComplete(missionId: string, xpEarned: number): Promise<void>;
}
