import { supabase } from '@/lib/supabase';
import { type Result, AppError } from '@/lib/errors';
import {
  type SystemUserStateRow,
  type SystemMomentRow,
  type PersonalRecordRow,
  RivalRow,
  NotificationPreferencesRow,
  type AddProgressResult,
} from '@/types/system.types';

export class SystemRepository {
  async getSystemState(userId: string): Promise<Result<SystemUserStateRow | null>> {
    const { data, error } = await (supabase as any)
      .from('system_user_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data };
  }

  async addDailyProgress(userId: string, points: number): Promise<Result<AddProgressResult>> {
    const { data, error } = await (supabase as any).rpc('add_daily_progress', {
      p_user_id: userId,
      p_points: points,
    });

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    if (!data.success)
      return {
        success: false,
        error: new AppError(data.error || 'Unknown error', 'DatabaseError'),
      };

    return { success: true, data: data as AddProgressResult };
  }

  async claimDailyChest(userId: string): Promise<Result<{ success: boolean }>> {
    const { data, error } = await (supabase as any).rpc('claim_daily_chest', { p_user_id: userId });

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    if (!data.success)
      return {
        success: false,
        error: new AppError(data.error || 'Unknown error', 'DatabaseError'),
      };

    return { success: true, data: { success: true } };
  }

  async getMomentsQueue(userId: string): Promise<Result<SystemMomentRow[]>> {
    const { data, error } = await (supabase as any)
      .from('system_moments_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('is_viewed', false)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data: data as SystemMomentRow[] };
  }

  async markMomentViewed(momentId: string, userId: string): Promise<Result<void>> {
    const { error } = await (supabase as any)
      .from('system_moments_queue')
      .update({ is_viewed: true })
      .eq('id', momentId)
      .eq('user_id', userId);

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data: undefined };
  }

  async enqueueMoment(
    userId: string,
    type: string,
    payload: any,
    priority: number = 10,
  ): Promise<Result<SystemMomentRow>> {
    const { data, error } = await (supabase as any)
      .from('system_moments_queue')
      .insert({
        user_id: userId,
        moment_type: type,
        payload,
        priority,
      })
      .select()
      .single();

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data: data as SystemMomentRow };
  }

  async getPersonalRecords(userId: string): Promise<Result<PersonalRecordRow[]>> {
    const { data, error } = await (supabase as any)
      .from('personal_records')
      .select('*')
      .eq('user_id', userId);

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data: data as PersonalRecordRow[] };
  }

  async updatePersonalRecord(
    userId: string,
    activityType: string,
    value: number,
    metadata: any = {},
  ): Promise<Result<PersonalRecordRow>> {
    const { data, error } = await (supabase as any)
      .from('personal_records')
      .upsert(
        {
          user_id: userId,
          activity_type: activityType,
          record_value: value,
          metadata,
        },
        { onConflict: 'user_id,activity_type' },
      )
      .select()
      .single();

    if (error) return { success: false, error: new AppError(error.message, 'DatabaseError') };
    return { success: true, data: data as PersonalRecordRow };
  }
}
