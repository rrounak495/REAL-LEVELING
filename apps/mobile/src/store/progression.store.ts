/**
 * store/progression.store.ts — Progression State
 *
 * Caches the user's progression state locally via MMKV.
 * Provides offline-first reads for XP, Level, Rank, Coins, and Gems.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mmkvZustandStorage } from '@lib/storage';
import { Rank } from '@/features/progression/engines/RankEngine';

export interface ProgressionState {
  level: number;
  xp: number;
  rank: string; // Stored as string to allow easy persistence
  coins: number;
  gems: number;
}

interface ProgressionActions {
  setProgression: (state: Partial<ProgressionState>) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  reset: () => void;
}

type ProgressionStore = ProgressionState & ProgressionActions;

const initialState: ProgressionState = {
  level: 1,
  xp: 0,
  rank: Rank.IRON,
  coins: 0,
  gems: 0,
};

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      setProgression: (updates) => {
        set((state) => {
          Object.assign(state, updates);
        });
      },

      addXp: (amount) => {
        set((state) => {
          state.xp += amount;
        });
      },

      addCoins: (amount) => {
        set((state) => {
          state.coins += amount;
        });
      },

      addGems: (amount) => {
        set((state) => {
          state.gems += amount;
        });
      },

      reset: () => {
        set((state) => {
          Object.assign(state, initialState);
        });
      },
    })),
    {
      name: 'progression-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
    },
  ),
);
