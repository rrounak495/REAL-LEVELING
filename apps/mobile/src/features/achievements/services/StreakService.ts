/**
 * src/features/achievements/services/StreakService.ts
 */
import { repositories } from '@/db/repositories';

export class StreakService {
  /**
   * Evaluates the current streak when a mission is claimed.
   * - If the mission is claimed on the same day as `last_mission_date`, streak does not change.
   * - If claimed on the next day, streak increments.
   * - If missed a day, streak resets to 1.
   *
   * Updates user_stats in the database and returns the new streak metrics.
   */
  static async updateStreakOnMissionClaim(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    wasReset: boolean;
    streakIncreased: boolean;
  }> {
    const statsRes = await repositories.stats.getStats(userId);
    if (!statsRes.success || !statsRes.data) {
      throw new Error('Could not fetch user stats for streak evaluation');
    }

    const stats = statsRes.data;
    const today = this.getLocalIsoDateString(new Date());

    let currentStreak = stats.current_streak;
    let longestStreak = stats.longest_streak;
    let wasReset = false;
    let streakIncreased = false;

    if (!stats.last_mission_date) {
      // First mission ever
      currentStreak = 1;
      longestStreak = 1;
      streakIncreased = true;
    } else {
      const lastDateStr = stats.last_mission_date;

      if (lastDateStr === today) {
        // Already claimed a mission today. Do nothing to the streak.
      } else if (this.isNextDay(lastDateStr, today)) {
        // Claimed on the next day! Increment streak.
        currentStreak += 1;
        streakIncreased = true;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        // Missed one or more days. Reset to 1.
        currentStreak = 1;
        wasReset = true;
        streakIncreased = true; // technically increased from 0 to 1
      }
    }

    // Save to DB
    await repositories.stats.updateStats(userId, {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_mission_date: today,
    });

    return { currentStreak, longestStreak, wasReset, streakIncreased };
  }

  private static getLocalIsoDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private static isNextDay(lastDateStr: string, todayStr: string): boolean {
    const lastDate = new Date(lastDateStr);
    const todayDate = new Date(todayStr);

    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 1;
  }
}
