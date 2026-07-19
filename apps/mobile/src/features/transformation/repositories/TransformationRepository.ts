import { supabase } from '@/lib/supabase';
import { type Database } from '@/types/database.types';

export type TransformationProfileRow =
  Database['public']['Tables']['transformation_profiles']['Row'];
export type BodyMeasurementRow = Database['public']['Tables']['body_measurements']['Row'];
export type ProgressPhotoRow = Database['public']['Tables']['progress_photos']['Row'];
export type StrengthRecordRow = Database['public']['Tables']['strength_records']['Row'];
export type LifeHistoryStatsRow = Database['public']['Tables']['life_history_stats']['Row'];

export class TransformationRepository {
  /**
   * Fetches the user's transformation profile.
   */
  static async getProfile(userId: string): Promise<TransformationProfileRow | null> {
    const { data, error } = await supabase
      .from('transformation_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching transformation profile:', error);
      return null;
    }
    return data;
  }

  /**
   * Upserts the user's transformation profile.
   */
  static async upsertProfile(profile: Partial<TransformationProfileRow> & { user_id: string }) {
    const { data, error } = await supabase
      .from('transformation_profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error upserting transformation profile:', error);
      throw error;
    }
    return data;
  }

  /**
   * Fetches body measurements.
   */
  static async getMeasurements(userId: string): Promise<BodyMeasurementRow[]> {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Adds a body measurement entry.
   */
  static async addMeasurement(
    measurement: Database['public']['Tables']['body_measurements']['Insert'],
  ) {
    const { data, error } = await supabase
      .from('body_measurements')
      .insert(measurement)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetches strength records.
   */
  static async getStrengthRecords(userId: string): Promise<StrengthRecordRow[]> {
    const { data, error } = await supabase
      .from('strength_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching strength records:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Adds a strength record.
   */
  static async addStrengthRecord(
    record: Database['public']['Tables']['strength_records']['Insert'],
  ) {
    const { data, error } = await supabase
      .from('strength_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetches the user's life history stats.
   */
  static async getLifeHistory(userId: string): Promise<LifeHistoryStatsRow | null> {
    const { data, error } = await supabase
      .from('life_history_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching life history:', error);
      return null;
    }
    return data;
  }
}
