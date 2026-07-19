/**
 * src/store/mission.store.ts
 *
 * Zustand store for managing active missions and progress.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvZustandStorage } from '@lib/storage';
import { useAuthStore } from './auth.store';
import { type MissionRow } from '@/db/repositories/supabase/MissionRepository';
import { MissionService } from '@/features/quests/services/MissionService';
import { RewardOrchestrator } from '@/features/rewards/services/RewardOrchestrator';
import { repositories } from '@/db/repositories';
import { useSystemStore } from './system.store';
import { ProgressSource } from '@/services/DailyChestService';

interface MissionState {
  dailyMissions: MissionRow[];
  weeklyMissions: MissionRow[];
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  incrementProgress: (missionId: string, amount: number) => Promise<void>;
  claimReward: (missionId: string) => Promise<void>;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      dailyMissions: [],
      weeklyMissions: [],
      isLoading: false,

      initialize: async () => {
        set({ isLoading: true });
        const { daily, weekly } = await MissionService.getAndResetMissions();
        set({ dailyMissions: daily, weeklyMissions: weekly, isLoading: false });
      },

      incrementProgress: async (missionId: string, amount: number) => {
        const { dailyMissions, weeklyMissions } = get();

        // Helper to update progress optimistically
        const updateMission = (m: MissionRow) => {
          if (m.id !== missionId || m.is_completed) return m;
          const newProgress = Math.min(m.current_progress + amount, m.required_count);
          const isCompleted = newProgress >= m.required_count;

          // Add progress points if newly completed
          if (isCompleted && !m.is_completed) {
            const userId = useAuthStore.getState().user?.id;
            if (userId) {
              const source =
                m.mission_type === 'daily'
                  ? ProgressSource.DAILY_MISSION
                  : ProgressSource.WEEKLY_MILESTONE;
              useSystemStore.getState().addProgress(userId, source);
            }
          }

          return { ...m, current_progress: newProgress, is_completed: isCompleted };
        };

        const newDaily = dailyMissions.map(updateMission);
        const newWeekly = weeklyMissions.map(updateMission);

        set({ dailyMissions: newDaily, weeklyMissions: newWeekly });

        // Find the mission to sync
        const mission = [...newDaily, ...newWeekly].find((m) => m.id === missionId);
        if (mission) {
          // Fire and forget sync
          repositories.missions
            .updateProgress(mission.id, mission.current_progress, mission.is_completed)
            .catch((e) => {
              console.error('Failed to sync mission progress:', e);
            });
        }
      },

      claimReward: async (missionId: string) => {
        const { dailyMissions, weeklyMissions } = get();

        const claimMission = (m: MissionRow) => {
          if (m.id !== missionId || !m.is_completed || m.is_claimed) return m;
          return { ...m, is_claimed: true };
        };

        const newDaily = dailyMissions.map(claimMission);
        const newWeekly = weeklyMissions.map(claimMission);

        const mission = [...dailyMissions, ...weeklyMissions].find((m) => m.id === missionId);

        // Safety check: Don't claim if already claimed or not completed
        if (!mission || !mission.is_completed || mission.is_claimed) return;

        // Optimistic Update
        set({ dailyMissions: newDaily, weeklyMissions: newWeekly });

        // Check if perfect day
        const allDailiesCompleted = newDaily.every((m) => m.is_claimed);
        const isPerfectDay = mission.mission_type === 'daily' && allDailiesCompleted;

        // Process rewards, stats, streak, achievements, popups via Orchestrator
        await RewardOrchestrator.processMissionClaim(
          useAuthStore.getState().user!.id,
          mission,
          isPerfectDay,
        );

        // Fire and forget sync
        repositories.missions.markClaimed(mission.id).catch((e) => {
          console.error('Failed to sync mission claim:', e);
        });
      },
    }),
    {
      name: 'mission-storage',
      storage: createJSONStorage(() => mmkvZustandStorage),
    },
  ),
);
