/**
 * src/features/rewards/services/RewardOrchestrator.ts
 */
import { type MissionRow } from '@/db/repositories/supabase/MissionRepository';
import { ProgressionService } from '@/features/progression/services/ProgressionService';
import { StreakService } from '@/features/achievements/services/StreakService';
import { AchievementService } from '@/features/achievements/services/AchievementService';
import { repositories } from '@/db/repositories';
import { usePopupStore } from '@/store/popup.store';
import { useProgressionStore } from '@/store/progression.store';
import { MissionCategory } from '@/features/quests/engines/MissionGenerator';

export class RewardOrchestrator {
  /**
   * Called when a mission is successfully claimed by the user.
   * Processes all rewards, bonuses, stat updates, and popup queues sequentially.
   */
  static async processMissionClaim(userId: string, mission: MissionRow, isPerfectDay: boolean) {
    const popupStore = usePopupStore.getState();

    // 1. Grant Base XP & Coins
    let totalXpGained = mission.xp_reward;
    let totalCoinsGained = mission.coin_reward;
    let totalGemsGained = 0;

    await ProgressionService.grantXp(mission.xp_reward);
    if (mission.coin_reward > 0) {
      await ProgressionService.grantCurrency('coins', mission.coin_reward);
    }

    // Queue Base Reward Popups
    if (mission.xp_reward > 0) {
      popupStore.enqueue({
        type: 'xp_gain',
        title: 'Mission Complete!',
        amount: mission.xp_reward,
      });
    }
    if (mission.coin_reward > 0) {
      popupStore.enqueue({ type: 'coin_gain', title: 'Coins Earned', amount: mission.coin_reward });
    }

    // Log to History
    await repositories.rewardsHistory.logReward({
      user_id: userId,
      reward_type: 'mission_claim',
      source: mission.mission_type,
      source_id: mission.id,
      xp: mission.xp_reward,
      coins: mission.coin_reward,
      gems: 0,
    });

    // 2. Update User Stats (for Achievements)
    await this.incrementStatsBasedOnMission(userId, mission);

    // 3. Process Streak
    const streakData = await StreakService.updateStreakOnMissionClaim(userId);

    // Check for Streak Milestones (e.g., every 7 days)
    if (
      streakData.streakIncreased &&
      streakData.currentStreak > 1 &&
      streakData.currentStreak % 7 === 0
    ) {
      const streakBonusXp = 500;
      const streakBonusCoins = 100;

      await ProgressionService.grantXp(streakBonusXp);
      await ProgressionService.grantCurrency('coins', streakBonusCoins);

      popupStore.enqueue({
        type: 'xp_gain',
        title: `${streakData.currentStreak} Day Streak Bonus!`,
        amount: streakBonusXp,
      });

      await repositories.rewardsHistory.logReward({
        user_id: userId,
        reward_type: 'streak_bonus',
        source: 'streak',
        xp: streakBonusXp,
        coins: streakBonusCoins,
      });

      totalXpGained += streakBonusXp;
      totalCoinsGained += streakBonusCoins;
    }

    // 4. Perfect Completion Bonus
    if (isPerfectDay) {
      const perfectBonusXp = 300;
      const perfectBonusGems = 10;

      await ProgressionService.grantXp(perfectBonusXp);
      await ProgressionService.grantCurrency('gems', perfectBonusGems);

      popupStore.enqueue({
        type: 'gem_gain',
        title: 'Perfect Day Bonus!',
        amount: perfectBonusGems,
      });

      await repositories.rewardsHistory.logReward({
        user_id: userId,
        reward_type: 'perfect_day_bonus',
        source: 'daily_completion',
        xp: perfectBonusXp,
        gems: perfectBonusGems,
      });

      totalXpGained += perfectBonusXp;
      totalGemsGained += perfectBonusGems;
    }

    // 5. Check Achievement Unlocks
    const progState = useProgressionStore.getState();
    const unlockedAchievements = await AchievementService.evaluateAchievements(
      userId,
      progState.currentLevel,
      progState.currentRank,
    );

    // If achievements were unlocked, they enqueue their own popups and log to history.
    if (unlockedAchievements && unlockedAchievements.length > 0) {
      for (const ach of unlockedAchievements) {
        if (ach.xp_reward > 0) await ProgressionService.grantXp(ach.xp_reward);
        if (ach.coin_reward > 0) await ProgressionService.grantCurrency('coins', ach.coin_reward);
        if (ach.gem_reward > 0) await ProgressionService.grantCurrency('gems', ach.gem_reward);
      }
    }

    // 6. Level Up & Rank Up Checks
    // ProgressionService automatically handles level up / rank up logic internally via remote sync,
    // but we can check if the level actually changed.
    const oldLevel = progState.currentLevel;
    const oldRank = progState.currentRank;

    // Refresh progression state from DB to get accurate post-reward numbers
    await progState.fetchFromRemote();
    const newProgState = useProgressionStore.getState();

    if (newProgState.currentLevel > oldLevel) {
      popupStore.enqueue({
        type: 'level_up',
        title: 'LEVEL UP!',
        subtitle: `Level ${newProgState.currentLevel}`,
      });
    }

    if (newProgState.currentRank !== oldRank) {
      popupStore.enqueue({
        type: 'rank_up',
        title: 'RANK ADVANCEMENT!',
        subtitle: newProgState.currentRank,
      });
    }
  }

  private static async incrementStatsBasedOnMission(userId: string, mission: MissionRow) {
    const updates: any = {};
    const count = mission.required_count;

    // Based on title/category, update specific stats.
    if (mission.title.toLowerCase().includes('push-up')) {
      updates.total_pushups = count;
    } else if (mission.title.toLowerCase().includes('squat')) {
      updates.total_squats = count;
    } else if (mission.title.toLowerCase().includes('run')) {
      updates.total_running_distance = count; // assuming count is KM for run
    } else if (mission.title.toLowerCase().includes('water')) {
      updates.total_water_intake = count; // assuming liters
    }

    if (mission.category === MissionCategory.CARDIO) {
      updates.total_cardio_sessions = 1;
    } else if (
      mission.category === MissionCategory.MOBILITY ||
      mission.title.toLowerCase().includes('stretch')
    ) {
      updates.total_stretch_sessions = 1;
    } else if (
      mission.category === MissionCategory.RECOVERY ||
      mission.title.toLowerCase().includes('sleep')
    ) {
      updates.total_sleep_days = 1;
    }

    updates.total_workouts = 1;

    // We must fetch current stats, then add to them
    const statsRes = await repositories.stats.getStats(userId);
    if (statsRes.success && statsRes.data) {
      const current = statsRes.data;
      const newStats: any = {};

      for (const key of Object.keys(updates)) {
        newStats[key] = ((current[key as keyof typeof current] as number) || 0) + updates[key];
      }

      newStats.total_xp_earned = current.total_xp_earned + mission.xp_reward;
      newStats.total_coins_earned = current.total_coins_earned + mission.coin_reward;

      await repositories.stats.updateStats(userId, newStats);
    }
  }
}
