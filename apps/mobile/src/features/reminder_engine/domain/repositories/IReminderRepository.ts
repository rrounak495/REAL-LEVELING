import { type ReminderEntity } from '../models/ReminderEntity';
import { type ReminderSchedule } from '../models/ReminderSchedule';

/**
 * src/features/reminder_engine/domain/repositories/IReminderRepository.ts
 */
export interface IReminderRepository {
  getPendingReminders(userId: string): Promise<ReminderEntity[]>;
  saveReminder(reminder: ReminderEntity): Promise<void>;
  updateReminderStatus(reminderId: string, status: string): Promise<void>;

  getUserSchedule(userId: string): Promise<ReminderSchedule | null>;
  saveUserSchedule(schedule: ReminderSchedule): Promise<void>;
}
