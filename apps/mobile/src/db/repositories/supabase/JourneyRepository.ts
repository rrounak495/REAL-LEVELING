import { type Database } from '@/types/database.types';
import { type SupabaseClient } from '@supabase/supabase-js';

export type UserJourneyRow = Database['public']['Tables']['user_journeys']['Row'];
export type UserJourneyInsert = Database['public']['Tables']['user_journeys']['Insert'];
export type UserJourneyUpdate = Database['public']['Tables']['user_journeys']['Update'];

export type UserJourneyDayRow = Database['public']['Tables']['user_journey_days']['Row'];
export type UserJourneyDayInsert = Database['public']['Tables']['user_journey_days']['Insert'];
export type UserJourneyDayUpdate = Database['public']['Tables']['user_journey_days']['Update'];

export class JourneyRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getActiveJourney(userId: string) {
    const { data, error } = await this.supabase
      .from('user_journeys')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('[JourneyRepository] Failed to get active journey:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  async getJourneyDays(journeyId: string) {
    const { data, error } = await this.supabase
      .from('user_journey_days')
      .select('*')
      .eq('journey_id', journeyId)
      .order('day_number', { ascending: true });

    if (error) {
      console.error('[JourneyRepository] Failed to get journey days:', error);
      return { success: false, error };
    }
    return { success: true, data };
  }

  async createJourney(journey: UserJourneyInsert, days: UserJourneyDayInsert[]) {
    // We insert the journey, then the days.
    // In a real production system, this would be an RPC call for atomicity,
    // but for the MVP we will do two sequential inserts.
    const { data: journeyData, error: journeyError } = await this.supabase
      .from('user_journeys')
      .insert(journey)
      .select()
      .single();

    if (journeyError || !journeyData) {
      console.error('[JourneyRepository] Failed to create journey:', journeyError);
      return { success: false, error: journeyError };
    }

    // Attach the journey ID to the days
    const daysWithId = days.map((d) => ({ ...d, journey_id: journeyData.id }));

    const { data: daysData, error: daysError } = await this.supabase
      .from('user_journey_days')
      .insert(daysWithId)
      .select();

    if (daysError) {
      console.error('[JourneyRepository] Failed to create journey days:', daysError);
      // Rollback isn't automatic without RPC, but we return error for now
      return { success: false, error: daysError };
    }

    return { success: true, data: { journey: journeyData, days: daysData } };
  }

  async updateJourney(journeyId: string, updates: UserJourneyUpdate) {
    const { data, error } = await this.supabase
      .from('user_journeys')
      .update(updates)
      .eq('id', journeyId)
      .select()
      .single();

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
  }

  async updateJourneyDay(dayId: string, updates: UserJourneyDayUpdate) {
    const { data, error } = await this.supabase
      .from('user_journey_days')
      .update(updates)
      .eq('id', dayId)
      .select()
      .single();

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
  }
}
