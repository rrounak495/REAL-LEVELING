import * as Crypto from 'expo-crypto';
import {
  type IMissionGeneratorService,
  type GenerationContext,
} from '../../domain/services/IMissionGeneratorService';
import { type IMissionRepository } from '../../domain/repositories/IMissionRepository';
import { type MissionEntity } from '../../domain/models/MissionEntity';
import { WorkoutTemplateEngine } from './WorkoutTemplateEngine';

export class MissionGeneratorService implements IMissionGeneratorService {
  constructor(private readonly missionRepo: IMissionRepository) {}

  async generateDailyMissions(context: GenerationContext): Promise<MissionEntity[]> {
    const existingMissions = await this.missionRepo.getActiveMissions(context.userId);
    const activeIds = new Set(existingMissions.map((m) => m.id));
    const generatedMissions: MissionEntity[] = [];

    // Permanent Foundation IDs
    const gymId = 'foundation_gym';
    const deepworkId = 'foundation_deepwork';
    const hydrationId = 'foundation_hydration';
    const recoveryId = 'foundation_recovery';
    const mindfulnessId = 'foundation_mindfulness';
    const consistencyId = 'foundation_consistency';

    // 1. Gym & Workouts (Hero)
    if (!activeIds.has(gymId)) {
      const workout = WorkoutTemplateEngine.generateWorkout(
        context.experienceLevel,
        context.activeStreak,
      );
      // Determine tasks based on level (demo future proofing)
      const tasks =
        context.experienceLevel === 'BEGINNER'
          ? [
              { name: 'Push-ups', reps: '10 reps', xp: 30 },
              { name: 'Sit-ups', reps: '10 reps', xp: 30 },
            ]
          : [
              { name: 'Push-ups', reps: '20 reps', xp: 50 },
              { name: 'Sit-ups', reps: '25 reps', xp: 50 },
              { name: 'Squats', reps: '15 reps', xp: 40 },
            ];

      generatedMissions.push({
        id: gymId,
        userId: context.userId,
        category: 'FITNESS',
        type: 'CORE',
        difficulty: context.experienceLevel,
        title: workout.title,
        description: workout.description,
        targetValue: 1,
        targetUnit: 'session',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: workout.estimatedMinutes,
        xpReward: 50,
        status: 'NOT_STARTED',
        isEditable: false,
        metadata: {
          statGrowth: 'Strength',
          tasks,
          progressType: 'checklist',
          sourceType: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. Deep Work
    if (!activeIds.has(deepworkId)) {
      generatedMissions.push({
        id: deepworkId,
        userId: context.userId,
        category: 'WORK',
        type: 'CORE',
        difficulty: 'INTERMEDIATE',
        title: 'Deep Work',
        description: 'Focus on your most important cognitive task.',
        targetValue: 1,
        targetUnit: 'session',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: 60,
        xpReward: 40,
        status: 'NOT_STARTED',
        isEditable: false,
        metadata: {
          statGrowth: 'Intelligence',
          progressType: 'boolean',
          sourceType: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Hydration
    if (!activeIds.has(hydrationId)) {
      generatedMissions.push({
        id: hydrationId,
        userId: context.userId,
        category: 'HEALTH',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: 'Hydration',
        description: 'Drink water consistently throughout the day.',
        targetValue: 3,
        targetUnit: 'liters',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: 5,
        xpReward: 15,
        status: 'NOT_STARTED',
        isEditable: true,
        metadata: {
          statGrowth: 'Vitality',
          progressType: 'boolean',
          sourceType: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 4. Recovery (Sleep)
    if (!activeIds.has(recoveryId)) {
      generatedMissions.push({
        id: recoveryId,
        userId: context.userId,
        category: 'RECOVERY',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: 'Recovery',
        description: 'Essential recovery for Hunter progression.',
        targetValue: 8,
        targetUnit: 'hours',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: 480,
        xpReward: 20,
        status: 'NOT_STARTED',
        isEditable: true,
        metadata: {
          statGrowth: 'Vitality',
          progressType: 'boolean',
          sourceType: 'system',
          futureSyncProvider: 'health_connect',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 5. Mindfulness (Meditation)
    if (!activeIds.has(mindfulnessId)) {
      generatedMissions.push({
        id: mindfulnessId,
        userId: context.userId,
        category: 'MINDFULNESS',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: 'Mindfulness',
        description: 'Mental fortitude training.',
        targetValue: 15,
        targetUnit: 'minutes',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: 15,
        xpReward: 25,
        status: 'NOT_STARTED',
        isEditable: true,
        metadata: {
          statGrowth: 'Wisdom',
          progressType: 'boolean',
          sourceType: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 6. Consistency
    if (!activeIds.has(consistencyId)) {
      generatedMissions.push({
        id: consistencyId,
        userId: context.userId,
        category: 'LIFESTYLE',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: 'Consistency',
        description: 'Complete all Foundation Missions today.',
        targetValue: 1,
        targetUnit: 'day',
        completionMode: 'BOOLEAN',
        estimatedTimeMinutes: 0,
        xpReward: 30,
        status: 'NOT_STARTED',
        isEditable: false,
        metadata: {
          statGrowth: 'Charisma',
          progressType: 'boolean',
          completionType: 'auto_sync', // Auto-calculated based on other missions
          sourceType: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (generatedMissions.length > 0) {
      await this.missionRepo.saveMissions(generatedMissions);
    }

    return [...existingMissions, ...generatedMissions];
  }

  async generateReplacementMission(
    context: GenerationContext,
    skippedMissionId: string,
  ): Promise<MissionEntity> {
    // Generate a simple recovery mission to replace
    const replacement: MissionEntity = {
      id: Crypto.randomUUID(),
      userId: context.userId,
      category: 'RECOVERY',
      type: 'LIFESTYLE',
      difficulty: 'BEGINNER',
      title: 'Active Recovery',
      description: 'Take time to stretch and recover instead.',
      targetValue: 15,
      targetUnit: 'minutes',
      completionMode: 'BOOLEAN',
      estimatedTimeMinutes: 15,
      xpReward: 20,
      status: 'NOT_STARTED',
      isEditable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.missionRepo.saveMissions([replacement]);
    return replacement;
  }
}
