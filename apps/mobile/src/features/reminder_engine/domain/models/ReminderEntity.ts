import { type ReminderType, type ReminderStatus } from '../enums/ReminderEnums';

/**
 * src/features/reminder_engine/domain/models/ReminderEntity.ts
 */
export interface ReminderEntity {
  readonly id: string;
  readonly userId: string;
  readonly type: ReminderType;

  readonly title: string;
  readonly body: string;
  readonly payload?: Record<string, unknown>; // Deep link or action data

  readonly scheduledTime: string; // ISO DateTime
  readonly status: ReminderStatus;

  readonly referenceId?: string; // e.g. missionId or goalId
}
