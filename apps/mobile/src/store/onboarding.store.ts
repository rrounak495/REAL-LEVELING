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
    id: 'weight_loss',
    label: 'Weight Loss',
    description: 'Burn calories, lose fat, and lean out with intense cardio and circuits.',
    icon: '🔥',
    statFocus: 'vit',
  },
  {
    id: 'muscle_gain',
    label: 'Muscle Gain',
    description: 'Build raw strength, increase muscle mass, and lift heavier weights.',
    icon: '💪',
    statFocus: 'str',
  },
  {
    id: 'general_fitness',
    label: 'General Fitness',
    description: 'A balanced approach to overall health, mobility, and discipline.',
    icon: '🧘',
    statFocus: 'wis',
  },
];

// ── State Shape ───────────────────────────────────────────────────────────
interface OnboardingState {
  username: string;
  displayName: string;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'general_fitness' | null;
  fitnessExperience: 'beginner' | 'intermediate' | 'experienced' | null;
  trainingLocation: 'home' | 'gym' | 'both' | null;
  availableDailyTime: 15 | 30 | 45 | 60 | null;
  selectedSkillIds: string[];
  notificationsGranted: boolean;
  gender: 'male' | 'female' | null;
}

interface OnboardingActions {
  setUsername: (username: string) => void;
  setDisplayName: (name: string) => void;
  setFitnessGoal: (goal: 'weight_loss' | 'muscle_gain' | 'general_fitness') => void;
  setFitnessExperience: (exp: 'beginner' | 'intermediate' | 'experienced') => void;
  setTrainingLocation: (loc: 'home' | 'gym' | 'both') => void;
  setAvailableDailyTime: (time: 15 | 30 | 45 | 60) => void;
  toggleSkill: (skillId: string) => void;
  setNotificationsGranted: (granted: boolean) => void;
  setGender: (gender: 'male' | 'female') => void;
  reset: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const INITIAL_STATE: OnboardingState = {
  username: '',
  displayName: '',
  fitnessGoal: null,
  fitnessExperience: null,
  trainingLocation: null,
  availableDailyTime: null,
  selectedSkillIds: [],
  notificationsGranted: false,
  gender: null,
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

      setFitnessGoal: (goal) => {
        set((state) => {
          state.fitnessGoal = goal;
        });
      },

      setFitnessExperience: (exp) => {
        set((state) => {
          state.fitnessExperience = exp;
        });
      },

      setTrainingLocation: (loc) => {
        set((state) => {
          state.trainingLocation = loc;
        });
      },

      setAvailableDailyTime: (time) => {
        set((state) => {
          state.availableDailyTime = time;
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

      setGender: (gender) => {
        set((state) => {
          state.gender = gender;
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
