import { type MissionRow } from '@/db/repositories/supabase/MissionRepository';
import { type Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface AdaptiveMissionConfig {
  required_count: number;
  difficulty_label: string;
}

export class AdaptiveDifficultyService {
  /**
   * Scales a mission's required count based on the user's fitness experience.
   * Uses safe defaults for beginners.
   */
  static scaleMission(mission: MissionRow, profile: Partial<ProfileRow>): AdaptiveMissionConfig {
    const experience = profile.fitness_experience || 'beginner';
    const baseCount = mission.required_count || 10;

    let scaledCount = baseCount;
    let label = 'Beginner';

    if (experience === 'intermediate') {
      scaledCount = Math.floor(baseCount * 2.5); // e.g., 10 -> 25
      label = 'Intermediate';
    } else if (experience === 'experienced') {
      scaledCount = Math.floor(baseCount * 4.5); // e.g., 10 -> 45
      label = 'Experienced';
    }

    return {
      required_count: scaledCount,
      difficulty_label: label,
    };
  }

  /**
   * Identifies if a user might need to increase difficulty based on recent mission completions.
   * In a full implementation, this checks the user's rolling history of completed vs skipped missions.
   */
  static shouldSuggestDifficultyIncrease(
    completedCountLast7Days: number,
    skippedCountLast7Days: number,
    currentExperience: string,
  ): boolean {
    if (currentExperience === 'experienced') return false; // Already maxed out

    // Simplistic rule: If they've completed 5+ missions and skipped 0 recently, suggest bumping.
    return completedCountLast7Days >= 5 && skippedCountLast7Days === 0;
  }
}
