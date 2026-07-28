/**
 * src/types/goal.types.ts
 *
 * Domain types for the REAL LEVELING Goal System.
 *
 * DESIGN PRINCIPLES:
 * - One active goal per user at a time (core product philosophy).
 * - Types are future-proof — changing a goal after progress has started
 *   is supported by the EditGoalPayload architecture.
 * - No business logic, no UI, no backend calls live here.
 * - All interfaces are TypeScript strict compatible (no `any`).
 */

// ── Goal Category ─────────────────────────────────────────────────────────────

/**
 * The category a goal belongs to.
 * Used for filtering, analytics, and future category-specific UI treatment.
 * New categories can be added as variants without breaking existing data.
 */
export type GoalCategory =
  | 'fitness' // Physical training, workouts
  | 'nutrition' // Diet, eating habits
  | 'mental' // Meditation, focus, discipline
  | 'skill' // Learning a new ability
  | 'lifestyle' // Sleep, hydration, habits
  | 'custom'; // User-defined, no category constraint

// ── Goal Duration ─────────────────────────────────────────────────────────────

/**
 * Supported challenge durations in days.
 * Defined as a union of literals so the UI can offer a fixed picker
 * while remaining extensible for future durations.
 */
export type GoalDuration = 7 | 14 | 21 | 30 | 60 | 90;

// ── Goal Status ───────────────────────────────────────────────────────────────

/**
 * Lifecycle status of a goal.
 *
 * 'draft'      — Created but not yet started (start date in the future).
 * 'active'     — Currently in progress.
 * 'completed'  — All challenge days finished successfully.
 * 'abandoned'  — User explicitly stopped before completion.
 */
export type GoalStatus = 'draft' | 'active' | 'completed' | 'abandoned';

// ── Goal ─────────────────────────────────────────────────────────────────────

/**
 * A single user goal.
 * Only one goal may be 'active' at a time — enforced by the goal store.
 *
 * When a user changes their active goal, the previous goal is transitioned
 * to 'abandoned' and a new Goal record is created.
 * This preserves full history without mutating past records.
 */
export interface Goal {
  /** Stable unique identifier. */
  readonly id: string;
  /** The user's primary goal statement. Displayed prominently on the Home screen. */
  readonly title: string;
  /** Optional elaboration. Not required. Collapses in UI when absent. */
  readonly description?: string;
  /** Category this goal belongs to. */
  readonly category: GoalCategory;
  /** Total number of challenge days for this goal. */
  readonly durationDays: GoalDuration;
  /** ISO timestamp of the day the challenge started. Null if draft. */
  readonly startDate: string | null;
  /** Current lifecycle status. */
  readonly status: GoalStatus;
  /** ISO timestamp of when this goal record was created. */
  readonly createdAt: string;
  /** ISO timestamp of the last modification to this record. */
  readonly updatedAt: string;
}

// ── Goal Progress ────────────────────────────────────────────────────────

/**
 * Snapshot of a user's progress within their active goal.
 */
export interface GoalProgress {
  /** The day number the user is currently on (1-indexed). */
  readonly currentDay: number;
  /** Number of challenge days the user has marked as completed. */
  readonly completedDays: number;
  /** Completion percentage (0–100). Derived — do not store independently. */
  readonly percentComplete: number;
  /** Optional motivational status message. Overrides the default if provided. */
  readonly statusMessage?: string;
}

// ── Edit Goal Payload ─────────────────────────────────────────────────────────

/**
 * Payload submitted when the user creates or edits a goal.
 *
 * Used by:
 * - Future Edit Goal Bottom Sheet (submits this payload on Save)
 * - `onConfirmGoalChange` callback on GoalCard (validates before applying)
 *
 * All fields are required on create. On edit, the store merges this into
 * the existing Goal record and bumps `updatedAt`.
 */
export interface EditGoalPayload {
  /** The goal's primary title. */
  readonly title: string;
  /** Optional description. Pass undefined to clear. */
  readonly description?: string;
  /** Category for the goal. */
  readonly category: GoalCategory;
  /** Duration of the challenge in days. */
  readonly durationDays: GoalDuration;
  /** ISO timestamp of the desired start date. Null = start today. */
  readonly startDate: string | null;
}
