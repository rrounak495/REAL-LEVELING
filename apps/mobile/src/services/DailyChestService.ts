import { repositories } from '@/db/repositories';
import { type Result } from '@/lib/errors';
import { type AddProgressResult } from '@/types/system.types';

export enum ProgressSource {
  DAILY_MISSION = 20,
  WEEKLY_MILESTONE = 10,
  FIRST_ACTIVITY = 15,
  BOSS_GOAL = 20,
  PERSONAL_RECORD = 15,
  COMEBACK_MISSION = 30,
}

export class DailyChestService {
  /**
   * Adds daily progress points and returns the new state.
   * This is idempotent on the DB layer for concurrency, but the client
   * must handle ensuring the *same* mission doesn't repeatedly call this.
   */
  static async addProgress(
    userId: string,
    source: ProgressSource,
  ): Promise<Result<AddProgressResult>> {
    return await repositories.system.addDailyProgress(userId, source);
  }

  /**
   * Claims the daily chest and processes the rewards.
   */
  static async claimChest(userId: string): Promise<Result<boolean>> {
    const claimRes = await repositories.system.claimDailyChest(userId);
    if (!claimRes.success) return claimRes as any;

    // TODO: Connect to RewardService to actually grant the chest rewards.
    // This could vary based on user level. For now we assume success.

    return { success: true, data: true };
  }
}
