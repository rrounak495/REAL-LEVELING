/**
 * src/features/quests/services/MissionService.ts
 *
 * Orchestrates mission lazy resets and active mission fetching.
 */
import { MissionGenerator, MissionType } from '../engines/MissionGenerator';
import { repositories } from '@/db/repositories';
import { useAuthStore } from '@/store/auth.store';
import { MissionRow } from '@/db/repositories/supabase/MissionRepository';

export class MissionService {
  /**
   * Fetches active missions and performs a lazy reset if necessary.
   * A lazy reset checks if any currently active missions have expired.
   * If all daily missions are expired, it generates a fresh batch.
   */
  static async getAndResetMissions() {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return { daily: [], weekly: [] };

    // Fetch active from DB
    const res = await repositories.missions.getActiveMissions(userId);
    if (!res.success || !res.data) return { daily: [], weekly: [] };

    const now = new Date().toISOString();
    let missions = res.data;

    // Filter valid vs expired
    const activeDaily = missions.filter(
      (m) => m.mission_type === MissionType.DAILY && m.expires_at > now,
    );
    const activeWeekly = missions.filter(
      (m) => m.mission_type === MissionType.WEEKLY && m.expires_at > now,
    );

    const needsNewDailies = activeDaily.length === 0;
    const needsNewWeeklies = activeWeekly.length === 0;

    const newInserts: any[] = [];

    if (needsNewDailies || needsNewWeeklies) {
      let fitnessGoal = 'general_fitness';
      const profileRes = await repositories.profiles.getProfile(userId);
      if (profileRes.success && profileRes.data) {
        fitnessGoal = profileRes.data.fitness_goal || 'general_fitness';
      }

      if (needsNewDailies) {
        const generatedDailies = MissionGenerator.generateDailyMissions(userId, fitnessGoal);
        newInserts.push(...generatedDailies);
      }

      if (needsNewWeeklies) {
        // We could also pass fitnessGoal to weeklies in the future if desired
        const generatedWeeklies = MissionGenerator.generateWeeklyMissions(userId);
        newInserts.push(...generatedWeeklies);
      }
    }

    if (newInserts.length > 0) {
      // Save newly generated to DB
      const upsertRes = await repositories.missions.upsertMissions(newInserts);
      if (upsertRes.success && upsertRes.data) {
        // Merge the new active ones with any existing active ones
        missions = [...activeDaily, ...activeWeekly, ...upsertRes.data];
      }
    } else {
      missions = [...activeDaily, ...activeWeekly];
    }

    return {
      daily: missions.filter((m) => m.mission_type === MissionType.DAILY),
      weekly: missions.filter((m) => m.mission_type === MissionType.WEEKLY),
    };
  }
}
