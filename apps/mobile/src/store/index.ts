/**
 * store/index.ts — Store Barrel Export
 *
 * Single import point for all Zustand stores.
 * Import stores from '@store' — never from individual store files.
 *
 * Stores defined in Sprint 2 (scaffolding):
 * - authStore — session, user, loading state
 *
 * Stores to be added in future sprints:
 * - playerStore — player data, level, XP, stats
 * - questStore — active quests, quest history
 * - avatarStore — avatar config, unlocked layers
 * - syncStore — WatermelonDB sync status
 * - entitlementStore — Premium subscription state
 */

export { useAuthStore, selectIsAuthenticated, selectUserId, selectUserEmail } from './auth.store';
export { useOnboardingStore, ONBOARDING_GOALS } from './onboarding.store';
export type { OnboardingGoal } from './onboarding.store';
export * from './journey.store';
export * from './progression.store';
