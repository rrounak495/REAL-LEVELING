import { create } from 'zustand';

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

    // In a real implementation, we would fetch from repositories.life
    // For now, we seed with mock data to build the frontend
    const mockPassport: HunterPassport = {
      hunterId: `HNT-${userId.substring(0, 8).toUpperCase()}`,
      hunterSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      region: 'Earth - Sector 4',
      lifetimeTitle: 'The Awakened',
    };

    const mockStats: LifeStatistics = {
      totalWorkoutDays: 24,
      totalRecoveryDays: 6,
      totalBossesDefeated: 3,
      totalJourneyDays: 30,
      lifetimeTrainingTimeMinutes: 1440,
      lifetimeDistanceKm: 42,
      totalCaloriesBurned: 12500,
      personalRecordsCount: 5,
    };

    const mockDiary: DiaryEntry[] = [
      {
        id: '1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'journey_started',
        content: 'SYSTEM\nFirst Journey Started.',
      },
      {
        id: '2',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'boss_defeated',
        content: 'SYSTEM\nShadow Wolf Defeated.',
      },
      {
        id: '3',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'rank_up',
        content: 'SYSTEM\nHunter reached Rank Bronze today.',
      },
      {
        id: '4',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'personal_record',
        content: 'SYSTEM\nNew PR: 50 Push-ups unbroken.',
      },
    ];

    const mockTrophies: Trophy[] = [
      {
        id: 't1',
        type: 'journey_badge',
        name: 'First Awakening',
        description: 'Complete your first Journey.',
        unlockedAt: new Date().toISOString(),
        icon: '🎖️',
      },
      {
        id: 't2',
        type: 'boss_trophy',
        name: 'Wolf Bane',
        description: 'Defeat the Shadow Wolf.',
        unlockedAt: new Date().toISOString(),
        icon: '🐺',
      },
      {
        id: 't3',
        type: 'rank_badge',
        name: 'Bronze Hunter',
        description: 'Reach Bronze Rank.',
        unlockedAt: new Date().toISOString(),
        icon: '🥉',
      },
      {
        id: 't4',
        type: 'evolution_badge',
        name: 'Warrior',
        description: 'Evolve to Warrior stage.',
        unlockedAt: null,
        icon: '⚔️',
      }, // Locked
    ];

    const mockMemories: MemoryEntry[] = [
      {
        id: 'm1',
        type: 'journey_completed',
        title: 'The Awakening Journey',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        details: '30 Days of foundational strength and conditioning.',
      },
      {
        id: 'm2',
        type: 'boss_victory',
        title: 'Victory over Shadow Wolf',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Contributed 25,000 Damage to the Global Raid.',
      },
    ];

    set({
      passport: mockPassport,
      statistics: mockStats,
      diary: mockDiary,
      trophies: mockTrophies,
      memories: mockMemories,
      isLoading: false,
    });
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
