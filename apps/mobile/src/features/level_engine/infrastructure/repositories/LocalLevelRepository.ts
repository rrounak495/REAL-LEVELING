import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ILevelRepository } from '../../domain/repositories/ILevelRepository';

export class LocalLevelRepository implements ILevelRepository {
  async getUserProgress(userId: string): Promise<any | null> {
    const data = await AsyncStorage.getItem('@real_leveling_level_progress');
    const parsed = data ? JSON.parse(data) : {};
    return parsed[userId] || { currentLevel: 1, currentXp: 0, totalLifetimeXp: 0 };
  }

  async getLevelDefinition(level: number): Promise<any | null> {
    return { level, xpRequired: level * 1000, title: `Level ${level}` };
  }

  async getAllLevelDefinitions(): Promise<any[]> {
    return [];
  }

  async saveUserProgress(progress: any): Promise<void> {
    const data = await AsyncStorage.getItem('@real_leveling_level_progress');
    const parsed = data ? JSON.parse(data) : {};
    parsed[progress.userId] = progress;
    await AsyncStorage.setItem('@real_leveling_level_progress', JSON.stringify(parsed));
  }
}
