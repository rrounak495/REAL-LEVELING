/**
 * src/types/chapter.types.ts
 *
 * Core domain types for the REAL LEVELING Chapter Progression System.
 *
 * DESIGN PRINCIPLES:
 * - Chapters are data, not logic. Adding a new chapter means adding a new
 *   data entry to the registry — no code changes required.
 * - UnlockRequirement is a discriminated union so future unlock mechanisms
 *   (e.g. time-gating, referral, achievement) can be added without refactoring.
 * - ChapterStatus is always derived from user state — never stored independently.
 *   This prevents state desync bugs.
 * - No pricing, no payment, no UI logic lives in these types.
 * - All identifier fields (iconId, animationIds, artworkId) are stable string
 *   keys consumed by asset registries, animation systems, and artwork loaders.
 *   The types do not care about the format of those keys.
 */

// ── Branded Primitives ───────────────────────────────────────────────────────

declare const __chapterBrand: unique symbol;
export type ChapterId = string & { readonly [__chapterBrand]: 'ChapterId' };
export const toChapterId = (id: string): ChapterId => id as ChapterId;

// ── Unlock Requirements ──────────────────────────────────────────────────────

/**
 * Discriminated union describing what a user must satisfy to access a chapter.
 * Adding a new unlock mechanism requires only adding a new variant here.
 */
export type UnlockRequirement =
  /** Chapter is freely accessible to all users. */
  | { readonly type: 'free' }
  /** Chapter requires an active premium subscription. */
  | { readonly type: 'subscription' }
  /**
   * Chapter requires a prior chapter to be completed.
   * Use this for sequencing chapters that also require a subscription.
   */
  | { readonly type: 'chapter_completion'; readonly requiredChapterId: ChapterId };

// ── Chapter Difficulty ───────────────────────────────────────────────────────

/**
 * Describes the relative difficulty of a chapter.
 * Used by UI to display difficulty indicators and by recommendation logic.
 * Values are ordered from easiest to hardest.
 */
export type ChapterDifficulty =
  | 'initiation' // Chapter 1 — entry-level, onboarding-friendly
  | 'apprentice' // Chapter 2 — moderate challenge
  | 'journeyman' // Chapter 3 — significant commitment required
  | 'expert' // Chapter 4 — high discipline required
  | 'master' // Future — elite tier
  | 'legendary'; // Future — pinnacle tier

// ── Chapter Completion State ─────────────────────────────────────────────────

export type ChapterCompletionState = 'not_started' | 'in_progress' | 'completed';

// ── Chapter Status (Derived) ─────────────────────────────────────────────────

/**
 * The status of a chapter from the current user's perspective.
 * This is ALWAYS computed from UserChapterState — never persisted directly.
 */
export type ChapterStatus =
  /** User meets all unlock requirements and may enter. */
  | 'unlocked'
  /** User does not yet meet unlock requirements. */
  | 'locked'
  /** User is actively progressing through this chapter. */
  | 'active'
  /** User has successfully completed this chapter. */
  | 'completed';

// ── Chapter XP Range ─────────────────────────────────────────────────────────

/**
 * The total XP range a user traverses while completing a chapter.
 * Used by progression UI to show expected growth and by analytics.
 * Both values are inclusive.
 */
export interface ChapterXpRange {
  /** Approximate XP at the start of this chapter. */
  readonly min: number;
  /** Approximate XP at chapter completion (including completion reward). */
  readonly max: number;
}

// ── Chapter Theme ─────────────────────────────────────────────────────────────

/**
 * Visual and narrative theme configuration for a chapter.
 * Consumed by the UI theming layer, avatar evolution system, and
 * future story screens. No actual asset paths live here — only
 * stable identifiers that asset registries resolve at runtime.
 */
export interface ChapterTheme {
  /**
   * Stable theme identifier.
   * Used as the key when looking up theme tokens in the design system.
   * Example: 'awakening' | 'rising' | 'shadow' | 'monarch'
   */
  readonly id: string;
  /**
   * Primary brand color for this chapter, expressed as a hex string.
   * Used by UI to tint chapter-specific surfaces and accents.
   * This is a design system decision — update only during the Polish phase.
   */
  readonly primaryColor: string;
  /**
   * Secondary accent color for this chapter, expressed as a hex string.
   */
  readonly accentColor: string;
  /**
   * Identifier for the background visual treatment applied to this chapter's screens.
   * Resolved by a future background asset registry.
   */
  readonly backgroundVariantId: string;
}

// ── Chapter Reward ───────────────────────────────────────────────────────────

export interface ChapterReward {
  /** XP bonus awarded on chapter completion. */
  readonly xpBonus: number;
  /** Gems awarded on chapter completion. */
  readonly gemsBonus: number;
  /**
   * Identifier for a special avatar evolution unlocked at completion.
   * Null if this chapter has no avatar reward.
   */
  readonly avatarEvolutionId: string | null;
  /**
   * Identifiers for any cosmetic or title rewards.
   * Empty array if none.
   */
  readonly rewardIds: readonly string[];
}

// ── Chapter Definition ───────────────────────────────────────────────────────

/**
 * Immutable definition of a single chapter in the REAL LEVELING progression system.
 *
 * Chapter definitions live in the chapter registry (src/config/chapters.ts).
 * This type should NEVER contain user-specific state.
 *
 * Identifier fields (iconId, unlockAnimationId, completionAnimationId,
 * lockedArtworkId) are stable string keys. The assets and animations
 * they reference are implemented separately in dedicated asset phases.
 */
export interface ChapterDefinition {
  // ── Identity ──────────────────────────────────────────────────────────────

  /** Unique stable identifier. Never reuse or renumber. */
  readonly id: ChapterId;

  /**
   * URL-safe, human-readable slug.
   * Used for deep linking, analytics event names, and future web routing.
   * Must be lowercase, hyphen-separated, and globally unique.
   * Example: 'first-awakening'
   */
  readonly slug: string;

  /** Display name shown to the user. */
  readonly name: string;

  /** Short tagline describing this chapter's theme. */
  readonly tagline: string;

  // ── Progression ───────────────────────────────────────────────────────────

  /** Inclusive start level for this chapter. */
  readonly levelStart: number;

  /** Inclusive end level for this chapter. */
  readonly levelEnd: number;

  /**
   * The XP range a user traverses during this chapter.
   * Used by progression UI and analytics.
   */
  readonly xpRange: ChapterXpRange;

  /** Duration of the chapter's primary challenge in days. */
  readonly challengeDurationDays: number;

  /**
   * Relative difficulty of this chapter.
   * Used by UI to display difficulty indicators.
   */
  readonly difficulty: ChapterDifficulty;

  // ── Access ────────────────────────────────────────────────────────────────

  /** What the user must satisfy to access this chapter. */
  readonly unlockRequirement: UnlockRequirement;

  // ── Visual & Animation ────────────────────────────────────────────────────

  /**
   * Structured visual and narrative theme for this chapter.
   * Replaces the old scalar `themeId` field with a richer config object.
   */
  readonly theme: ChapterTheme;

  /**
   * Identifier for the chapter icon used in tab bars, chapter selectors,
   * and progression maps. Resolved by the asset registry at runtime.
   */
  readonly iconId: string;

  /**
   * Identifier for the animation played when this chapter is unlocked.
   * Resolved by the animation registry. Null if no unlock animation is defined.
   */
  readonly unlockAnimationId: string | null;

  /**
   * Identifier for the animation played when the user completes this chapter.
   * Resolved by the animation registry. Null if no completion animation is defined.
   */
  readonly completionAnimationId: string | null;

  /**
   * Identifier for the artwork displayed when the chapter is in a locked state.
   * Resolved by the artwork asset registry.
   * Null if no locked artwork is specified (falls back to a default locked state).
   */
  readonly lockedArtworkId: string | null;

  // ── Rewards ───────────────────────────────────────────────────────────────

  /** Rewards granted when the user completes this chapter. */
  readonly completionReward: ChapterReward;

  // ── Future Extensions (Reserved) ─────────────────────────────────────────

  /**
   * Reserved for future story/narrative content identifiers.
   * Empty array now — populated in a dedicated story phase.
   */
  readonly storyContentIds: readonly string[];

  /**
   * Reserved for future boss encounter identifiers tied to this chapter.
   * Empty array now — populated in a dedicated boss phase.
   */
  readonly bossIds: readonly string[];
}

// ── User Chapter Progress ────────────────────────────────────────────────────

/**
 * The user's progress within a specific chapter.
 * This is persisted per-user.
 */
export interface UserChapterProgress {
  readonly chapterId: ChapterId;
  /** Day number within the chapter challenge (1-indexed). */
  readonly currentChallengeDay: number;
  /** Number of challenge days the user has marked as completed. */
  readonly completedChallengeDays: number;
  /** Derived completion percentage (0–100). */
  readonly percentComplete: number;
  /** ISO timestamp when the chapter was started. Null if not started. */
  readonly startedAt: string | null;
  /** ISO timestamp when the chapter was completed. Null if not completed. */
  readonly completedAt: string | null;
  /** The chapter's completion state. */
  readonly completionState: ChapterCompletionState;
}

// ── User Progression State ───────────────────────────────────────────────────

/**
 * The complete chapter-aware progression state for a single user.
 * This extends the existing XP/level model with chapter context.
 */
export interface UserProgressionState {
  /** The chapter the user is currently active in. */
  readonly currentChapterId: ChapterId;
  /** The user's current level (global, spanning all chapters). */
  readonly currentLevel: number;
  /** The highest chapter the user has ever completed. Null if none. */
  readonly highestCompletedChapterId: ChapterId | null;
  /** ISO timestamp of the most recent chapter completion. Null if none. */
  readonly lastChapterCompletedAt: string | null;
  /** Progress records for each chapter the user has interacted with. */
  readonly chapterProgress: readonly UserChapterProgress[];
}
