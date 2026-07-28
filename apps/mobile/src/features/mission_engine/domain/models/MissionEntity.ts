import {
  type MissionCategory,
  type MissionType,
  type ExperienceLevel,
  type MissionStatus,
  type CompletionMode,
} from '../enums/MissionEnums';

export interface MissionMetadata {
  statGrowth?: string;
  tasks?: { name: string; reps: string; xp: number }[];
  completedTaskIndexes?: number[];

  statType?: string;
  rewardType?: string;
  completionType?: 'manual' | 'auto_sync' | 'ai_verify';
  reminderType?: 'push' | 'silent' | 'none';
  progressType?: 'boolean' | 'numeric' | 'checklist';
  verificationType?: 'none' | 'camera' | 'gps' | 'health_data';
  sourceType?: 'system' | 'custom' | 'coach';
  futureSyncProvider?: 'google_fit' | 'apple_health' | 'health_connect' | 'none';
}

/**
 * src/features/mission_engine/domain/models/MissionEntity.ts
 *
 * Core aggregate root for a Mission in the engine.
 * Represents a personalized, actionable task for the user.
 * Must remain purely domain logic with no database/UI coupling.
 */
export interface MissionEntity {
  readonly id: string;
  readonly userId: string;
  readonly category: MissionCategory;
  readonly type: MissionType;
  readonly difficulty: ExperienceLevel;

  readonly title: string;
  readonly description?: string;

  readonly targetValue: number;
  readonly targetUnit: string;
  readonly completionMode: CompletionMode;

  readonly estimatedTimeMinutes: number;
  readonly xpReward: number;

  readonly status: MissionStatus;
  readonly reminderTime?: string; // ISO time string or cron format
  readonly isEditable: boolean;

  // Future AI-ready flexible schema
  readonly metadata?: MissionMetadata;

  readonly createdAt: string;
  readonly updatedAt: string;
}
