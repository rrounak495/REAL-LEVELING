import { create } from 'zustand';

export interface GuildProfile {
  id: string;
  name: string;
  description: string;
  level: number;
  xp: number;
  memberCount: number;
  region: string;
  rank: string; // e.g., 'Gold Vanguard'
  totalBossDamage: number;
  totalJourneysCompleted: number;
  logo: string; // emoji for now
}

export interface GuildMember {
  hunterId: string;
  name: string;
  role: 'leader' | 'officer' | 'member';
  contributionScore: number;
}

export interface GuildMission {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  targetProgress: number;
  rewardCoins: number;
  type: 'workouts' | 'boss_damage' | 'recovery';
}

interface GuildState {
  // Current user's active guild
  activeGuild: GuildProfile | null;
  userRole: GuildMember['role'] | null;
  members: GuildMember[];
  activeMissions: GuildMission[];

  // Discovery
  recommendedGuilds: GuildProfile[];

  isLoading: boolean;

  // Actions
  fetchGuildData: (userId: string) => Promise<void>;
  joinGuild: (guildId: string) => Promise<void>;
  leaveGuild: () => Promise<void>;
  createGuild: (name: string, description: string, region: string) => Promise<void>;
}

export const useGuildStore = create<GuildState>((set, get) => ({
  activeGuild: null,
  userRole: null,
  members: [],
  activeMissions: [],
  recommendedGuilds: [],
  isLoading: false,

  fetchGuildData: async (userId: string) => {
    set({ isLoading: true });

    set({
      activeGuild: null,
      userRole: null,
      members: [],
      activeMissions: [],
      recommendedGuilds: [],
      isLoading: false,
    });
  },

  joinGuild: async (guildId: string) => {
    set({ isLoading: true });
    
    // Fallback: Guild feature not fully implemented in DB yet
    set({ isLoading: false });
  },

  leaveGuild: async () => {
    set({ activeGuild: null, userRole: null, members: [], activeMissions: [] });
  },

  createGuild: async (name, description, region) => {
    set({ isLoading: true });
    const newGuild: GuildProfile = {
      id: Math.random().toString(36).substring(7),
      name,
      description,
      region,
      level: 1,
      xp: 0,
      memberCount: 1,
      rank: 'Bronze Recruit',
      totalBossDamage: 0,
      totalJourneysCompleted: 0,
      logo: '🛡️',
    };
    set({
      activeGuild: newGuild,
      userRole: 'leader',
      members: [{ hunterId: 'me', name: 'Hunter', role: 'leader', contributionScore: 0 }],
      activeMissions: [
        {
          id: 'm1',
          title: 'Guild Foundation',
          description: 'Complete 10 Workouts.',
          currentProgress: 0,
          targetProgress: 10,
          rewardCoins: 500,
          type: 'workouts',
        },
      ],
      isLoading: false,
    });
  },
}));
