/**
 * types/index.ts — Global Type Exports
 *
 * Shared utility types and domain primitives used across features.
 * Feature-specific types live in their feature slice (src/features/[name]/types.ts).
 * This file is for truly global types only.
 */

// ── Branded Types ──────────────────────────────────────────────────────────
// Branded types prevent accidentally passing a UserId where a QuestId is expected.
// They have zero runtime overhead — purely a TypeScript construct.
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type UserId = Brand<string, 'UserId'>;
export type QuestId = Brand<string, 'QuestId'>;
export type XpAmount = Brand<number, 'XpAmount'>;
export type Level = Brand<number, 'Level'>;
export type AvatarLayerId = Brand<string, 'AvatarLayerId'>;
export type FriendId = Brand<string, 'FriendId'>;

/** Helper to create a branded UserId from a plain string */
export const toUserId = (id: string): UserId => id as UserId;
export const toQuestId = (id: string): QuestId => id as QuestId;
export const toXpAmount = (n: number): XpAmount => n as XpAmount;
export const toLevel = (n: number): Level => n as Level;

// ── Utility Types ──────────────────────────────────────────────────────────

/** Make specific keys required in a Partial type */
export type RequiredKeys<T, K extends keyof T> = Omit<Partial<T>, K> & Required<Pick<T, K>>;

/** Deep readonly — prevents mutation of nested objects */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/** Result type for operations that can fail */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// ── API Response Types ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── Game Domain Types ─────────────────────────────────────────────────────

export type PlayerStat = 'str' | 'int' | 'vit' | 'wis' | 'cha';

export type QuestDifficulty = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed' | 'expired';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

// ── Subscription Types ────────────────────────────────────────────────────

export type EntitlementId = 'premium';

export type PremiumFeature =
  | 'ai_quest_generation_unlimited'
  | 'advanced_analytics'
  | 'exclusive_quest_packs'
  | 'premium_avatar_cosmetics'
  | 'ad_free';

// ── Chapter Progression ───────────────────────────────────────────────────
export * from './chapter.types';

// ── Subscription ──────────────────────────────────────────────────────────
export * from './subscription.types';

// ── Goals ─────────────────────────────────────────────────────────────────
export * from './goal.types';

// ── System Messages ───────────────────────────────────────────────────────
export * from './system.types';

// ── Daily Progress ────────────────────────────────────────────────────────
export * from './progress.types';

// ── Missions ──────────────────────────────────────────────────────────────
export * from './mission.types';
