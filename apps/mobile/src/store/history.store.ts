import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvZustandStorage } from '@lib/storage';

export interface HistoryRecord {
  id: string; // unique ID for the history log
  taskId: string;
  completedAt: string;
  type: 'custom' | 'compulsory';
  xpEarned: number;
}

interface HistoryState {
  records: HistoryRecord[];
  addRecord: (record: Omit<HistoryRecord, 'id'>) => void;
  clearHistory: () => void;
}

function generateId(): string {
  return `hist_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (input) => {
        try {
          const record: HistoryRecord = {
            id: generateId(),
            ...input,
          };
          set((state) => ({ records: [record, ...state.records] }));
        } catch (error) {
          console.error('[HistoryStore] Failed to add record:', error);
        }
      },
      clearHistory: () => {
        set({ records: [] });
      },
    }),
    {
      name: 'tasks-history-storage',
      storage: createJSONStorage(() => mmkvZustandStorage),
    },
  ),
);
