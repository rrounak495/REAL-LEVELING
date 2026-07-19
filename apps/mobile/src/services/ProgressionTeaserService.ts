import { AvatarEvolutionService } from '@/features/avatar/services/AvatarEvolutionService';
import { getXpRequiredForNextLevel } from '@/store/progression.store';

export interface TeaserInfo {
  type: 'level' | 'evolution' | 'feature';
  title: string;
  description: string;
  progressPct?: number;
}

export class ProgressionTeaserService {
  static getNearestUnlock(currentLevel: number, currentXp: number): TeaserInfo | null {
    // 1. Check for nearest Evolution
    const nextEvoLevel = [10, 25, 50, 75, 100].find((l) => l > currentLevel);
    if (nextEvoLevel && nextEvoLevel - currentLevel <= 5) {
      const xpNeeded = getXpRequiredForNextLevel(currentLevel); // rough estimate
      return {
        type: 'evolution',
        title: `Avatar Evolution at Lvl ${nextEvoLevel}`,
        description: `Only ${nextEvoLevel - currentLevel} levels away from the next tier.`,
      };
    }

    // 2. Feature Unlocks
    if (currentLevel < 10) {
      return {
        type: 'feature',
        title: 'Boss Battles Unlock at Lvl 10',
        description: `Reach Level 10 to participate in World Raids.`,
      };
    }

    // 3. Fallback to next level
    return {
      type: 'level',
      title: 'Next Level Approaching',
      description: 'Keep training to increase your base stats.',
    };
  }
}
