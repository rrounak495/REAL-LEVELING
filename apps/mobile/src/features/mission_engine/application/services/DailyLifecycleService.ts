import AsyncStorage from '@react-native-async-storage/async-storage';
import { type IDailyLifecycleService } from '../../domain/services/IDailyLifecycleService';
import { type IMissionRepository } from '../../domain/repositories/IMissionRepository';

export class DailyLifecycleService implements IDailyLifecycleService {
  constructor(private readonly missionRepo: IMissionRepository) {}

  private getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async processDailyReset(userId: string): Promise<boolean> {
    const storageKey = `@real_leveling_last_reset_${userId}`;

    try {
      const todayString = this.getTodayDateString();
      const lastResetStr = await AsyncStorage.getItem(storageKey);

      if (lastResetStr === todayString) {
        // Already reset today, skip
        console.log(
          `[DailyLifecycleEngine] Reset skipped for ${userId} (Already reset today: ${todayString})`,
        );
        return false;
      }

      console.log(
        `[DailyLifecycleEngine] Reset started for ${userId} (Last: ${lastResetStr}, Today: ${todayString})`,
      );

      const activeMissions = await this.missionRepo.getActiveMissions(userId);

      const updatedMissions = activeMissions.map((mission) => {
        // Only reset Foundation Daily Missions
        if (mission.id.startsWith('foundation_')) {
          const resetMission = {
            ...mission,
            status: 'NOT_STARTED' as any, // Need to match Domain status.
            updatedAt: new Date().toISOString(),
          };

          // Type-specific resets
          if (mission.id === 'foundation_gym') {
            resetMission.metadata = {
              ...(mission.metadata || {}),
              completedTaskIndexes: [],
            };
          } else if (mission.id === 'foundation_walking') {
            (resetMission as any).currentValue = 0;
          }

          return resetMission;
        }

        // For non-foundation, we just return them unchanged (though we might handle other recurring quests in the future)
        return mission;
      });

      // Filter only those that were actually changed to avoid unnecessary writes
      // But for safety and simplicity right now, update all active missions since we map them
      // We will optimize this by only capturing mutated ones
      const mutatedMissions = updatedMissions.filter((um, index) => {
        const original = activeMissions[index];
        return um !== original; // Works because we spread {...mission} only if it matched our criteria
      });

      if (mutatedMissions.length > 0) {
        await this.missionRepo.updateMissions(mutatedMissions);
      }

      await AsyncStorage.setItem(storageKey, todayString);
      console.log(
        `[DailyLifecycleEngine] Reset completed for ${userId}. ${mutatedMissions.length} missions reset.`,
      );

      return true;
    } catch (error) {
      console.error(`[DailyLifecycleEngine] Reset failed for ${userId}:`, error);
      // In a real app we might retry later or throw
      return false;
    }
  }
}
