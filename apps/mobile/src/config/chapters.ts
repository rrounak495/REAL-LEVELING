/**
 * src/config/chapters.ts
 *
 * REAL LEVELING — Chapter Registry
 *
 * This is the single source of truth for all chapter definitions.
 *
 * HOW TO ADD A NEW CHAPTER:
 * 1. Add a new entry to CHAPTER_REGISTRY below.
 * 2. That is all. No logic files need to change.
 *
 * RULES:
 * - Chapter IDs must be stable strings. Never renumber or reuse an ID.
 * - Slugs must be lowercase, hyphen-separated, and globally unique.
 * - Level ranges must be contiguous across chapters (Ch1: 1–10, Ch2: 11–20...).
 * - Identifier fields (iconId, animationIds, artworkId) are stable string keys.
 *   Their corresponding assets are registered separately in dedicated asset phases.
 * - No pricing. No UI logic. No payment references.
 */

import type { ChapterDefinition } from '@/types/chapter.types';
import { toChapterId } from '@/types/chapter.types';

// ── Chapter ID Constants ─────────────────────────────────────────────────────
// Export these so the rest of the app can reference chapters without
// hardcoding magic strings anywhere.

export const CHAPTER_IDS = {
  CHAPTER_1: toChapterId('chapter_1'),
  CHAPTER_2: toChapterId('chapter_2'),
  CHAPTER_3: toChapterId('chapter_3'),
  CHAPTER_4: toChapterId('chapter_4'),
} as const;

// ── Chapter Registry ─────────────────────────────────────────────────────────

/**
 * Ordered array of all chapter definitions.
 * The order here defines the visual and logical progression sequence.
 *
 * `satisfies ReadonlyArray<ChapterDefinition>` gives us:
 * - Full type-checking that every required field is present and correctly typed.
 * - TypeScript errors the moment a new required field is added to
 *   ChapterDefinition but not populated here — nothing can be forgotten.
 */
export const CHAPTER_REGISTRY = [
  // ── Chapter 1 — First Awakening ───────────────────────────────────────────
  {
    id: CHAPTER_IDS.CHAPTER_1,
    slug: 'first-awakening',
    name: 'First Awakening',
    tagline: 'Every hunter begins with a single step.',
    levelStart: 1,
    levelEnd: 10,
    xpRange: { min: 0, max: 4_500 },
    challengeDurationDays: 21,
    difficulty: 'initiation',
    unlockRequirement: { type: 'free' },
    theme: {
      id: 'awakening',
      primaryColor: '#8B3CF7', // purple-500 — origin, raw power
      accentColor: '#C084FC', // purple-300 — soft glow
      backgroundVariantId: 'bg_awakening',
    },
    iconId: 'icon_chapter_awakening',
    unlockAnimationId: null, // No unlock anim — always accessible
    completionAnimationId: 'anim_chapter_1_complete',
    lockedArtworkId: null, // Never locked
    completionReward: {
      xpBonus: 500,
      gemsBonus: 50,
      avatarEvolutionId: 'awakened_hunter_v1',
      rewardIds: ['title_awakened', 'badge_first_chapter'],
    },
    storyContentIds: [],
    bossIds: [],
  },

  // ── Chapter 2 — Rising Hunter ─────────────────────────────────────────────
  {
    id: CHAPTER_IDS.CHAPTER_2,
    slug: 'rising-hunter',
    name: 'Rising Hunter',
    tagline: 'The dungeon grows deeper. So do you.',
    levelStart: 11,
    levelEnd: 20,
    xpRange: { min: 4_500, max: 14_000 },
    challengeDurationDays: 21,
    difficulty: 'apprentice',
    unlockRequirement: { type: 'subscription' },
    theme: {
      id: 'rising',
      primaryColor: '#3B5BF6', // blue-500 — ambition, momentum
      accentColor: '#93AAF8', // blue-300 — rising light
      backgroundVariantId: 'bg_rising',
    },
    iconId: 'icon_chapter_rising',
    unlockAnimationId: 'anim_chapter_2_unlock',
    completionAnimationId: 'anim_chapter_2_complete',
    lockedArtworkId: 'art_chapter_2_locked',
    completionReward: {
      xpBonus: 1_000,
      gemsBonus: 100,
      avatarEvolutionId: 'rising_hunter_v1',
      rewardIds: ['title_rising_hunter', 'badge_chapter_2'],
    },
    storyContentIds: [],
    bossIds: [],
  },

  // ── Chapter 3 — Shadow Elite ──────────────────────────────────────────────
  {
    id: CHAPTER_IDS.CHAPTER_3,
    slug: 'shadow-elite',
    name: 'Shadow Elite',
    tagline: 'Only the disciplined reach this rank.',
    levelStart: 21,
    levelEnd: 30,
    xpRange: { min: 14_000, max: 30_000 },
    challengeDurationDays: 21,
    difficulty: 'journeyman',
    unlockRequirement: { type: 'subscription' },
    theme: {
      id: 'shadow',
      primaryColor: '#1A1A2E', // near-black — mystery, shadow
      accentColor: '#C800FF', // purple-neon — power beneath darkness
      backgroundVariantId: 'bg_shadow',
    },
    iconId: 'icon_chapter_shadow',
    unlockAnimationId: 'anim_chapter_3_unlock',
    completionAnimationId: 'anim_chapter_3_complete',
    lockedArtworkId: 'art_chapter_3_locked',
    completionReward: {
      xpBonus: 1_500,
      gemsBonus: 150,
      avatarEvolutionId: 'shadow_elite_v1',
      rewardIds: ['title_shadow_elite', 'badge_chapter_3'],
    },
    storyContentIds: [],
    bossIds: [],
  },

  // ── Chapter 4 — Monarch's Path ────────────────────────────────────────────
  {
    id: CHAPTER_IDS.CHAPTER_4,
    slug: 'monarchs-path',
    name: "Monarch's Path",
    tagline: 'Few dare walk this far.',
    levelStart: 31,
    levelEnd: 40,
    xpRange: { min: 30_000, max: 55_000 },
    challengeDurationDays: 21,
    difficulty: 'expert',
    unlockRequirement: { type: 'subscription' },
    theme: {
      id: 'monarch',
      primaryColor: '#D97706', // gold-500 — royalty, mastery
      accentColor: '#FCD34D', // gold-400 — crown glow
      backgroundVariantId: 'bg_monarch',
    },
    iconId: 'icon_chapter_monarch',
    unlockAnimationId: 'anim_chapter_4_unlock',
    completionAnimationId: 'anim_chapter_4_complete',
    lockedArtworkId: 'art_chapter_4_locked',
    completionReward: {
      xpBonus: 2_000,
      gemsBonus: 200,
      avatarEvolutionId: 'monarch_v1',
      rewardIds: ['title_monarch', 'badge_chapter_4'],
    },
    storyContentIds: [],
    bossIds: [],
  },
] satisfies readonly ChapterDefinition[];

// ── Registry Accessors ───────────────────────────────────────────────────────

/**
 * Look up a chapter definition by its ID.
 * Returns undefined if the ID is not found — callers must handle this.
 */
export function getChapterById(id: string): ChapterDefinition | undefined {
  return CHAPTER_REGISTRY.find((c) => c.id === id);
}

/**
 * Look up a chapter definition by its slug.
 * Returns undefined if the slug is not found.
 */
export function getChapterBySlug(slug: string): ChapterDefinition | undefined {
  return CHAPTER_REGISTRY.find((c) => c.slug === slug);
}

/**
 * Returns the chapter definition that contains the given global level.
 * Returns undefined if no chapter covers that level.
 */
export function getChapterForLevel(level: number): ChapterDefinition | undefined {
  return CHAPTER_REGISTRY.find((c) => level >= c.levelStart && level <= c.levelEnd);
}

/**
 * Returns the chapter that follows the given chapter in sequence.
 * Returns undefined if the given chapter is the last in the registry.
 */
export function getNextChapter(currentChapterId: string): ChapterDefinition | undefined {
  const index = CHAPTER_REGISTRY.findIndex((c) => c.id === currentChapterId);
  if (index === -1 || index === CHAPTER_REGISTRY.length - 1) return undefined;
  return CHAPTER_REGISTRY[index + 1];
}
