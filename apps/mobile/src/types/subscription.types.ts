/**
 * src/types/subscription.types.ts
 *
 * Subscription and entitlement types for REAL LEVELING.
 *
 * IMPORTANT CONSTRAINTS:
 * - NO pricing data lives here. Prices are fetched from the store at runtime
 *   and are region-specific (RevenueCat / Play Billing handles this).
 * - NO payment UI, no purchase flow, no billing SDK references.
 * - This file only defines the shape of a user's subscription STATE,
 *   so the rest of the app can react to it without knowing payment details.
 */

// ── Subscription Status ──────────────────────────────────────────────────────

/**
 * The user's current subscription entitlement status.
 *
 * 'unknown'     — Not yet verified (app just launched, verification pending).
 * 'none'        — User has no active subscription.
 * 'active'      — User has a verified active premium subscription.
 * 'grace_period'— Subscription lapsed but user is in a payment grace period.
 *                 Treat as 'active' for content access purposes.
 * 'expired'     — Subscription has fully lapsed. Revoke new-chapter access.
 *                 Previously completed chapters remain accessible.
 */
export type SubscriptionStatus = 'unknown' | 'none' | 'active' | 'grace_period' | 'expired';

// ── Entitlement ──────────────────────────────────────────────────────────────

/**
 * A single entitlement record describing what a subscription grants.
 * Designed to be compatible with RevenueCat's entitlement model.
 */
export interface Entitlement {
  /** Stable identifier for this entitlement. e.g. 'premium_hunter' */
  readonly id: string;
  readonly status: SubscriptionStatus;
  /**
   * ISO timestamp of when this entitlement expires or expired.
   * Null if the subscription is ongoing or status is 'none'/'unknown'.
   */
  readonly expiresAt: string | null;
  /**
   * ISO timestamp of when this entitlement was originally purchased.
   * Null if status is 'none' or 'unknown'.
   */
  readonly purchasedAt: string | null;
}

// ── User Subscription State ──────────────────────────────────────────────────

/**
 * Complete subscription state shape for a user.
 * The chapter store reads this to resolve chapter access — it never
 * reads pricing, product IDs, or payment receipts directly.
 */
export interface UserSubscriptionState {
  /** The user's primary subscription status. */
  readonly status: SubscriptionStatus;
  /** All active entitlements for this user. */
  readonly entitlements: readonly Entitlement[];
  /** ISO timestamp of last server-side verification. Null if never verified. */
  readonly lastVerifiedAt: string | null;
  /**
   * Whether the subscription state has been loaded at least once this session.
   * Prevents the app from treating 'unknown' as 'none' before verification.
   */
  readonly isLoaded: boolean;
}

// ── Helper: Access Check ─────────────────────────────────────────────────────

/**
 * Pure function. Returns true if the given subscription state grants
 * access to premium-gated content.
 *
 * Grace period is treated as active access — this matches store policy
 * for both Google Play and App Store.
 */
export function hasPremiumAccess(state: UserSubscriptionState): boolean {
  return state.status === 'active' || state.status === 'grace_period';
}
