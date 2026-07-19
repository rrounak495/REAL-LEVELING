/**
 * src/features/avatar/services/AvatarEvolutionService.ts
 *
 * Engine responsible for evaluating user level against avatar evolution stages.
 * Automatically unlocks new stages and associated items.
 */
import { repositories } from '@/db/repositories';
import { usePopupStore } from '@/store/popup.store';

export class AvatarEvolutionService {
  /**
   * Evaluates if the user has reached a new evolution stage based on their level.
   * If a new stage is reached, unlocks all items for that stage and queues a popup.
   *
   * This is meant to be called whenever the user levels up.
   */
  static async evaluateEvolution(userId: string, newLevel: number) {
    // 1. Fetch all evolution levels
    const levelsRes = await repositories.avatarEvolution.getEvolutionLevels();
    if (!levelsRes.success) {
      console.error('Failed to fetch evolution levels', levelsRes.error);
      return;
    }

    // Sort descending to find the highest stage the user meets
    const stages = [...levelsRes.data].sort((a, b) => b.level - a.level);
    const currentStage = stages.find((s) => newLevel >= s.level);

    if (!currentStage) return; // User hasn't even hit level 1

    // 2. Fetch the unlocks available at this specific stage
    const unlocksRes = await repositories.avatarUnlock.getAvailableUnlocksForStage(
      currentStage.level,
    );
    if (!unlocksRes.success) {
      console.error('Failed to fetch unlocks for stage', unlocksRes.error);
      return;
    }

    // 3. Check what the user already has unlocked
    const userUnlocksRes = await repositories.avatarUnlock.getUserUnlocks(userId);
    if (!userUnlocksRes.success) {
      console.error('Failed to fetch user unlocks', userUnlocksRes.error);
      return;
    }

    const userUnlockIds = new Set(userUnlocksRes.data.map((u) => u.unlock_id));

    // 4. Grant missing unlocks
    const newlyUnlockedItems = [];
    for (const unlock of unlocksRes.data) {
      if (!userUnlockIds.has(unlock.id)) {
        const grantRes = await repositories.avatarUnlock.grantUnlock(userId, unlock.id);
        if (grantRes.success) {
          newlyUnlockedItems.push(unlock);
        }
      }
    }

    // 5. Trigger Evolution Animations / Popups if new items were granted
    // We queue an "Evolution" popup if the stage itself was just reached
    if (newlyUnlockedItems.length > 0) {
      usePopupStore.getState().enqueue({
        type: 'evolution',
        title: 'Evolution Stage Reached!',
        subtitle: currentStage.stage_name,
        amount: 0,
      });

      // We can also trigger individual toasts for the items
      for (const item of newlyUnlockedItems) {
        // Here we could enqueue smaller toasts, but we'll manage that in the Avatar store
      }
    }
  }
}
