/**
 * src/features/reminder_engine/domain/enums/ReminderEnums.ts
 */

export type ReminderType =
  | 'MISSION_REMINDER'
  | 'GOAL_REMINDER'
  | 'RECOVERY_REMINDER'
  | 'DAILY_SUMMARY'
  | 'WEEKLY_SUMMARY'
  | 'HABIT_REMINDER'
  | 'CUSTOM_REMINDER';

export type ReminderStatus = 'ACTIVE' | 'SNOOZED' | 'DISMISSED' | 'CANCELLED';

export type ScheduleFrequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM_CRON';
