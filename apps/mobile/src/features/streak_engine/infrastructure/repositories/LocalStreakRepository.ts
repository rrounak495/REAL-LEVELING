import AsyncStorage from '@react-native-async-storage/async-storage';
import { type IStreakRepository } from '../../domain/repositories/IStreakRepository';

export class LocalStreakRepository implements IStreakRepository {
  async getStreak(userId: string): Promise<any | null> {
    const data = await AsyncStorage.getItem('@real_leveling_streak');
    const parsed = data ? JSON.parse(data) : {};
    return parsed[userId] || { currentDailyStreak: 0, longestDailyStreak: 0 };
  }

  async saveStreak(streak: any): Promise<void> {
    const data = await AsyncStorage.getItem('@real_leveling_streak');
    const parsed = data ? JSON.parse(data) : {};
    parsed[streak.userId] = streak;
    await AsyncStorage.setItem('@real_leveling_streak', JSON.stringify(parsed));
  }

  async getMomentum(userId: string): Promise<any | null> {
    return null;
  }

  async saveMomentum(momentum: any): Promise<void> {}
}
