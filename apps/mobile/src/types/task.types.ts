/**
 * types/task.types.ts — Custom Task Data Model
 *
 * Sprint 3: Custom Task System
 * Single source of truth for all custom task types.
 */

/** Repeat frequency for custom tasks */
export type TaskRepeat = 'once' | 'daily' | 'weekdays';

/** Time slot for custom tasks */
export type TaskTimeSlot = 'morning' | 'afternoon' | 'evening' | 'custom';

/** XP values mapped to repeat frequency — easily configurable */
export const TASK_XP_MAP: Record<TaskRepeat, number> = {
  once: 20,
  daily: 15,
  weekdays: 18,
} as const;

/** Core custom task entity */
export interface CustomTask {
  /** Unique identifier (auto-generated) */
  id: string;
  /** Task title (trimmed, non-empty) */
  title: string;
  /** Time slot or custom time string */
  timeSlot: TaskTimeSlot;
  /** Custom time value (e.g. "7:30 pm") — only set when timeSlot is 'custom' */
  customTime?: string | undefined;
  /** Repeat frequency */
  repeat: TaskRepeat;
  /** XP reward (auto-calculated from repeat) */
  xp: number;
  /** Whether the task is completed */
  completed: boolean;
  /** ISO timestamp of completion */
  completedAt?: string | undefined;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
}

/** Fields required to create a new task */
export interface CreateTaskInput {
  title: string;
  timeSlot: TaskTimeSlot;
  customTime?: string | undefined;
  repeat: TaskRepeat;
}

/** Fields allowed when editing a task */
export interface UpdateTaskInput {
  title?: string;
  timeSlot?: TaskTimeSlot;
  customTime?: string | undefined;
  repeat?: TaskRepeat;
}

// ── FUTURE EXTENSION POINTS (Sprint 7) ──────────────────────────────────────

/**
 * Extension for Backend Sync (Supabase)
 * Used for online backup, multi-device, and offline-first queue resolution.
 */
export interface SyncMetadata {
  /** If false, needs syncing to cloud */
  isSynced: boolean;
  /** Server-issued ID */
  serverId?: string;
  /** Conflict resolution timestamp */
  lastSyncedAt?: string;
}

/**
 * Extension for AI Task Generation
 * Used to let the AI dynamically suggest and adjust task difficulty.
 */
export interface AITaskContext {
  isAiGenerated: boolean;
  aiConfidenceScore?: number;
  aiSuggestedDifficulty?: 'easy' | 'normal' | 'hard';
}

/**
 * Extension for Boss Battles & RPG Mechanics
 * Used when tasks deal damage to a daily boss instead of just giving XP.
 */
export interface RPGCombatMetadata {
  dealsDamage: boolean;
  damageAmount?: number;
  elementalType?: 'strength' | 'intelligence' | 'endurance';
}
