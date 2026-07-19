import { create } from 'zustand';
import { JourneyService } from '@/features/journey/services';
import { useAuthStore } from './auth.store';
import {
  type UserJourneyRow,
  type UserJourneyDayRow,
} from '@/db/repositories/supabase/JourneyRepository';

export type ActiveJourneyType = UserJourneyRow & { days: UserJourneyDayRow[] };

interface JourneyState {
  activeJourney: ActiveJourneyType | null;
  journeyDays: UserJourneyDayRow[];
  isLoading: boolean;
  todaysObjective: any | null;
  todaysObjectiveCompleted: boolean;
  fetchActiveJourney: () => Promise<void>;
  startJourney: (profile: any, goal: string, durationDays: number) => Promise<void>;
  abandonJourney: () => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  activeJourney: null,
  journeyDays: [],
  isLoading: false,
  todaysObjective: null,
  todaysObjectiveCompleted: false,

  fetchActiveJourney: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    const journeyData = await JourneyService.getActiveJourney(user.id);

    if (journeyData && journeyData.days) {
      // Find today's objective
      const today = journeyData.days.find((d: any) => d.day_number === journeyData.current_day);

      set({
        activeJourney: journeyData as ActiveJourneyType,
        journeyDays: journeyData.days,
        todaysObjective: today || null,
        todaysObjectiveCompleted: today ? !!today.completed_at : false,
        isLoading: false,
      });
    } else {
      set({
        activeJourney: null,
        journeyDays: [],
        todaysObjective: null,
        todaysObjectiveCompleted: false,
        isLoading: false,
      });
    }
  },

  startJourney: async (profile: any, goal: string, durationDays: number) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    await JourneyService.startJourney(user.id, profile, goal, durationDays);
    await get().fetchActiveJourney();
  },

  abandonJourney: async () => {
    const { activeJourney } = get();
    if (!activeJourney) return;

    set({ isLoading: true });
    await JourneyService.abandonJourney(activeJourney.id);
    set({
      activeJourney: null,
      journeyDays: [],
      todaysObjective: null,
      todaysObjectiveCompleted: false,
      isLoading: false,
    });
  },
}));
