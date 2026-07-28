/**
 * src/features/achievement_engine/domain/models/AchievementUnlockRule.ts
 */
export interface AchievementUnlockRule {
  readonly metricType: string; // e.g., 'TOTAL_MISSIONS_COMPLETED'
  readonly targetValue: number;
  readonly specificReferenceId?: string; // e.g., 'chapter_1'
}
