import * as Crypto from 'expo-crypto';
import { type IReminderService } from '../../domain/services/IReminderServices';
import { type IReminderRepository } from '../../domain/repositories/IReminderRepository';
import { type ReminderEntity } from '../../domain/models/ReminderEntity';

export class ReminderService implements IReminderService {
  constructor(private readonly reminderRepo: IReminderRepository) {}

  async scheduleReminder(entity: Omit<ReminderEntity, 'id' | 'status'>): Promise<ReminderEntity> {
    const schedule = await this.reminderRepo.getUserSchedule(entity.userId);

    // If schedule exists, check quiet hours
    if (schedule && schedule.isActive) {
      const scheduledTime = new Date(entity.scheduledTime);
      const hours = scheduledTime.getUTCHours().toString().padStart(2, '0');
      const minutes = scheduledTime.getUTCMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      if (timeString >= schedule.quietHoursStart && timeString <= schedule.quietHoursEnd) {
        // Adjust time to be outside quiet hours (e.g. right after quiet hours end)
        // For simplicity in this logic-only engine, we'll just throw or adjust.
        // Let's adjust to quietHoursEnd + 1 minute.
        const parts = schedule.quietHoursEnd.split(':').map(Number);
        const endHour = parts[0] ?? 0;
        const endMinute = parts[1] ?? 0;
        scheduledTime.setUTCHours(endHour, endMinute + 1, 0, 0);
        // Note: Real timezone handling would require Date-fns-tz or similar.
      }
    }

    const newReminder: ReminderEntity = {
      ...entity,
      id: Crypto.randomUUID(),
      status: 'ACTIVE',
    };

    await this.reminderRepo.saveReminder(newReminder);
    return newReminder;
  }

  async cancelReminder(reminderId: string): Promise<void> {
    await this.reminderRepo.updateReminderStatus(reminderId, 'CANCELLED');
  }

  async processDailySchedules(): Promise<void> {
    // In a real backend, this would fetch all active schedules, generate
    // daily summary reminders, and push them to the DB.
    // For local logic, we just stub it as requested (logic only, no APIs).
    return Promise.resolve();
  }
}
