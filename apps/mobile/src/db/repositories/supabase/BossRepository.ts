import { type Result } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import {
  type BossRow,
  type BossPhaseRow,
  type BossObjectiveRow,
  type BossParticipantWithProfile,
} from '@/types/boss.types';
import { AppError } from '@/lib/errors';

export class BossRepository {
  async getActiveBosses(): Promise<Result<BossRow[]>> {
    const { data, error } = await (supabase as any)
      .from('bosses')
      .select('*')
      .in('status', ['active', 'enraged'])
      .order('end_time', { ascending: true });

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getBossDetails(bossId: string): Promise<Result<BossRow>> {
    const { data, error } = await (supabase as any)
      .from('bosses')
      .select('*')
      .eq('id', bossId)
      .single();

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getBossPhases(bossId: string): Promise<Result<BossPhaseRow[]>> {
    const { data, error } = await (supabase as any)
      .from('boss_phases')
      .select('*')
      .eq('boss_id', bossId)
      .order('hp_threshold_pct', { ascending: false });

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getBossObjectives(bossId: string): Promise<Result<BossObjectiveRow[]>> {
    const { data, error } = await (supabase as any)
      .from('boss_objectives')
      .select('*')
      .eq('boss_id', bossId);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getTopParticipants(
    bossId: string,
    limit: number = 10,
  ): Promise<Result<BossParticipantWithProfile[]>> {
    const { data, error } = await (supabase as any)
      .from('boss_participants')
      .select(
        `
        *,
        profiles:user_id (username, avatar_url)
      `,
      )
      .eq('boss_id', bossId)
      .order('total_damage', { ascending: false })
      .limit(limit);

    if (error) return { success: false, error };
    return { success: true, data };
  }

  async getParticipant(
    bossId: string,
    userId: string,
  ): Promise<Result<BossParticipantWithProfile>> {
    const { data, error } = await (supabase as any)
      .from('boss_participants')
      .select(
        `
        *,
        profiles:user_id (username, avatar_url)
      `,
      )
      .eq('boss_id', bossId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return { success: false, error };
    // It's possible the user hasn't participated yet, so data might be null.
    // If we want it to be considered successful but no data, we handle that in the caller.
    return { success: true, data };
  }

  async submitContribution(
    bossId: string,
    userId: string,
    objectiveId: string,
    activityType: string,
    amount: number,
    damageDealt: number,
    idempotencyKey: string,
    status: 'valid' | 'flagged_suspicious',
  ): Promise<Result<{ damage_applied: number; new_hp: number }>> {
    // Uses the Postgres RPC defined in migration
    const { data, error } = await (supabase.rpc as any)('submit_boss_contribution', {
      p_boss_id: bossId,
      p_user_id: userId,
      p_objective_id: objectiveId,
      p_activity_type: activityType,
      p_amount: amount,
      p_damage_dealt: damageDealt,
      p_idempotency_key: idempotencyKey,
      p_status: status,
    });

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    if (!data.success) return { success: false, error: new AppError(data.error, 'DatabaseError') };

    return {
      success: true,
      data: { damage_applied: data.damage_applied, new_hp: data.new_hp },
    };
  }

  // Developer tool ONLY
  async spawnTestBoss(boss: Partial<BossRow>): Promise<Result<BossRow>> {
    const { data, error } = await (supabase as any).from('bosses').insert(boss).select().single();

    if (error) return { success: false, error };
    return { success: true, data };
  }
}
