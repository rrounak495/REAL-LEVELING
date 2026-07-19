import { type WorkoutLogEntry } from '@/store/session.store';
import { TransformationService } from '@/features/transformation/services/TransformationService';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

export interface SessionResult {
  xpEarned: number;
  bossDamage: number;
  newPRs: string[];
}

export class WorkoutIntegrationService {
  /**
   * Evaluates the completed workout session and triggers necessary integrations.
   * - Awards XP
   * - Calculates Boss Damage
   * - Detects and logs PRs
   *
   * In a full implementation, this would heavily interact with LevelingService,
   * BossService, and Supabase directly. For this prototype, we simulate the logic.
   */
  static async completeSession(
    userId: string,
    isBossDay: boolean,
    workoutLog: WorkoutLogEntry[],
  ): Promise<SessionResult> {
    let xpEarned = 0;
    let bossDamage = 0;
    const newPRs: string[] = [];

    for (const log of workoutLog) {
      const exercise = EXERCISE_LIBRARY[log.exerciseId];
      if (!exercise) continue;

      // Base XP logic
      const reps = log.completedReps || 0;
      const duration = log.completedDurationSeconds || 0;
      xpEarned += reps * 2 + Math.floor(duration / 10);

      // Boss Damage logic
      if (isBossDay) {
        bossDamage += reps * 5 + Math.floor(duration / 5);
      }

      // PR Check (Only for strength/cardio with defined values)
      if (reps > 0 || duration > 0) {
        const value = reps > 0 ? reps : duration;
        const unit = reps > 0 ? 'reps' : 'sec';

        const isPR = await TransformationService.evaluatePR(userId, exercise.name, value, unit);
        if (isPR) {
          newPRs.push(exercise.name);
          // Persist the PR
          await TransformationService.logStrengthRecord(userId, exercise.name, value, unit);
        }
      }
    }

    // Give a flat completion bonus
    xpEarned += 50;

    return {
      xpEarned,
      bossDamage,
      newPRs,
    };
  }
}
