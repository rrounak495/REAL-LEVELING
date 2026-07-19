import {
  TransformationRepository,
  TransformationProfileRow,
  BodyMeasurementRow,
  StrengthRecordRow,
  LifeHistoryStatsRow,
} from '../repositories/TransformationRepository';

export class TransformationService {
  /**
   * Initializes a baseline transformation profile when a Journey starts.
   */
  static async createBaseline(
    userId: string,
    currentWeight: number,
    goalWeight: number,
    startDate: string,
    experience: string,
    location: string,
  ) {
    const profile = {
      user_id: userId,
      start_weight: currentWeight,
      current_weight: currentWeight,
      goal_weight: goalWeight,
      journey_start_date: startDate,
      fitness_experience: experience,
      training_location: location,
    };
    return TransformationRepository.upsertProfile(profile);
  }

  /**
   * Determines if a new strength record is a Personal Record (PR).
   */
  static async evaluatePR(
    userId: string,
    exerciseKey: string,
    value: number,
    unit: string,
  ): Promise<boolean> {
    const records = await TransformationRepository.getStrengthRecords(userId);
    const exerciseRecords = records.filter((r) => r.exercise_key === exerciseKey);

    if (exerciseRecords.length === 0) return true; // First time is a PR

    const currentMax = Math.max(...exerciseRecords.map((r) => r.value));
    return value > currentMax;
  }

  /**
   * Submits a new strength record.
   */
  static async logStrengthRecord(userId: string, exerciseKey: string, value: number, unit: string) {
    const isPR = await this.evaluatePR(userId, exerciseKey, value, unit);
    return TransformationRepository.addStrengthRecord({
      user_id: userId,
      exercise_key: exerciseKey,
      value,
      unit,
      date: new Date().toISOString(),
      is_pr: isPR,
    });
  }

  /**
   * Future AI Hooks
   * The architecture exposes these boundaries without implementing them yet.
   */
  static async analyzePosture(photoUrl: string): Promise<any> {
    throw new Error('AI Posture Analysis is not implemented yet.');
  }

  static async verifyWorkout(motionData: any): Promise<boolean> {
    throw new Error('AI Workout Verification is not implemented yet.');
  }

  static async analyzeNutrition(mealPhotoUrl: string): Promise<any> {
    throw new Error('Nutrition Analysis is not implemented yet.');
  }
}
