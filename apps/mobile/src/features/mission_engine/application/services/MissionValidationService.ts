import { type IMissionValidationService } from '../../domain/services/IMissionValidationService';
import { type MissionEntity } from '../../domain/models/MissionEntity';

export class MissionValidationService implements IMissionValidationService {
  canEditMission(mission: MissionEntity, edits: Partial<MissionEntity>): boolean {
    if (!mission.isEditable) return false;

    // CORE missions cannot have their targets reduced below base values
    if (mission.type === 'CORE' && edits.targetValue !== undefined) {
      if (edits.targetValue < mission.targetValue) {
        return false;
      }
    }

    return true;
  }

  canCompleteMission(mission: MissionEntity, userValue: number): boolean {
    if (mission.completionMode === 'BOOLEAN') {
      return userValue >= 1; // 1 means true
    }

    if (mission.completionMode === 'QUANTITY' || mission.completionMode === 'TIME') {
      return userValue >= mission.targetValue;
    }

    return false;
  }
}
