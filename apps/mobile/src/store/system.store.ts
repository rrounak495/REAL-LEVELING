import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import {
  type SystemUserStateRow,
  type SystemMomentRow,
  type MomentType,
} from '@/types/system.types';
import { type SystemInsight, SystemInsightService } from '@/services/SystemInsightService';
import { DailyChestService, type ProgressSource } from '@/services/DailyChestService';
import { ComebackService } from '@/services/ComebackService';

export interface SystemState {
  // DB State
  systemState: SystemUserStateRow | null;
  momentsQueue: SystemMomentRow[];

  // Derived / Transient State
  insights: SystemInsight[];
  nextBestAction: SystemInsight | null;
  hasViewedBriefing: boolean;
  isLoading: boolean;
  isInitializing: boolean;

  // Actions
  initializeSystem: (userId: string) => Promise<void>;
  markBriefingViewed: () => void;
  addProgress: (userId: string, source: ProgressSource) => Promise<void>;
  claimDailyChest: (userId: string) => Promise<void>;
  enqueueMoment: (
    userId: string,
    type: MomentType,
    payload: any,
    priority?: number,
  ) => Promise<void>;
  markMomentViewed: (momentId: string, userId: string) => Promise<void>;
  refreshInsights: (context: any) => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  systemState: null,
  momentsQueue: [],
  insights: [],
  nextBestAction: null,
  hasViewedBriefing: false,
  isLoading: false,
  isInitializing: true,

  initializeSystem: async (userId: string) => {
    set({ isInitializing: true });

    // Fetch state and queue
    const [stateRes, queueRes] = await Promise.all([
      repositories.system.getSystemState(userId),
      repositories.system.getMomentsQueue(userId),
    ]);

    let systemState = stateRes.success ? stateRes.data : null;
    const momentsQueue = queueRes.success ? queueRes.data : [];

    // Evaluate Comeback State
    if (systemState) {
      const daysInactive = ComebackService.calculateDaysInactive(
        systemState.last_progress_date,
        systemState.timezone_offset_minutes,
      );
      const newComebackTier = ComebackService.evaluateComebackTier(daysInactive);

      // We would ideally persist this back to the DB if it changed, but we can do that on the next progress event.
      systemState = { ...systemState, comeback_tier: newComebackTier };
    }

    set({
      systemState,
      momentsQueue,
      isInitializing: false,
    });
  },

  markBriefingViewed: () => {
    set({ hasViewedBriefing: true });
  },

  addProgress: async (userId, source) => {
    const res = await DailyChestService.addProgress(userId, source);
    if (res.success && res.data) {
      set((state) => ({
        systemState: state.systemState
          ? {
              ...state.systemState,
              daily_progress_score: res.data.daily_progress_score!,
              daily_chest_status: res.data.daily_chest_status!,
            }
          : null,
      }));
    }
  },

  claimDailyChest: async (userId) => {
    set({ isLoading: true });
    const res = await DailyChestService.claimChest(userId);
    if (res.success) {
      set((state) => ({
        systemState: state.systemState
          ? { ...state.systemState, daily_chest_status: 'claimed' }
          : null,
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },

  enqueueMoment: async (userId, type, payload, priority = 10) => {
    const res = await repositories.system.enqueueMoment(userId, type, payload, priority);
    if (res.success) {
      set((state) => ({
        momentsQueue: [...state.momentsQueue, res.data].sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }),
      }));
    }
  },

  markMomentViewed: async (momentId, userId) => {
    set((state) => ({
      momentsQueue: state.momentsQueue.filter((m) => m.id !== momentId),
    }));
    await repositories.system.markMomentViewed(momentId, userId);
  },

  refreshInsights: (context) => {
    const state = get().systemState;
    if (!state) return;

    // We can lazily import or assume context passes it, but better to fetch it here if not passed.
    // In a real app we might inject useHabitStore and getDayState from the component,
    // or import them directly here if they don't cause circular dependencies.
    const fullContext = {
      ...context,
      systemState: state,
    };

    const insights = SystemInsightService.generateInsights(fullContext);
    const nextBestAction = SystemInsightService.getNextBestAction(insights);

    set({ insights, nextBestAction });
  },
}));
