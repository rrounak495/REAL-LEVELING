import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { supabase } from '@/lib/supabase';
import {
  type BossRow,
  type BossPhaseRow,
  type BossObjectiveRow,
  type BossParticipantWithProfile,
} from '@/types/boss.types';
import { type RealtimeChannel } from '@supabase/supabase-js';
import { useFeedStore } from './feed.store';
import { useSystemStore } from './system.store';
import { bossBattleService } from '@/services/BossBattleService';
import { type ActivitySubmission } from '@/services/DamageCalculationService';

export interface BossState {
  activeBosses: BossRow[];
  currentBoss: BossRow | null;
  currentBossPhases: BossPhaseRow[];
  currentBossObjectives: BossObjectiveRow[];
  leaderboard: BossParticipantWithProfile[];
  userParticipant: BossParticipantWithProfile | null;

  isLoading: boolean;
  error: string | null;

  // Realtime subscription channel
  bossSubscription: RealtimeChannel | null;

  fetchActiveBosses: () => Promise<void>;
  fetchBossDetails: (bossId: string, userId: string) => Promise<void>;
  subscribeToBoss: (bossId: string) => void;
  unsubscribeFromBoss: () => void;
  submitDamage: (userId: string, submission: ActivitySubmission) => Promise<boolean>;

  // Dev tools
  spawnTestBoss: () => Promise<void>;
}

export const useBossStore = create<BossState>((set, get) => ({
  activeBosses: [],
  currentBoss: null,
  currentBossPhases: [],
  currentBossObjectives: [],
  leaderboard: [],
  userParticipant: null,
  isLoading: false,
  error: null,
  bossSubscription: null,

  fetchActiveBosses: async () => {
    set({ isLoading: true, error: null });
    const res = await repositories.boss.getActiveBosses();
    if (res.success) {
      set({ activeBosses: res.data, isLoading: false });
    } else {
      set({ error: (res.error as Error).message, isLoading: false });
    }
  },

  fetchBossDetails: async (bossId: string, userId: string) => {
    set({ isLoading: true, error: null });
    const [bossRes, phasesRes, objRes, participantsRes, userRes] = await Promise.all([
      repositories.boss.getBossDetails(bossId),
      repositories.boss.getBossPhases(bossId),
      repositories.boss.getBossObjectives(bossId),
      repositories.boss.getTopParticipants(bossId, 50),
      repositories.boss.getParticipant(bossId, userId),
    ]);

    if (bossRes.success) {
      set({
        currentBoss: bossRes.data,
        currentBossPhases: phasesRes.success ? phasesRes.data : [],
        currentBossObjectives: objRes.success ? objRes.data : [],
        leaderboard: participantsRes.success ? participantsRes.data : [],
        userParticipant: userRes.success ? userRes.data : null,
        isLoading: false,
      });
    } else {
      set({ error: 'Failed to fetch boss details', isLoading: false });
    }
  },

  subscribeToBoss: (bossId: string) => {
    const { bossSubscription } = get();
    if (bossSubscription) {
      get().unsubscribeFromBoss();
    }

    const channel = supabase
      .channel(`boss_${bossId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bosses', filter: `id=eq.${bossId}` },
        (payload) => {
          const newBossData = payload.new as BossRow;
          const oldBossData = payload.old as BossRow;

          set({ currentBoss: newBossData });

          // Trigger boss defeat social post
          if (
            oldBossData &&
            oldBossData.status !== 'defeated' &&
            newBossData.status === 'defeated'
          ) {
            // In a real app we'd fetch the user ID that got the final hit or we'd just post a system message.
            // For now, if the current logged in user is viewing, we can post it on their behalf or use a system ID.
            const userId = get().userParticipant?.user_id;
            if (userId) {
              useFeedStore
                .getState()
                .createPost(
                  userId,
                  'boss',
                  `I helped defeat ${newBossData.name}!`,
                  newBossData.artwork_url,
                  'Victory',
                );

              useSystemStore.getState().enqueueMoment(
                userId,
                'boss_defeat',
                { bossName: newBossData.name },
                5, // Priority 5
              );
            }
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'boss_participants',
          filter: `boss_id=eq.${bossId}`,
        },
        async () => {
          // Whenever participants change, we might want to refresh the leaderboard
          // For a production app, we would only fetch what changed or debounce this
          const res = await repositories.boss.getTopParticipants(bossId, 50);
          if (res.success) {
            set({ leaderboard: res.data });
          }
        },
      )
      .subscribe();

    set({ bossSubscription: channel });
  },

  unsubscribeFromBoss: () => {
    const { bossSubscription } = get();
    if (bossSubscription) {
      bossSubscription.unsubscribe();
      set({ bossSubscription: null });
    }
  },

  submitDamage: async (userId: string, submission: ActivitySubmission) => {
    const { currentBoss, currentBossPhases } = get();
    if (!currentBoss) return false;

    set({ isLoading: true });

    // Mock daily total for now - in production this comes from a stats repo
    const currentDailyTotal = 0;

    const result = await bossBattleService.submitDamage(
      currentBoss.id,
      userId,
      submission,
      currentDailyTotal,
      currentBoss.current_hp,
      currentBoss.total_hp,
      currentBossPhases,
    );

    if (result.success) {
      // The Realtime subscription will actually update the UI automatically,
      // but we can proactively refresh the user's personal stats
      const userRes = await repositories.boss.getParticipant(currentBoss.id, userId);
      set({
        userParticipant: userRes.success ? userRes.data : null,
        isLoading: false,
      });
      return true;
    } else {
      set({ error: (result.error as Error).message, isLoading: false });
      return false;
    }
  },

  spawnTestBoss: async () => {
    set({ isLoading: true });

    // Create a 1-hour test boss
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const newBoss: Partial<BossRow> = {
      name: 'Igris, The Blood-Red Commander',
      title: 'Knight Commander',
      lore: 'The loyal knight guarding the empty throne.',
      artwork_url: 'https://example.com/igris.jpg', // Placeholder
      boss_type: 'world_boss',
      difficulty: 'extreme',
      rarity: 'legendary',
      total_hp: 1000000,
      current_hp: 1000000,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'active',
      recommended_level: 40,
      min_level: 10,
    };

    const res = await repositories.boss.spawnTestBoss(newBoss);
    if (res.success) {
      await (supabase as any).from('boss_objectives').insert([
        { boss_id: res.data.id, activity_type: 'pushup', base_damage: 2.0 },
        { boss_id: res.data.id, activity_type: 'squat', base_damage: 1.5 },
      ]);

      await (supabase as any).from('boss_phases').insert([
        {
          boss_id: res.data.id,
          phase_name: 'Phase 2',
          hp_threshold_pct: 70,
          damage_multiplier: 0.8,
        },
        {
          boss_id: res.data.id,
          phase_name: 'Enraged',
          hp_threshold_pct: 30,
          damage_multiplier: 0.5,
          visual_state: 'enraged',
        },
      ]);

      await get().fetchActiveBosses();
    } else {
      set({ error: 'Failed to spawn test boss', isLoading: false });
    }
  },

  spawnGuildBoss: async (guildId: string) => {
    set({ isLoading: true });
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newBoss: Partial<BossRow> = {
      name: 'Guild Raid: Giant Arachnid',
      title: 'Dungeon Boss',
      lore: 'A cooperative raid for the guild.',
      artwork_url: 'https://example.com/spider.jpg',
      boss_type: 'guild_boss',
      guild_id: guildId,
      difficulty: 'hard',
      rarity: 'epic',
      total_hp: 500000,
      current_hp: 500000,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'active',
      recommended_level: 20,
      min_level: 1,
    };

    const res = await repositories.boss.spawnTestBoss(newBoss);
    if (res.success) {
      await (supabase as any).from('boss_objectives').insert([
        { boss_id: res.data.id, activity_type: 'pushup', base_damage: 1.0 },
        { boss_id: res.data.id, activity_type: 'squat', base_damage: 1.0 },
      ]);
      await get().fetchActiveBosses();
    } else {
      set({ error: 'Failed to spawn guild boss', isLoading: false });
    }
  },
}));
