import { type LevelEntity, type LevelProgress } from '../models/LevelEntity';

/**
 * src/features/level_engine/domain/repositories/ILevelRepository.ts
 */
export interface ILevelRepository {
  getLevelDefinition(levelNumber: number): Promise<LevelEntity | null>;
  getAllLevelDefinitions(): Promise<LevelEntity[]>;

  getUserProgress(userId: string): Promise<LevelProgress | null>;
  saveUserProgress(progress: LevelProgress): Promise<void>;
}
