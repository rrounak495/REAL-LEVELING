import { create } from 'zustand';
import { useDashboardStore } from './dashboard.store';

export interface ProfileState {
  currentLevel: number;
  currentXp: number;
  streak: number;
  momentum: string;
  activeGoal: string | null;
  isPremium: boolean;
  completionPercentage: number;

  sync: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentLevel: 1,
  currentXp: 0,
  streak: 0,
  momentum: 'Neutral',
  activeGoal: null,
  isPremium: false,
  completionPercentage: 0,

  sync: () => {
    // Automatically synchronize state from the unified dashboard store
    const dash = useDashboardStore.getState();

    // Extract XP/Level from progressData
    const xpMetric = dash.progressData?.metrics.find((m) => m.label === 'Total XP');
    const levelMetric = dash.progressData?.metrics.find((m) => m.label === 'Current Level');
    const streakMetric = dash.progressData?.metrics.find((m) => m.label === 'Streak');

    set({
      currentXp: xpMetric ? parseInt(xpMetric.value, 10) : 0,
      currentLevel: levelMetric ? parseInt(levelMetric.value, 10) : 1,
      streak: streakMetric ? parseInt(streakMetric.value, 10) : 0,
      activeGoal: dash.goal?.title || null,
      isPremium: dash.isPremium,
      completionPercentage: dash.goalProgress?.percentComplete || 0,
    });
  },
}));
