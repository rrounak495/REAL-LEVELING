import { type ReminderEntity } from '../models/ReminderEntity';

/**
 * src/features/reminder_engine/domain/services/IReminderServices.ts
 */
export interface IReminderService {
  scheduleReminder(entity: Omit<ReminderEntity, 'id' | 'status'>): Promise<ReminderEntity>;
  cancelReminder(reminderId: string): Promise<void>;

  processDailySchedules(): Promise<void>; // Background worker logic
}

/**
 * Platform-agnostic contract for actual push notification delivery.
 */
export interface INotificationContract {
  scheduleLocalNotification(reminder: ReminderEntity): Promise<string>;
  cancelLocalNotification(notificationId: string): Promise<void>;
  requestPermissions(): Promise<boolean>;
}
