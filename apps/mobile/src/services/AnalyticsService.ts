export type UXEventName =
  | 'onboarding_started'
  | 'fitness_experience_selected'
  | 'onboarding_completed'
  | 'system_priority_viewed'
  | 'system_priority_started'
  | 'mission_started'
  | 'mission_completed'
  | 'mission_abandoned'
  | 'mission_skipped'
  | 'goal_created'
  | 'goal_completed'
  | 'xp_earned'
  | 'level_up'
  | 'achievement_unlock'
  | 'focus_mode_start'
  | 'focus_mode_end'
  | 'recovery_usage'
  | 'premium_screen_viewed'
  | 'boss_entered'
  | 'boss_activity_logged'
  | 'inventory_item_previewed'
  | 'item_equipped'
  | 'shop_item_previewed'
  | 'purchase_completed'
  | 'daily_chest_ready'
  | 'daily_chest_claimed'
  | 'comeback_started'
  | 'comeback_completed'
  | 'first_use_guide_completed';

export class AnalyticsService {
  /**
   * Centralized tracking boundary for UX events.
   * Internal layer abstracts providers (Firebase, PostHog, Mixpanel).
   */
  static track(eventName: UXEventName, properties?: Record<string, unknown>) {
    if (__DEV__) {
      console.info(`[Analytics] Tracked: ${eventName}`, properties || {});
    }
    // Future: Promise.all([ Firebase.logEvent(eventName, properties), PostHog.capture(eventName, properties) ])
  }

  static identify(userId: string, traits?: Record<string, unknown>) {
    if (__DEV__) {
      console.info(`[Analytics] User Identified: ${userId}`, traits || {});
    }
  }
}
