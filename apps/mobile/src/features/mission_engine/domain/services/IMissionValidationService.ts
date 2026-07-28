import { type MissionEntity } from '../models/MissionEntity';

/**
 * src/features/mission_engine/domain/services/IMissionValidationService.ts
 *
 * Contract for validating user actions on missions.
 */
export interface IMissionValidationService {
  /**
   * Validates if the proposed edits to a mission are allowed.
   * e.g., Cannot change a 'CORE' mission's target value below the base requirement.
   */
  canEditMission(mission: MissionEntity, edits: Partial<MissionEntity>): boolean;

  /**
   * Validates if the user's reported value meets the completion criteria.
   * e.g., if target is 50, and userValue is 50 -> true.
   */
  canCompleteMission(mission: MissionEntity, userValue: number): boolean;
}
