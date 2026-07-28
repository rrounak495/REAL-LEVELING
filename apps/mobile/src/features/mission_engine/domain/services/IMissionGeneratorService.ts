import { type MissionEntity } from '../models/MissionEntity';
import { type ExperienceLevel, type MissionCategory } from '../enums/MissionEnums';

/**
 * src/features/mission_engine/domain/services/IMissionGeneratorService.ts
 *
 * Context required to generate personalized missions for a user.
 */
export interface GenerationContext {
  readonly userId: string;
  readonly experienceLevel: ExperienceLevel;
  readonly focusCategories: MissionCategory[];
  readonly currentChapterId?: string;
  readonly currentDay: number;
  readonly activeStreak: number;
}

/**
 * Contract for generating daily missions based on context.
 */
export interface IMissionGeneratorService {
  /**
   * Generates a fresh batch of missions tailored to the user's current context.
   */
  generateDailyMissions(context: GenerationContext): Promise<MissionEntity[]>;

  /**
   * Generates a single replacement mission (e.g. if user skips one).
   */
  generateReplacementMission(
    context: GenerationContext,
    skippedMissionId: string,
  ): Promise<MissionEntity>;
}
