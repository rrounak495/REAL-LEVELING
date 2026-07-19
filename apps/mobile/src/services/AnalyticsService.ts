export type UXEventName =
  | 'onboarding_started'
  | 'fitness_experience_selected'
  | 'onboarding_completed'
  | 'system_priority_viewed'
  | 'system_priority_started'
  | 'mission_started'
  | 'mission_completed'
  | 'mission_abandoned'
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
   * Currently logs to console, but can be replaced with Mixpanel/Amplitude/etc.
   */
  static track(eventName: UXEventName, properties?: Record<string, any>) {
    if (__DEV__) {
      console.log(`[UX Analytics] ${eventName}`, properties || {});
    }
    // Future: send to real analytics provider
  }
}
