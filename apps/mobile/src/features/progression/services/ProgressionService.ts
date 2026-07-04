/**
 * src/features/progression/services/ProgressionService.ts
 *
 * Orchestrates progression logic, state management, and offline-sync.
 */
import { XPEngine, type ProgressionState } from '../engines/XPEngine';
import { type Rank } from '../engines/RankEngine';
import { useProgressionStore } from '@/store/progression.store';
import { repositories } from '@/db/repositories';
import { useAuthStore } from '@/store/auth.store';

export class ProgressionService {
  /**
   * Grants XP to the user, updates local state, and syncs to Supabase.
   *
   * @param baseAmount The raw XP amount to grant.
   * @param multipliers Optional multipliers to apply (e.g., [1.2] for 20% bonus).
   * @returns The events that occurred (e.g., leveled up, ranked up).
   */
  static async grantXp(baseAmount: number, multipliers: number[] = [1]) {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn('[ProgressionService] Cannot grant XP: No user logged in.');
      return null;
    }

    // 1. Read current local state
    const { xp: currentXp, level, rank } = useProgressionStore.getState();

    const currentState: ProgressionState = {
      totalXp: currentXp,
      level,
      rank: rank as Rank,
    };

    // 2. Calculate new state via pure math engine
    const result = XPEngine.addXp(currentState, baseAmount, multipliers);

    // 3. Update local state immediately (Optimistic Update)
    useProgressionStore.getState().setProgression({
      xp: result.newState.totalXp,
      level: result.newState.level,
      rank: result.newState.rank,
    });

    // 4. Sync to remote database (Fire and forget, or await)
    try {
      await repositories.profiles.updateProfile(userId, {
        xp: result.newState.totalXp,
        level: result.newState.level,
        rank: result.newState.rank,
      });
    } catch (e) {
      console.error('[ProgressionService] Failed to sync XP to remote database', e);
      // In a fully offline-first app, we would queue this mutation.
    }

    // 5. Return the events for UI orchestration (e.g., trigger Level Up Modal)
    return {
      leveledUp: result.leveledUp,
      rankedUp: result.rankedUp,
      levelsGained: result.levelsGained,
      newLevel: result.newState.level,
      newRank: result.newState.rank,
    };
  }

  /**
   * Grants currency (Coins or Gems) and syncs to Supabase.
   */
  static async grantCurrency(type: 'coins' | 'gems', amount: number) {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const store = useProgressionStore.getState();
    const newAmount = store[type] + amount;

    // Optimistic UI update
    if (type === 'coins') {
      store.addCoins(amount);
    } else {
      store.addGems(amount);
    }

    // Remote sync
    try {
      await repositories.profiles.updateProfile(userId, {
        [type]: newAmount,
      });
    } catch (e) {
      console.error(`[ProgressionService] Failed to sync ${type} to remote database`, e);
    }
  }
}
