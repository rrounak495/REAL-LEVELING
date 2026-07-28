/**
 * src/features/ai_engine/domain/models/AiPromptContext.ts
 *
 * Defines the real-time context fed to the AI engine for personalized coaching.
 */
export interface AiPromptContext {
  readonly userId: string;
  readonly currentGoal: string;
  readonly activeStreak: number;
  readonly momentumScore: number;
  readonly currentLevel: number;
  readonly recentMissions: readonly MissionSnapshot[];
}

export interface MissionSnapshot {
  readonly missionTitle: string;
  readonly status: string;
  readonly completionMode: string;
}
