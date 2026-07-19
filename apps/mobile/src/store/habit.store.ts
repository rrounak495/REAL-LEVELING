import { create } from 'zustand';

export interface HabitLog {
  id: string; // e.g., 'hydration', 'sleep_prep'
  completedAt: string | null;
  lastNotifiedAt: string | null;
}

interface HabitState {
  habits: Record<string, HabitLog>;

  markHabitCompleted: (habitId: string) => void;
  markHabitNotified: (habitId: string) => void;
  canNotify: (habitId: string, cooldownHours: number) => boolean;
  resetDailyHabits: () => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: {},

  markHabitCompleted: (habitId) => {
    set((state) => ({
      habits: {
        ...state.habits,
        [habitId]: {
          id: habitId,
          completedAt: new Date().toISOString(),
          lastNotifiedAt: state.habits[habitId]?.lastNotifiedAt || null,
        },
      },
    }));
  },

  markHabitNotified: (habitId) => {
    set((state) => ({
      habits: {
        ...state.habits,
        [habitId]: {
          id: habitId,
          completedAt: state.habits[habitId]?.completedAt || null,
          lastNotifiedAt: new Date().toISOString(),
        },
      },
    }));
  },

  canNotify: (habitId, cooldownHours) => {
    const habit = get().habits[habitId];
    if (!habit) return true;
    if (habit.completedAt) {
      // Check if it was completed today
      const completedDate = new Date(habit.completedAt).toDateString();
      const today = new Date().toDateString();
      if (completedDate === today) return false;
    }

    if (habit.lastNotifiedAt) {
      const hoursSinceNotification =
        (Date.now() - new Date(habit.lastNotifiedAt).getTime()) / (1000 * 60 * 60);
      if (hoursSinceNotification < cooldownHours) return false;
    }

    return true;
  },

  resetDailyHabits: () => {
    set({ habits: {} }); // Simple reset for prototype
  },
}));
