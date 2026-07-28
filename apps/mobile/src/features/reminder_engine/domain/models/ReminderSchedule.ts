import { type ScheduleFrequency } from '../enums/ReminderEnums';

/**
 * src/features/reminder_engine/domain/models/ReminderSchedule.ts
 *
 * Defines recurring schedules and timezone awareness.
 */
export interface ReminderSchedule {
  readonly scheduleId: string;
  readonly userId: string;
  readonly frequency: ScheduleFrequency;

  readonly cronExpression?: string;
  readonly timeOfDay?: string; // HH:mm format
  readonly timezone: string; // e.g., 'America/New_York'

  readonly quietHoursStart: string; // HH:mm
  readonly quietHoursEnd: string; // HH:mm

  readonly isActive: boolean;
}
