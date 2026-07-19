export type DailyChestStatus = 'locked' | 'charging' | 'ready' | 'claimed';
export type ComebackTier =
  'normal' | 'return_protocol' | 'recovery_protocol' | 'reawakening_protocol';

export interface SystemUserStateRow {
  user_id: string;
  daily_progress_score: number;
  daily_chest_status: DailyChestStatus;
  streak_shield_active: boolean;
  comeback_tier: ComebackTier;
  last_login_date: string;
  last_progress_date: string;
  timezone_offset_minutes: number;
  created_at: string;
  updated_at: string;
}

export type MomentType =
  | 'level_up'
  | 'rank_up'
  | 'boss_defeat'
  | 'chest_ready'
  | 'comeback_complete'
  | 'achievement_unlocked'
  | 'item_acquired';

export interface SystemMomentRow {
  id: string;
  user_id: string;
  priority: number;
  moment_type: MomentType;
  payload: any;
  is_viewed: boolean;
  created_at: string;
}

export interface PersonalRecordRow {
  id: string;
  user_id: string;
  activity_type: string;
  record_value: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface RivalRow {
  id: string;
  user_id: string;
  rival_user_id: string;
  is_pinned: boolean;
  is_muted: boolean;
  created_at: string;
}

export interface NotificationPreferencesRow {
  user_id: string;
  daily_briefing: boolean;
  streak_risk: boolean;
  daily_chest: boolean;
  boss_enraged: boolean;
  boss_ending: boolean;
  social_interactions: boolean;
  rival_updates: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  updated_at: string;
}

export interface AddProgressResult {
  success: boolean;
  daily_progress_score?: number;
  daily_chest_status?: DailyChestStatus;
  error?: string;
}
