/**
 * src/store/popup.store.ts
 *
 * Generic queue system for sequential reward popups.
 */
import { create } from 'zustand';

export type PopupType =
  | 'xp_gain'
  | 'coin_gain'
  | 'gem_gain'
  | 'achievement_unlock'
  | 'badge_unlock'
  | 'level_up'
  | 'rank_up'
  | 'item_unlock'
  | 'evolution';

export interface PopupEvent {
  id: string; // unique ID
  type: PopupType;
  title: string;
  subtitle?: string;
  amount?: number;
  icon?: string;
  rarity?: string;
}

interface PopupState {
  queue: PopupEvent[];
  isDisplaying: boolean;

  enqueue: (event: Omit<PopupEvent, 'id'>) => void;
  dequeue: () => void;
  clear: () => void;
}

let nextId = 0;

export const usePopupStore = create<PopupState>((set, get) => ({
  queue: [],
  isDisplaying: false,

  enqueue: (event) => {
    set((state) => {
      const newEvent = { ...event, id: `popup_${Date.now()}_${nextId++}` };
      return {
        queue: [...state.queue, newEvent],
        isDisplaying: true, // Start displaying if we add something
      };
    });
  },

  dequeue: () => {
    set((state) => {
      const remaining = state.queue.slice(1);
      return {
        queue: remaining,
        isDisplaying: remaining.length > 0,
      };
    });
  },

  clear: () => {
    set({ queue: [], isDisplaying: false });
  },
}));
