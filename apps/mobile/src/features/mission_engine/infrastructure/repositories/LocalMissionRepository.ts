import AsyncStorage from '@react-native-async-storage/async-storage';
import { type MissionEntity } from '../../domain/models/MissionEntity';
import { type MissionStatus, type MissionCategory } from '../../domain/enums/MissionEnums';
import { type IMissionRepository } from '../../domain/repositories/IMissionRepository';

const STORAGE_KEY = '@real_leveling_missions';

export class LocalMissionRepository implements IMissionRepository {
  private async getStoredMissions(): Promise<Record<string, MissionEntity[]>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('LocalMissionRepository: Error reading storage', e);
      return {};
    }
  }

  private async saveStoredMissions(data: Record<string, MissionEntity[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('LocalMissionRepository: Error saving storage', e);
    }
  }

  async getMissionById(missionId: string): Promise<MissionEntity | null> {
    const allData = await this.getStoredMissions();
    for (const userId in allData) {
      const userMissions = allData[userId] || [];
      const mission = userMissions.find((m) => m.id === missionId);
      if (mission) return mission;
    }
    return null;
  }

  async getActiveMissions(userId: string): Promise<MissionEntity[]> {
    const allData = await this.getStoredMissions();
    const userMissions = allData[userId] || [];
    return userMissions;
  }

  async getMissionsByCategory(userId: string, category: MissionCategory): Promise<MissionEntity[]> {
    const allData = await this.getStoredMissions();
    const userMissions = allData[userId] || [];
    return userMissions.filter((m) => m.category === category);
  }

  async getMissionsByStatus(userId: string, status: MissionStatus): Promise<MissionEntity[]> {
    const allData = await this.getStoredMissions();
    const userMissions = allData[userId] || [];
    return userMissions.filter((m) => m.status === status);
  }

  async saveMissions(missions: MissionEntity[]): Promise<void> {
    if (missions.length === 0) return;
    const userId = missions[0]?.userId;
    if (!userId) return;
    const allData = await this.getStoredMissions();
    const userMissions = allData[userId] || [];

    const existingIds = new Set(userMissions.map((m) => m.id));
    const newMissions = missions.filter((m) => !existingIds.has(m.id));

    allData[userId] = [...userMissions, ...newMissions];
    await this.saveStoredMissions(allData);
  }

  async updateMission(mission: MissionEntity): Promise<void> {
    const allData = await this.getStoredMissions();
    const userMissions = allData[mission.userId] || [];
    const index = userMissions.findIndex((m) => m.id === mission.id);

    if (index !== -1) {
      userMissions[index] = mission;
      allData[mission.userId] = userMissions;
      await this.saveStoredMissions(allData);
    }
  }

  async updateMissions(missions: MissionEntity[]): Promise<void> {
    if (missions.length === 0) return;
    const userId = missions[0]?.userId;
    if (!userId) return;
    const allData = await this.getStoredMissions();
    const userMissions = allData[userId] || [];

    missions.forEach((updatedMission) => {
      const index = userMissions.findIndex((m) => m.id === updatedMission.id);
      if (index !== -1) {
        userMissions[index] = updatedMission;
      }
    });

    allData[userId] = userMissions;
    await this.saveStoredMissions(allData);
  }
}
