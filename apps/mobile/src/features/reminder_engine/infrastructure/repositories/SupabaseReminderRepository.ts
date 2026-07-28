import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type IReminderRepository } from '../../domain/repositories/IReminderRepository';
import { type ReminderEntity } from '../../domain/models/ReminderEntity';
import { type ReminderSchedule } from '../../domain/models/ReminderSchedule';
import { mapError } from '../../../../lib/errors';

/**
 * src/features/reminder_engine/infrastructure/repositories/SupabaseReminderRepository.ts
 */
export class SupabaseReminderRepository implements IReminderRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getPendingReminders(userId: string): Promise<ReminderEntity[]> {
    // Requires a notifications or reminders table. Mocking for now as table doesn't exist yet.
    return [];
  }

  async saveReminder(reminder: ReminderEntity): Promise<void> {
    // Stub
  }

  async updateReminderStatus(reminderId: string, status: string): Promise<void> {
    // Stub
  }

  async getUserSchedule(userId: string): Promise<ReminderSchedule | null> {
    try {
      const { data, error } = await this.supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        scheduleId: userId,
        userId: data.user_id,
        frequency: 'DAILY',
        timezone: 'UTC', // Defaulting as not present in DB
        quietHoursStart: data.quiet_hours_start || '22:00',
        quietHoursEnd: data.quiet_hours_end || '08:00',
        isActive: true,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch user reminder schedule');
    }
  }

  async saveUserSchedule(schedule: ReminderSchedule): Promise<void> {
    try {
      const { error } = await this.supabase.from('notification_preferences').upsert({
        user_id: schedule.userId,
        quiet_hours_start: schedule.quietHoursStart,
        quiet_hours_end: schedule.quietHoursEnd,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save user reminder schedule');
    }
  }
}
