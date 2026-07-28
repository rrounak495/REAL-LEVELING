import { type ProgressionRule } from '../models/ProgressionRule';
import { type ExperienceLevel } from '../enums/MissionEnums';

/**
 * src/features/mission_engine/domain/services/IMissionProgressionService.ts
 *
 * Contract for scaling mission difficulty dynamically.
 */
export interface IMissionProgressionService {
  /**
   * Calculates the target value for a mission on a given day.
   *
   * Example: Day 1 Pushups = 5. Day 2 = 6.
   *
   * @param rule The progression scaling rule template
   * @param currentDay The user's current day in their journey/streak
   * @param experience The user's experience level for this category
   * @returns The exact target number the user must hit.
   */
  calculateTargetValue(
    rule: ProgressionRule,
    currentDay: number,
    experience: ExperienceLevel,
  ): number;
}
