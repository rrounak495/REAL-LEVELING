import { type MissionEntity } from '../models/MissionEntity';

import { type ProgressionResult } from '../../../progression_engine/domain/services/IHunterProgressionService';

/**
 * Represents the result of a mission lifecycle transition.
 */
export interface MissionResult {
  readonly mission: MissionEntity;
  readonly xpEarned: number;
  readonly isStreakMaintained: boolean;
  readonly progression?: ProgressionResult;
}

/**
 * src/features/mission_engine/domain/services/IMissionCompletionService.ts
 *
 * Contract for handling the lifecycle transitions of a mission.
 */
export interface IMissionCompletionService {
  /**
   * Marks a mission as completed, awarding XP.
   */
  completeMission(missionId: string, actualValue: number): Promise<MissionResult>;

  /**
   * Starts a mission, placing it in IN_PROGRESS state.
   */
  startMission(missionId: string): Promise<MissionEntity>;

  /**
   * Pauses an active mission.
   */
  pauseMission(missionId: string): Promise<MissionEntity>;

  /**
   * Resumes a paused mission.
   */
  resumeMission(missionId: string): Promise<MissionEntity>;

  /**
   * Marks a mission as failed (e.g. end of day reached without completion).
   */
  failMission(missionId: string): Promise<MissionResult>;

  /**
   * Marks a mission as skipped by the user.
   */
  skipMission(missionId: string): Promise<MissionResult>;

  /**
   * Updates partial progress or metadata without completing the mission.
   */
  updateMissionProgress(
    missionId: string,
    metadataUpdates: Record<string, any>,
    currentValue?: number,
  ): Promise<MissionEntity>;
}
