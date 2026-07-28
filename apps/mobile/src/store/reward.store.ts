import { create } from 'zustand';

export type RewardEventType = 'XP' | 'LEVEL_UP';

export interface BaseRewardEvent {
  id: string;
  type: RewardEventType;
  title: string;
  priority: number;
  timestamp: string;
}

export interface XpRewardEvent extends BaseRewardEvent {
  type: 'XP';
  payload: {
    amount: number;
  };
}

export interface LevelUpRewardEvent extends BaseRewardEvent {
  type: 'LEVEL_UP';
  payload: {
    oldLevel: number;
    newLevel: number;
    overflowXp: number;
  };
}

export type AnyRewardEvent = XpRewardEvent | LevelUpRewardEvent;

interface RewardState {
  queue: AnyRewardEvent[];
  isAnimating: boolean;

  enqueueReward: (event: Omit<AnyRewardEvent, 'id' | 'timestamp'>) => void;
  shiftReward: () => void;
  setAnimating: (status: boolean) => void;
}

export const useRewardStore = create<RewardState>((set) => ({
  queue: [],
  isAnimating: false,

  enqueueReward: (eventInput) => {
    const newEvent: AnyRewardEvent = {
      ...eventInput,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    } as AnyRewardEvent;

    set((state) => {
      const newQueue = [...state.queue, newEvent];

      // Sort by priority (higher priority first)
      newQueue.sort((a, b) => b.priority - a.priority);

      return { queue: newQueue };
    });
  },

  shiftReward: () => {
    set((state) => ({
      queue: state.queue.slice(1),
      isAnimating: false,
    }));
  },

  setAnimating: (status: boolean) => {
    set({ isAnimating: status });
  },
}));
