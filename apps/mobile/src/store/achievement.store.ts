/**
 * src/store/achievement.store.ts
 */
import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { type UserStatsRow } from '@/db/repositories/supabase/StatsRepository';
import { type UserAchievementRow } from '@/db/repositories/supabase/AchievementRepository';
import { type RewardHistoryRow } from '@/db/repositories/supabase/RewardsHistoryRepository';

interface AchievementState {
  stats: UserStatsRow | null;
  unlockedAchievements: UserAchievementRow[];
  rewardsHistory: RewardHistoryRow[];
  isLoading: boolean;

  fetchData: (userId: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  stats: null,
  unlockedAchievements: [],
  rewardsHistory: [],
  isLoading: false,

  fetchData: async (userId: string) => {
    set({ isLoading: true });

    try {
      const [statsRes, achRes, histRes] = await Promise.all([
        repositories.stats.getStats(userId),
        repositories.achievements.getUserAchievements(userId),
        repositories.rewardsHistory.getHistory(userId, 5), // Only grab last 5 for dashboard
      ]);

      set({
        stats: statsRes.success ? statsRes.data : null,
        unlockedAchievements: achRes.success ? achRes.data : [],
        rewardsHistory: histRes.success ? histRes.data : [],
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to fetch achievement data', e);
      set({ isLoading: false });
    }
  },
}));
