/**
 * src/store/progression.store.ts
 *
 * Core Progression Engine for the Fitness RPG.
 * Calculates XP, Levels, and Ranks locally, and syncs to Supabase.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mmkvZustandStorage } from '@lib/storage';
import { repositories } from '@/db/repositories';
import { getCurrentUserId } from '@lib/supabase';
import { useSystemStore } from './system.store';

// ── Game Logic ──────────────────────────────────────────────────────────

/** Calculate XP required to move from `level` to `level + 1` */
export function getXpRequiredForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

const RANK_THRESHOLDS = [
  { rank: 'Monarch', minLevel: 150 },
  { rank: 'National Rank', minLevel: 100 },
  { rank: 'SSS Rank', minLevel: 95 },
  { rank: 'SS Rank', minLevel: 90 },
  { rank: 'S Rank', minLevel: 80 },
  { rank: 'A Rank', minLevel: 60 },
  { rank: 'B Rank', minLevel: 40 },
  { rank: 'C Rank', minLevel: 20 },
  { rank: 'D Rank', minLevel: 10 },
  { rank: 'E Rank', minLevel: 5 },
  { rank: 'Unranked', minLevel: 1 },
];

export function getRankForLevel(level: number): string {
  for (const threshold of RANK_THRESHOLDS) {
    if (level >= threshold.minLevel) return threshold.rank;
  }
  return 'Unranked';
}

// ── Store Definition ────────────────────────────────────────────────────

interface ProgressionState {
  totalXp: number;
  currentLevel: number;
  currentRank: string;
  coins: number;
  gems: number;
  lastSyncedAt: number | null;
  isSyncing: boolean;
  needsSync: boolean;
}

interface ProgressionActions {
  gainXP: (amount: number) => void;
  fetchFromRemote: () => Promise<void>;
  syncToRemote: () => Promise<void>;
  reset: () => void;
}

type ProgressionStore = ProgressionState & ProgressionActions;

const INITIAL_STATE: ProgressionState = {
  totalXp: 0,
  currentLevel: 1,
  currentRank: 'Unranked',
  coins: 0,
  gems: 0,
  lastSyncedAt: null,
  isSyncing: false,
  needsSync: false,
};

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    immer((set, get) => ({
      ...INITIAL_STATE,

      gainXP: (amount: number) => {
        const oldLevel = get().currentLevel;
        const oldRank = get().currentRank;

        set((state) => {
          state.totalXp += amount;
          state.coins += Math.floor(amount / 2); // 1 coin per 2 XP

          // Handle Level Up
          let xpNeeded = getXpRequiredForNextLevel(state.currentLevel);
          let leveledUp = false;

          // While we have enough XP to level up (could level up multiple times)
          while (state.totalXp >= xpNeeded) {
            state.totalXp -= xpNeeded;
            state.currentLevel += 1;
            state.gems += 5; // 5 gems per level up
            leveledUp = true;
            xpNeeded = getXpRequiredForNextLevel(state.currentLevel);
          }

          if (leveledUp) {
            state.currentRank = getRankForLevel(state.currentLevel);
          }

          state.needsSync = true;
        });

        const { currentLevel, currentRank } = get();
        // Since oldLevel and oldRank are not easily accessible outside the `set`,
        // we can derive if they changed by comparing before and after `set`.
        // Wait, oldLevel/oldRank was captured inside `set` but not returned.
        // We'll capture them before `set`.
        // Trigger moments asynchronously
        getCurrentUserId().then((userId) => {
          if (!userId) return;
          const { currentLevel, currentRank } = get();

          if (currentLevel > oldLevel) {
            useSystemStore.getState().enqueueMoment(userId, 'level_up', { level: currentLevel }, 1);
          }
          if (currentRank !== oldRank) {
            useSystemStore.getState().enqueueMoment(userId, 'rank_up', { rank: currentRank }, 2);
          }
        });

        // Trigger sync asynchronously
        get().syncToRemote();
      },

      fetchFromRemote: async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;

        set({ isSyncing: true });
        try {
          const res = await repositories.progression.getProgression(userId);
          if (res.success && res.data) {
            set((state) => {
              state.totalXp = res.data.total_xp;
              state.currentLevel = res.data.current_level;
              state.currentRank = res.data.current_rank;
              state.coins = res.data.coins;
              state.gems = res.data.gems;
              state.needsSync = false;
              state.lastSyncedAt = Date.now();
            });
          }
        } catch (error) {
          console.error('[ProgressionStore] Fetch failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      syncToRemote: async () => {
        const { needsSync, totalXp, currentLevel, currentRank, coins, gems } = get();
        if (!needsSync) return;

        const userId = await getCurrentUserId();
        if (!userId) return;

        set({ isSyncing: true });
        try {
          const getRes = await repositories.progression.getProgression(userId);
          if (!getRes.success) {
            await repositories.progression.initializeProgression(userId);
          }

          await repositories.progression.updateProgression(userId, {
            total_xp: totalXp,
            current_level: currentLevel,
            current_rank: currentRank,
            coins: coins,
            gems: gems,
          });

          set((state) => {
            state.needsSync = false;
            state.lastSyncedAt = Date.now();
          });
        } catch (error) {
          console.error('[ProgressionStore] Sync failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      reset: () => {
        set(() => ({ ...INITIAL_STATE }));
      },
    })),
    {
      name: 'progression-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
      // Don't persist sync state flags
      partialize: (state) => ({
        totalXp: state.totalXp,
        currentLevel: state.currentLevel,
        currentRank: state.currentRank,
        coins: state.coins,
        gems: state.gems,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);
