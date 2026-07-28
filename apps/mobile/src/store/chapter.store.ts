/**
 * src/store/chapter.store.ts
 *
 * REAL LEVELING — Chapter Progression Store
 *
 * Manages the user's current chapter state, progress within the active
 * challenge, and subscription entitlement status.
 *
 * RESPONSIBILITIES:
 * - Track which chapter the user is currently in.
 * - Track daily challenge progress within the chapter.
 * - Resolve whether a chapter is accessible given subscription state.
 * - Detect chapter completion and hold at the completion boundary
 *   (do NOT auto-advance — the user must explicitly transition).
 *
 * OUT OF SCOPE (handled elsewhere):
 * - Payment / purchase flow → dedicated monetization phase
 * - Backend sync → future backend integration phase
 * - XP / level calculation → progression.store.ts
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mmkvZustandStorage } from '@lib/storage';

import { CHAPTER_IDS, CHAPTER_REGISTRY, getChapterById, getNextChapter } from '@/config/chapters';
import type { ChapterId, ChapterStatus, UserChapterProgress } from '@/types/chapter.types';
import { type UserSubscriptionState, hasPremiumAccess } from '@/types/subscription.types';

// ── State Shape ──────────────────────────────────────────────────────────────

interface ChapterState {
  /** The chapter the user is currently active in. */
  currentChapterId: ChapterId;
  /** The user's current global level (mirrored from progression store for chapter resolution). */
  currentLevel: number;
  /** ID of the highest chapter the user has ever completed. Null if none. */
  highestCompletedChapterId: ChapterId | null;
  /** ISO timestamp of when the last chapter was completed. */
  lastChapterCompletedAt: string | null;
  /** Progress records for each chapter the user has touched. */
  chapterProgress: UserChapterProgress[];
  /** Current subscription state. Set by the monetization layer when implemented. */
  subscription: UserSubscriptionState;
}

// ── Actions Shape ────────────────────────────────────────────────────────────

interface ChapterActions {
  /**
   * Mark today's challenge day as completed.
   * If this completes the chapter, transitions to completion state.
   * Does NOT automatically advance to the next chapter.
   */
  completeChallengeDay: () => void;

  /**
   * Explicitly transition the user into the next chapter.
   * Should only be called after the current chapter is completed AND
   * the next chapter's access has been verified.
   * Returns false if the user does not have access to the next chapter.
   */
  advanceToNextChapter: () => boolean;

  /**
   * Update the user's current level (called by progression.store when level changes).
   * Used to resolve which chapter a user belongs in.
   */
  syncLevel: (level: number) => void;

  /**
   * Update subscription state. Called by the future monetization layer.
   * No payment logic runs here — only the state is stored.
   */
  setSubscriptionState: (state: UserSubscriptionState) => void;

  /**
   * Derive the status of any chapter for the current user.
   * Pure derivation — does not mutate state.
   */
  getChapterStatus: (chapterId: ChapterId) => ChapterStatus;

  /**
   * Get the current user's progress for the active chapter.
   * Returns null if no progress record exists yet.
   */
  getCurrentChapterProgress: () => UserChapterProgress | null;

  /** Reset to initial state (used on sign-out). */
  reset: () => void;
}

type ChapterStore = ChapterState & ChapterActions;

// ── Initial State ────────────────────────────────────────────────────────────

const INITIAL_SUBSCRIPTION: UserSubscriptionState = {
  status: 'unknown',
  entitlements: [],
  lastVerifiedAt: null,
  isLoaded: false,
};

const INITIAL_CHAPTER_1_PROGRESS: UserChapterProgress = {
  chapterId: CHAPTER_IDS.CHAPTER_1,
  currentChallengeDay: 1,
  completedChallengeDays: 0,
  percentComplete: 0,
  // startedAt is null until the user completes their first challenge day.
  // Setting it at module load time would record installation time, not start time.
  startedAt: null,
  completedAt: null,
  completionState: 'not_started',
};

const INITIAL_STATE: ChapterState = {
  currentChapterId: CHAPTER_IDS.CHAPTER_1,
  currentLevel: 1,
  highestCompletedChapterId: null,
  lastChapterCompletedAt: null,
  chapterProgress: [INITIAL_CHAPTER_1_PROGRESS],
  subscription: INITIAL_SUBSCRIPTION,
};

// ── Helper: Derive Chapter Status ────────────────────────────────────────────

function deriveChapterStatus(chapterId: ChapterId, state: ChapterState): ChapterStatus {
  const chapter = getChapterById(chapterId);
  if (!chapter) return 'locked';

  const progress = state.chapterProgress.find((p) => p.chapterId === chapterId);

  // Already completed
  if (progress?.completionState === 'completed') return 'completed';

  // Currently active
  if (state.currentChapterId === chapterId) return 'active';

  // Check unlock requirements
  const req = chapter.unlockRequirement;

  if (req.type === 'free') return 'unlocked';

  if (req.type === 'subscription') {
    return hasPremiumAccess(state.subscription) ? 'unlocked' : 'locked';
  }

  if (req.type === 'chapter_completion') {
    const reqProgress = state.chapterProgress.find((p) => p.chapterId === req.requiredChapterId);
    const prereqMet = reqProgress?.completionState === 'completed';
    const subMet = hasPremiumAccess(state.subscription);
    return prereqMet && subMet ? 'unlocked' : 'locked';
  }

  return 'locked';
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useChapterStore = create<ChapterStore>()(
  persist(
    immer((set, get) => ({
      ...INITIAL_STATE,

      completeChallengeDay: () => {
        set((state) => {
          const progress = state.chapterProgress.find(
            (p) => p.chapterId === state.currentChapterId,
          );
          if (!progress) return;

          const chapter = getChapterById(state.currentChapterId);
          if (!chapter) return;

          // Guard: do not advance past completion
          if (progress.completionState === 'completed') return;

          // First day completed — record accurate start time and transition state.
          // This is the only correct moment to capture startedAt.
          if (progress.completionState === 'not_started') {
            progress.completionState = 'in_progress';
            progress.startedAt = new Date().toISOString();
          }

          progress.completedChallengeDays = Math.min(
            progress.completedChallengeDays + 1,
            chapter.challengeDurationDays,
          );
          progress.currentChallengeDay = Math.min(
            progress.currentChallengeDay + 1,
            chapter.challengeDurationDays,
          );
          progress.percentComplete = Math.round(
            (progress.completedChallengeDays / chapter.challengeDurationDays) * 100,
          );

          // Detect chapter completion
          if (progress.completedChallengeDays >= chapter.challengeDurationDays) {
            progress.completionState = 'completed';
            progress.completedAt = new Date().toISOString();

            // Record highest completion — NEVER downgrade
            const currentHighest = state.highestCompletedChapterId;
            const currentHighestIndex = currentHighest
              ? CHAPTER_REGISTRY.findIndex((c) => c.id === currentHighest)
              : -1;
            const thisIndex = CHAPTER_REGISTRY.findIndex((c) => c.id === state.currentChapterId);
            if (thisIndex > currentHighestIndex) {
              state.highestCompletedChapterId = state.currentChapterId;
              state.lastChapterCompletedAt = new Date().toISOString();
            }
          }
        });
      },

      advanceToNextChapter: (): boolean => {
        const state = get();
        const nextChapter = getNextChapter(state.currentChapterId);
        if (!nextChapter) return false; // No next chapter defined yet

        const nextStatus = deriveChapterStatus(nextChapter.id, state);
        if (nextStatus !== 'unlocked') return false; // Access denied

        set((draft) => {
          draft.currentChapterId = nextChapter.id;

          // Create progress record for the new chapter if it doesn't exist
          const existing = draft.chapterProgress.find((p) => p.chapterId === nextChapter.id);
          if (!existing) {
            // New chapter starts as 'not_started' with startedAt null.
            // completeChallengeDay will set the accurate startedAt on first completion.
            draft.chapterProgress.push({
              chapterId: nextChapter.id,
              currentChallengeDay: 1,
              completedChallengeDays: 0,
              percentComplete: 0,
              startedAt: null,
              completedAt: null,
              completionState: 'not_started',
            });
          }
        });

        return true;
      },

      syncLevel: (level: number) => {
        set((state) => {
          state.currentLevel = level;
        });
      },

      setSubscriptionState: (subscriptionState: UserSubscriptionState) => {
        set((state) => {
          state.subscription = subscriptionState as any;
        });
      },

      getChapterStatus: (chapterId: ChapterId): ChapterStatus => {
        return deriveChapterStatus(chapterId, get());
      },

      getCurrentChapterProgress: (): UserChapterProgress | null => {
        const state = get();
        return state.chapterProgress.find((p) => p.chapterId === state.currentChapterId) ?? null;
      },

      reset: () => {
        set(() => ({ ...INITIAL_STATE }));
      },
    })),
    {
      name: 'chapter-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
      // Do not persist in-flight subscription state — always re-verify on launch
      partialize: (state) => ({
        currentChapterId: state.currentChapterId,
        currentLevel: state.currentLevel,
        highestCompletedChapterId: state.highestCompletedChapterId,
        lastChapterCompletedAt: state.lastChapterCompletedAt,
        chapterProgress: state.chapterProgress,
        // subscription is intentionally excluded — verified fresh each session
      }),
    },
  ),
);
