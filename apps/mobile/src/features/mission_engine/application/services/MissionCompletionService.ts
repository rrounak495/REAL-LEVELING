import {
  type IMissionCompletionService,
  type MissionResult,
} from '../../domain/services/IMissionCompletionService';
import { type MissionEntity } from '../../domain/models/MissionEntity';
import { type IMissionRepository } from '../../domain/repositories/IMissionRepository';
import { type IMissionValidationService } from '../../domain/services/IMissionValidationService';
import { type IStreakService } from '../../../streak_engine/domain/services/IStreakServices';
import { type IHunterProgressionService } from '../../../progression_engine/domain/services/IHunterProgressionService';
import { AppError } from '../../../../lib/errors';
import { AnalyticsService } from '../../../../services/AnalyticsService';

import { type IAchievementService } from '../../../achievement_engine/domain/services/IAchievementServices';

export class MissionCompletionService implements IMissionCompletionService {
  constructor(
    private readonly missionRepo: IMissionRepository,
    private readonly validationService: IMissionValidationService,
    private readonly progressionService: IHunterProgressionService,
    private readonly streakService: IStreakService,
    private readonly achievementService: IAchievementService,
  ) {}

  async completeMission(missionId: string, actualValue: number): Promise<MissionResult> {
    console.log('[DEBUG-MCS] completeMission started for:', missionId, 'value:', actualValue);
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    console.log('[DEBUG-MCS] mission found:', mission.id, mission.status);

    if (mission.status !== 'IN_PROGRESS' && mission.status !== 'NOT_STARTED') {
      throw new AppError('Mission is not active', 'VALIDATION_ERROR');
    }

    if (!this.validationService.canCompleteMission(mission, actualValue)) {
      throw new AppError('Mission completion criteria not met', 'VALIDATION_ERROR');
    }

    console.log('[DEBUG-MCS] validation passed, marking completed...');
    // 1. Mark completed
    const completedMission: any = {
      ...mission,
      status: 'COMPLETED',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(completedMission);

    // 2. Award XP via HunterProgressionService
    const progressionResult = await this.progressionService.processMissionCompletion(
      mission.userId,
      mission.id,
      mission.xpReward,
    );

    // 3. Update Streak (Daily Activity)
    const today = new Date().toISOString().split('T')[0];
    if (!today) throw new AppError('Could not get today date', 'UNKNOWN_ERROR');

    const streakEvent = await this.streakService.processDailyActivity(mission.userId, today);

    // 4. Achievement Detection
    try {
      await this.achievementService.processEvent(mission.userId, 'MISSION_COMPLETION', 1);
      AnalyticsService.track('mission_completed', {
        missionId: mission.id,
        category: mission.category,
      });
      if (!progressionResult.duplicate) {
        AnalyticsService.track('xp_earned', { amount: mission.xpReward });
      }
    } catch (e) {
      console.warn('Failed to process achievements for mission completion:', e);
    }

    return {
      mission: completedMission,
      xpEarned: progressionResult.duplicate ? 0 : mission.xpReward,
      isStreakMaintained: streakEvent.newStreak >= streakEvent.oldStreak,
      progression: progressionResult,
    };
  }

  async startMission(missionId: string): Promise<MissionEntity> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    if (mission.status !== 'NOT_STARTED' && mission.status !== 'PAUSED') {
      throw new AppError('Mission cannot be started', 'VALIDATION_ERROR');
    }

    const startedMission: any = {
      ...mission,
      status: 'IN_PROGRESS',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(startedMission);

    AnalyticsService.track('mission_started', { missionId: mission.id });

    return startedMission;
  }

  async pauseMission(missionId: string): Promise<MissionEntity> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    if (mission.status !== 'IN_PROGRESS') {
      throw new AppError('Only active missions can be paused', 'VALIDATION_ERROR');
    }

    const pausedMission: any = {
      ...mission,
      status: 'PAUSED',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(pausedMission);

    return pausedMission;
  }

  async resumeMission(missionId: string): Promise<MissionEntity> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    if (mission.status !== 'PAUSED') {
      throw new AppError('Only paused missions can be resumed', 'VALIDATION_ERROR');
    }

    const resumedMission: any = {
      ...mission,
      status: 'IN_PROGRESS',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(resumedMission);

    return resumedMission;
  }

  async failMission(missionId: string): Promise<MissionResult> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    const failedMission: any = {
      ...mission,
      status: 'FAILED',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(failedMission);

    return {
      mission: failedMission,
      xpEarned: 0,
      isStreakMaintained: false, // In reality, missing a core mission might risk the streak
    };
  }

  async skipMission(missionId: string): Promise<MissionResult> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    const skippedMission: any = {
      ...mission,
      status: 'SKIPPED',
      updatedAt: new Date().toISOString(),
    };
    await this.missionRepo.updateMission(skippedMission);

    return {
      mission: skippedMission,
      xpEarned: 0,
      isStreakMaintained: false,
    };
  }

  async updateMissionProgress(
    missionId: string,
    metadataUpdates: Record<string, any>,
    currentValue?: number,
  ): Promise<MissionEntity> {
    const mission = await this.missionRepo.getMissionById(missionId);
    if (!mission) throw new AppError('Mission not found', 'NOT_FOUND');

    const updatedMission: any = {
      ...mission,
      metadata: {
        ...(mission.metadata || {}),
        ...metadataUpdates,
      },
      updatedAt: new Date().toISOString(),
    };

    if (currentValue !== undefined) {
      updatedMission.currentValue = currentValue;
    }

    await this.missionRepo.updateMission(updatedMission);
    return updatedMission;
  }
}
