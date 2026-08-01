import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface HunterPassport {
  hunterId: string;
  hunterSince: string;
  region: string;
  lifetimeTitle: string;
}

export interface LifeStatistics {
  totalWorkoutDays: number;
  totalRecoveryDays: number;
  totalBossesDefeated: number;
  totalJourneyDays: number;
  lifetimeTrainingTimeMinutes: number;
  lifetimeDistanceKm: number;
  totalCaloriesBurned: number;
  personalRecordsCount: number;
}

export interface Trophy {
  id: string;
  type:
    'journey_badge' | 'boss_trophy' | 'rank_badge' | 'evolution_badge' | 'title' | 'certificate';
  name: string;
  description: string;
  unlockedAt: string | null; // null if locked
  icon: string;
}

export interface MemoryEntry {
  id: string;
  type:
    | 'journey_completed'
    | 'weekly_report'
    | 'monthly_report'
    | 'boss_victory'
    | 'personal_record'
    | 'system_moment';
  title: string;
  date: string;
  details: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string; // e.g. "SYSTEM\nHunter reached Rank Silver today."
  type:
    | 'journey_started'
    | 'boss_defeated'
    | 'personal_record'
    | 'rank_up'
    | 'evolution'
    | 'journey_completed';
}

interface LifeState {
  passport: HunterPassport;
  statistics: LifeStatistics;
  trophies: Trophy[];
  memories: MemoryEntry[];
  diary: DiaryEntry[];

  isLoading: boolean;
  initializeLifeEngine: (userId: string) => Promise<void>;
  addDiaryEntry: (type: DiaryEntry['type'], message: string) => void;
  // Future architecture hooks prepared below (AI Coach, Guilds, etc.)
  syncWearableData?: () => Promise<void>;
}

export const useLifeStore = create<LifeState>((set, get) => ({
  passport: {
    hunterId: 'HNT-00000000',
    hunterSince: new Date().toISOString(),
    region: 'Global',
    lifetimeTitle: 'The Awakened',
  },
  statistics: {
    totalWorkoutDays: 0,
    totalRecoveryDays: 0,
    totalBossesDefeated: 0,
    totalJourneyDays: 0,
    lifetimeTrainingTimeMinutes: 0,
    lifetimeDistanceKm: 0,
    totalCaloriesBurned: 0,
    personalRecordsCount: 0,
  },
  trophies: [],
  memories: [],
  diary: [],
  isLoading: false,

  initializeLifeEngine: async (userId: string) => {
    set({ isLoading: true });

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        set({
          passport: {
            hunterId: `HNT-${userId.substring(0, 8).toUpperCase()}`,
            hunterSince: profile.created_at,
            region: profile.country || 'Global',
            lifetimeTitle: profile.experience_level || 'The Awakened',
          }
        });
      }

      // We'll leave stats and diary as empty until their specific repositories are integrated
      set({
        statistics: {
          totalWorkoutDays: 0,
          totalRecoveryDays: 0,
          totalBossesDefeated: 0,
          totalJourneyDays: 0,
          lifetimeTrainingTimeMinutes: 0,
          lifetimeDistanceKm: 0,
          totalCaloriesBurned: 0,
          personalRecordsCount: 0,
        },
        diary: [],
        trophies: [],
        memories: [],
      });

    } catch (error) {
      console.error('Error initializing life engine:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDiaryEntry: (type, content) => {
    set((state) => ({
      diary: [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          type,
          content,
        },
        ...state.diary,
      ],
    }));
  },
}));
