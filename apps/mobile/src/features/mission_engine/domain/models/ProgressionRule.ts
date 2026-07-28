import { type ExperienceLevel } from '../enums/MissionEnums';

/**
 * src/features/mission_engine/domain/models/ProgressionRule.ts
 *
 * Defines how a mission scales in difficulty over time based on the user's
 * experience level and current streak/day.
 */
export interface ProgressionRule {
  readonly templateId: string;
  readonly baseValue: number;
  readonly maxCap: number;

  /**
   * Multiplier applied per day/stage.
   * Example: 1.0 = no scaling. 1.1 = 10% increase per day.
   */
  readonly scaleFactor: number;

  /** Step size for increments. E.g., Pushups step by 1, Steps step by 500 */
  readonly incrementStep: number;

  /** Overrides for specific experience levels */
  readonly experienceModifiers: Record<ExperienceLevel, number>;
}
