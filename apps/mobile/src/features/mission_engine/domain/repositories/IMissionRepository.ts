import { type MissionEntity } from '../models/MissionEntity';
import { type MissionStatus, type MissionCategory } from '../enums/MissionEnums';

/**
 * src/features/mission_engine/domain/repositories/IMissionRepository.ts
 *
 * Defines the contract for mission data persistence.
 * Implementations will map this to Supabase, local MMKV, or mock storage.
 */
export interface IMissionRepository {
  /** Fetch a mission by its unique ID */
  getMissionById(missionId: string): Promise<MissionEntity | null>;

  /** Fetch all active missions for a user */
  getActiveMissions(userId: string): Promise<MissionEntity[]>;

  /** Fetch missions by category */
  getMissionsByCategory(userId: string, category: MissionCategory): Promise<MissionEntity[]>;

  /** Fetch missions by status */
  getMissionsByStatus(userId: string, status: MissionStatus): Promise<MissionEntity[]>;

  /** Save a newly generated set of missions */
  saveMissions(missions: MissionEntity[]): Promise<void>;

  /** Update an existing mission (e.g. status change, edit target) */
  updateMission(mission: MissionEntity): Promise<void>;

  /** Bulk update missions (e.g. end of day processing) */
  updateMissions(missions: MissionEntity[]): Promise<void>;
}
