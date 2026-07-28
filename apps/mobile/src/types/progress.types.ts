/**
 * src/types/progress.types.ts
 *
 * Domain types for Today's Progress section.
 *
 * DESIGN PRINCIPLES:
 * - Extremely minimal structure: label + value.
 * - Architecture only: actual calculation of XP, streak, or completion %
 *   lives in the respective progression or goal stores.
 * - This layer just defines the UI contract.
 */

/**
 * A single progress metric displayed in the 2x2 grid.
 */
export interface ProgressMetric {
  /** Stable identifier for the metric. */
  readonly id: string;
  /**
   * The primary value to display.
   * e.g., "12", "150", "85%".
   * This is pre-formatted as a string to avoid UI logic for rounding/suffixes.
   */
  readonly value: string;
  /**
   * The secondary label explaining the metric.
   * e.g., "Missions", "XP Earned".
   */
  readonly label: string;
}

/**
 * The data payload for Today's Progress section.
 */
export interface DailyProgressData {
  /** The 4 metrics to display in the grid. Must be exactly 4 in UI. */
  readonly metrics: readonly ProgressMetric[];
  /** Optional summary string displayed in the footer. */
  readonly summary?: string;
  /** Optional subtitle for the header. */
  readonly subtitle?: string;
}
