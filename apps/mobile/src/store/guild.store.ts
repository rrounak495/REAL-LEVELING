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

    // Mock Recommended Guilds for Discovery Mode
    const recommended: GuildProfile[] = [
      {
        id: 'g1',
        name: 'Shadow Strikers',
        description: 'Dedicated to endurance and world bosses.',
        level: 14,
        xp: 45000,
        memberCount: 45,
        region: 'Global',
        rank: 'Gold Vanguard',
        totalBossDamage: 2500000,
        totalJourneysCompleted: 450,
        logo: '🗡️',
      },
      {
        id: 'g2',
        name: 'Iron Forged',
        description: 'Strength training and heavy lifting.',
        level: 8,
        xp: 12000,
        memberCount: 22,
        region: 'North America',
        rank: 'Silver Battalion',
        totalBossDamage: 800000,
        totalJourneysCompleted: 120,
        logo: '🏋️',
      },
    ];

    // Simulating no guild initially for testing, but let's assume the user is in 'g1' to show dashboard.
    // Set to null to test discovery, or uncomment to test dashboard.
    /*
    const myGuild = recommended[0];
    const myRole = 'member';
    const myMembers: GuildMember[] = [
      { hunterId: 'HNT-123', name: 'SungJin', role: 'leader', contributionScore: 15000 },
      { hunterId: userId, name: 'You', role: 'member', contributionScore: 4500 },
    ];
    const myMissions: GuildMission[] = [
      { id: 'm1', title: 'Global Raid Prep', description: 'Deal 1,000,000 damage to any Boss.', currentProgress: 650000, targetProgress: 1000000, rewardCoins: 5000, type: 'boss_damage' },
      { id: 'm2', title: 'Iron Discipline', description: 'Complete 250 Workouts.', currentProgress: 180, targetProgress: 250, rewardCoins: 2500, type: 'workouts' },
    ];
    */

    set({
      // activeGuild: myGuild,
      // userRole: myRole,
      // members: myMembers,
      // activeMissions: myMissions,
      activeGuild: null,
      userRole: null,
      members: [],
      activeMissions: [],
      recommendedGuilds: recommended,
      isLoading: false,
    });
  },

  joinGuild: async (guildId: string) => {
    set({ isLoading: true });
    // Mock join
    const guild = get().recommendedGuilds.find((g) => g.id === guildId);
    if (guild) {
      set({
        activeGuild: guild,
        userRole: 'member',
        members: [{ hunterId: 'me', name: 'Hunter', role: 'member', contributionScore: 0 }],
        activeMissions: [
          {
            id: 'm1',
            title: 'Iron Discipline',
            description: 'Complete 250 Workouts.',
            currentProgress: 180,
            targetProgress: 250,
            rewardCoins: 2500,
            type: 'workouts',
          },
        ],
        isLoading: false,
      });
    }
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
