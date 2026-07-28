/**
 * src/types/mission.types.ts
 *
 * Domain types for the Mission Board.
 *
 * DESIGN PRINCIPLES:
 * - Represents an RPG quest board, not a todo list.
 * - Strict types. No UI layout data lives here.
 */

export type MissionStatus = 'locked' | 'available' | 'active' | 'paused' | 'completed' | 'failed';

export type MissionDifficulty = 'easy' | 'normal' | 'hard' | 'elite';

export interface MissionReward {
  /** amount of XP awarded */
  readonly xp: number;
  /** optional secondary reward, e.g., currency, item */
  readonly item?: string;
}

export interface Mission {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: MissionStatus;
  readonly difficulty: MissionDifficulty;
  readonly estimatedTimeMinutes?: number;
  readonly reward: MissionReward;
  readonly isPrimary?: boolean;

  // New UI fields for Sprint 3
  readonly currentProgress?: number;
  readonly targetValue?: number;
  readonly targetUnit?: string;
  readonly metadata?: Record<string, any>;
}

/** Action callbacks a UI layer can trigger on a mission */
export interface MissionAction {
  onStart?: (missionId: string) => void;
  onComplete?: (missionId: string) => void;
  onPause?: (missionId: string) => void;
  onResume?: (missionId: string) => void;
  onReplace?: (missionId: string) => void;
  onEdit?: (missionId: string) => void;
  onViewDetails?: (missionId: string) => void;
  onUpdateProgress?: (
    missionId: string,
    metadataUpdates: Record<string, any>,
    currentValue?: number,
  ) => void;
}

export interface MissionBoardData {
  readonly title?: string;
  readonly subtitle?: string;
  readonly summary?: string;
  readonly missions: readonly Mission[];
}
