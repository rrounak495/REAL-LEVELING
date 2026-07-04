/**
 * src/store/onboarding.store.ts
 *
 * Zustand store for the onboarding flow.
 * Tracks all selections made during onboarding (username, selected goals,
 * selected skills) before they are committed to Supabase at the final step.
 *
 * Persisted to MMKV so users can resume onboarding after backgrounding the app.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mmkvZustandStorage } from '@lib/storage';

/** Predefined goal categories the user can select during onboarding */
export interface OnboardingGoal {
  id: string;
  label: string;
  description: string;
  icon: string;
  statFocus: 'str' | 'int' | 'vit' | 'wis' | 'cha';
}

export const ONBOARDING_GOALS: OnboardingGoal[] = [
  {
    id: 'physical_strength',
    label: 'Physical Strength',
    description: 'Build muscle, increase fitness and endurance',
    icon: '💪',
    statFocus: 'str',
  },
  {
    id: 'mental_mastery',
    label: 'Mental Mastery',
    description: 'Sharpen intellect, learn new skills, study',
    icon: '🧠',
    statFocus: 'int',
  },
  {
    id: 'vitality',
    label: 'Vitality',
    description: 'Improve health, sleep, nutrition and recovery',
    icon: '❤️',
    statFocus: 'vit',
  },
  {
    id: 'wisdom',
    label: 'Wisdom',
    description: 'Build discipline, consistency and mindfulness',
    icon: '🧘',
    statFocus: 'wis',
  },
  {
    id: 'charisma',
    label: 'Charisma',
    description: 'Improve social skills, leadership and presence',
    icon: '✨',
    statFocus: 'cha',
  },
];

// ── State Shape ───────────────────────────────────────────────────────────
interface OnboardingState {
  username: string;
  displayName: string;
  selectedGoalIds: string[];
  selectedSkillIds: string[];
  notificationsGranted: boolean;
}

interface OnboardingActions {
  setUsername: (username: string) => void;
  setDisplayName: (name: string) => void;
  toggleGoal: (goalId: string) => void;
  toggleSkill: (skillId: string) => void;
  setNotificationsGranted: (granted: boolean) => void;
  reset: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const INITIAL_STATE: OnboardingState = {
  username: '',
  displayName: '',
  selectedGoalIds: [],
  selectedSkillIds: [],
  notificationsGranted: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    immer((set) => ({
      ...INITIAL_STATE,

      setUsername: (username) => {
        set((state) => {
          state.username = username;
        });
      },

      setDisplayName: (displayName) => {
        set((state) => {
          state.displayName = displayName;
        });
      },

      toggleGoal: (goalId) => {
        set((state) => {
          const idx = state.selectedGoalIds.indexOf(goalId);
          if (idx === -1) {
            // Max 3 goals
            if (state.selectedGoalIds.length < 3) {
              state.selectedGoalIds.push(goalId);
            }
          } else {
            state.selectedGoalIds.splice(idx, 1);
          }
        });
      },

      toggleSkill: (skillId) => {
        set((state) => {
          const idx = state.selectedSkillIds.indexOf(skillId);
          if (idx === -1) {
            // Max 5 initial skills
            if (state.selectedSkillIds.length < 5) {
              state.selectedSkillIds.push(skillId);
            }
          } else {
            state.selectedSkillIds.splice(idx, 1);
          }
        });
      },

      setNotificationsGranted: (granted) => {
        set((state) => {
          state.notificationsGranted = granted;
        });
      },

      reset: () => {
        set(() => ({ ...INITIAL_STATE }));
      },
    })),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
    },
  ),
);
