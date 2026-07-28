import { type ExperienceLevel } from '../../domain/enums/MissionEnums';

/**
 * WorkoutTemplateEngine
 * Generates progressive workout targets based on user's experience level
 * and the number of active days they have trained.
 */
export class WorkoutTemplateEngine {
  private static readonly BEGINNER_BASE = {
    pushups: 10,
    squats: 10,
    walkMinutes: 15,
  };

  private static readonly INTERMEDIATE_BASE = {
    pushups: 25,
    squats: 30,
    workoutMinutes: 30,
    steps: 7000,
  };

  private static readonly EXPERIENCED_BASE = {
    pushups: 50,
    squats: 60,
    workoutMinutes: 60,
    steps: 12000,
  };

  /**
   * Generates the workout title and description scaling progressively.
   * Progression rule: every 5 days, pushups/squats increase by 10%.
   */
  static generateWorkout(
    level: ExperienceLevel,
    activeDays: number,
  ): { title: string; description: string; xpReward: number; estimatedMinutes: number } {
    const scale = 1 + Math.floor(activeDays / 5) * 0.1;

    if (level === 'BEGINNER') {
      const p = Math.floor(this.BEGINNER_BASE.pushups * scale);
      const s = Math.floor(this.BEGINNER_BASE.squats * scale);
      const w = Math.floor(this.BEGINNER_BASE.walkMinutes * scale);

      return {
        title: 'Foundation Training',
        description: `${p} Push-ups\n${s} Squats\n${w} Minute Walk\nLight Stretching`,
        xpReward: 50 + Math.floor(scale * 10),
        estimatedMinutes: w + 10,
      };
    }

    if (level === 'INTERMEDIATE') {
      const p = Math.floor(this.INTERMEDIATE_BASE.pushups * scale);
      const s = Math.floor(this.INTERMEDIATE_BASE.squats * scale);
      const w = Math.floor(this.INTERMEDIATE_BASE.workoutMinutes * scale);
      const st = Math.floor(this.INTERMEDIATE_BASE.steps * scale);

      return {
        title: 'Hunter Conditioning',
        description: `${p} Push-ups\n${s} Squats\n${w} Min Workout\n${st} Steps`,
        xpReward: 100 + Math.floor(scale * 20),
        estimatedMinutes: w + 30,
      };
    }

    // EXPERIENCED
    const p = Math.floor(this.EXPERIENCED_BASE.pushups * scale);
    const s = Math.floor(this.EXPERIENCED_BASE.squats * scale);
    const w = Math.floor(this.EXPERIENCED_BASE.workoutMinutes * scale);
    const st = Math.floor(this.EXPERIENCED_BASE.steps * scale);

    return {
      title: 'Awakening Protocol',
      description: `${p} Push-ups\n${s} Squats\n${w} Min Workout\n${st} Steps`,
      xpReward: 200 + Math.floor(scale * 30),
      estimatedMinutes: w + 45,
    };
  }
}
