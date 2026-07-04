/**
 * lib/query-client.ts — TanStack Query Client
 *
 * WHY CENTRALIZED QUERY CLIENT CONFIG:
 * Default TanStack Query settings are designed for web (aggressive refetching,
 * short stale times). Mobile apps need different defaults:
 * - Longer stale times (mobile data is expensive)
 * - No refetch on window focus (mobile apps don't have windows)
 * - Refetch on reconnect (critical for offline-first)
 * - Retry with exponential backoff (mobile networks are unreliable)
 *
 * This singleton is provided in app/_layout.tsx and used via
 * useQuery / useMutation hooks throughout the app.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── Retry ──────────────────────────────────────────────────────
      // 2 retries with exponential backoff (1s, 2s, 4s), capped at 30s
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),

      // ── Staleness ─────────────────────────────────────────────────
      // Data is considered fresh for 5 minutes. After that, a background
      // refetch happens on next access. Longer than web defaults because
      // mobile data is expensive and game data changes less frequently.
      staleTime: 1000 * 60 * 5, // 5 minutes

      // ── Garbage Collection ─────────────────────────────────────────
      // Unused query data is kept in memory for 10 minutes.
      // Prevents unnecessary refetches when navigating back and forth.
      gcTime: 1000 * 60 * 10, // 10 minutes

      // ── Refetch Behavior ──────────────────────────────────────────
      // Never refetch on app focus — mobile apps don't have browser focus.
      refetchOnWindowFocus: false,
      // DO refetch when connectivity is restored after being offline.
      refetchOnReconnect: true,
      // Do not refetch just because a component remounts.
      refetchOnMount: false,
    },

    mutations: {
      // 1 retry for mutations — prevents duplicate writes on bad networks
      retry: 1,
      retryDelay: 1000,
    },
  },
});
