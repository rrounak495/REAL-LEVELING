import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type IHunterProgressionService,
  type ProgressionResult,
} from '../../domain/services/IHunterProgressionService';
import { type ILevelRepository } from '../../../level_engine/domain/repositories/ILevelRepository';
import { type LevelProgress } from '../../../level_engine/domain/models/LevelEntity';

export class HunterProgressionService implements IHunterProgressionService {
  constructor(private readonly levelRepo: ILevelRepository) {}

  private getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculateXpRequired(level: number): number {
    // Infinite scaling formula: BASE * (1.2 ^ (level - 1))
    // e.g., L1->L2 = 1000, L2->L3 = 1200, L3->L4 = 1440...
    const base = 1000;
    return Math.floor(base * Math.pow(1.2, level - 1));
  }

  async processMissionCompletion(
    userId: string,
    missionId: string,
    xpReward: number,
  ): Promise<ProgressionResult> {
    const today = this.getTodayDateString();
    const idempotencyKey = `@real_leveling_xp_${userId}_${missionId}_${today}`;

    // 1. Duplicate Reward Protection
    const alreadyGranted = await AsyncStorage.getItem(idempotencyKey);

    let progress = await this.levelRepo.getUserProgress(userId);
    if (!progress) {
      progress = {
        userId,
        currentLevel: 1,
        currentXp: 0,
        totalLifetimeXp: 0,
        xpRequiredForNext: this.calculateXpRequired(1),
        isMaxLevel: false,
      };
    }

    if (alreadyGranted === 'true') {
      console.log(`[HunterProgression] Blocked duplicate XP for mission ${missionId} today.`);
      return {
        leveledUp: false,
        levelsGained: 0,
        oldLevel: progress.currentLevel,
        newLevel: progress.currentLevel,
        currentXp: progress.currentXp,
        lifetimeXp: progress.totalLifetimeXp,
        xpRequiredForNext: progress.xpRequiredForNext,
        duplicate: true,
      };
    }

    // 2. Grant XP & Handle Overflow
    let { currentLevel, currentXp, totalLifetimeXp, xpRequiredForNext } = progress;
    const oldLevel = currentLevel;

    currentXp += xpReward;
    // ensure totalLifetimeXp is a number if it was missing from older schema
    totalLifetimeXp = (totalLifetimeXp || 0) + xpReward;

    let leveledUp = false;
    let levelsGained = 0;

    // Loop handles massive XP grants triggering multiple level-ups
    while (currentXp >= xpRequiredForNext) {
      currentXp -= xpRequiredForNext; // Preserve overflow
      currentLevel += 1;
      levelsGained += 1;
      leveledUp = true;
      xpRequiredForNext = this.calculateXpRequired(currentLevel);
    }

    const newProgress: LevelProgress = {
      userId,
      currentLevel,
      currentXp,
      totalLifetimeXp,
      xpRequiredForNext,
      isMaxLevel: false, // Infinite system
    };

    // 3. Persist Progression & Idempotency
    await this.levelRepo.saveUserProgress(newProgress);
    await AsyncStorage.setItem(idempotencyKey, 'true');

    if (leveledUp) {
      console.log(`[HunterProgression] Level Up! ${userId} reached Level ${currentLevel}.`);
    }

    return {
      leveledUp,
      levelsGained,
      oldLevel,
      newLevel: currentLevel,
      currentXp,
      lifetimeXp: totalLifetimeXp,
      xpRequiredForNext,
      duplicate: false,
    };
  }
}
