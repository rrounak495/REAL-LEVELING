/**
 * src/features/achievements/services/AchievementService.ts
 */
import { repositories } from '@/db/repositories';
import { type UserStatsRow } from '@/db/repositories/supabase/StatsRepository';
import { type AchievementRow } from '@/db/repositories/supabase/AchievementRepository';
import { usePopupStore } from '@/store/popup.store';

export class AchievementService {
  /**
   * Evaluates all global achievements against the current user stats/progression
   * and unlocks them if criteria are met. Only unlocks achievements not previously unlocked.
   */
  static async evaluateAchievements(userId: string, currentLevel: number, currentRank: string) {
    const statsRes = await repositories.stats.getStats(userId);
    if (!statsRes.success || !statsRes.data) return;

    const stats = statsRes.data;

    const allAchievementsRes = await repositories.achievements.getAllAchievements();
    if (!allAchievementsRes.success) return;

    const userAchievementsRes = await repositories.achievements.getUserAchievements(userId);
    if (!userAchievementsRes.success) return;

    const allAchievements = allAchievementsRes.data;
    const unlockedIds = new Set(userAchievementsRes.data.map((ua) => ua.achievement_id));

    const newlyUnlocked: AchievementRow[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      if (this.checkCriteria(achievement, stats, currentLevel, currentRank)) {
        // Unlock it!
        const unlockRes = await repositories.achievements.unlockAchievement(userId, achievement.id);

        if (unlockRes.success) {
          newlyUnlocked.push(achievement);

          // Log to rewards history
          await repositories.rewardsHistory.logReward({
            user_id: userId,
            reward_type: 'achievement_unlock',
            source: 'achievement',
            source_id: achievement.id,
            xp: achievement.xp_reward,
            coins: achievement.coin_reward,
            gems: achievement.gem_reward,
            badge_id: achievement.badge_id,
          });

          // Enqueue Popup
          usePopupStore.getState().enqueue({
            type: 'achievement_unlock',
            title: 'Achievement Unlocked!',
            subtitle: achievement.name,
            amount: achievement.xp_reward, // show xp in popup maybe
          });
        }
      }
    }

    return newlyUnlocked;
  }

  private static checkCriteria(
    achievement: AchievementRow,
    stats: UserStatsRow,
    currentLevel: number,
    currentRank: string,
  ): boolean {
    const reqValue = achievement.requirement_value;

    switch (achievement.requirement_type) {
      case 'total_pushups':
        return stats.total_pushups >= reqValue;
      case 'total_squats':
        return stats.total_squats >= reqValue;
      case 'total_running_distance':
        return stats.total_running_distance >= reqValue;
      case 'longest_streak':
        return stats.longest_streak >= reqValue;
      case 'current_level':
        return currentLevel >= reqValue;
      case 'total_workouts':
        return stats.total_workouts >= reqValue;
      case 'total_water_intake':
        return stats.total_water_intake >= reqValue;
      default:
        return false;
    }
  }
}
