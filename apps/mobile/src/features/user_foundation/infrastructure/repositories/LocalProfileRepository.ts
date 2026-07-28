import AsyncStorage from '@react-native-async-storage/async-storage';
import { type UserProfile, type UserPreferences } from '../../domain/models/UserProfile';
import { type IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';

const STORAGE_KEY_PROFILES = '@real_leveling_profiles';
const STORAGE_KEY_PREFS = '@real_leveling_prefs';

export class LocalProfileRepository implements IUserProfileRepository {
  private async getStoredData<T>(key: string): Promise<Record<string, T>> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error(`LocalProfileRepository: Error reading ${key}`, e);
      return {};
    }
  }

  private async saveStoredData<T>(key: string, data: Record<string, T>): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`LocalProfileRepository: Error saving ${key}`, e);
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const profiles = await this.getStoredData<UserProfile>(STORAGE_KEY_PROFILES);
    return profiles[userId] || null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    const profiles = await this.getStoredData<UserProfile>(STORAGE_KEY_PROFILES);
    profiles[profile.id] = profile;
    await this.saveStoredData(STORAGE_KEY_PROFILES, profiles);
  }

  async updateOnboardingStatus(userId: string, status: string): Promise<void> {
    const profiles = await this.getStoredData<UserProfile>(STORAGE_KEY_PROFILES);
    if (profiles[userId]) {
      profiles[userId] = { ...profiles[userId], onboardingStatus: status as any };
      await this.saveStoredData(STORAGE_KEY_PROFILES, profiles);
    }
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const prefs = await this.getStoredData<UserPreferences>(STORAGE_KEY_PREFS);
    return prefs[userId] || null;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    const prefs = await this.getStoredData<UserPreferences>(STORAGE_KEY_PREFS);
    prefs[preferences.userId] = preferences;
    await this.saveStoredData(STORAGE_KEY_PREFS, prefs);
  }
}
