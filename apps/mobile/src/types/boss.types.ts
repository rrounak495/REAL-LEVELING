export type BossType = 'world_boss' | 'weekly_boss' | 'solo_boss' | 'guild_boss';
export type BossDifficulty = 'normal' | 'hard' | 'extreme';
export type BossRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BossStatus = 'upcoming' | 'active' | 'enraged' | 'defeated' | 'expired';

export interface BossRow {
  id: string;
  name: string;
  title: string | null;
  lore: string | null;
  artwork_url: string | null;
  boss_type: BossType;
  guild_id?: string | null;
  difficulty: BossDifficulty;
  rarity: BossRarity;
  total_hp: number;
  current_hp: number;
  start_time: string;
  end_time: string;
  status: BossStatus;
  recommended_level: number;
  min_level: number;
  created_at: string;
  updated_at: string;
}

export interface BossPhaseRow {
  id: string;
  boss_id: string;
  phase_name: string;
  hp_threshold_pct: number;
  damage_multiplier: number;
  visual_state: string | null;
  message: string | null;
  created_at: string;
}

export interface BossObjectiveRow {
  id: string;
  boss_id: string;
  activity_type: string;
  base_damage: number;
  created_at: string;
}

export interface BossParticipantRow {
  id: string;
  boss_id: string;
  user_id: string;
  total_damage: number;
  joined_at: string;
  updated_at: string;
}

export interface BossContributionRow {
  id: string;
  boss_id: string;
  user_id: string;
  objective_id: string;
  activity_type: string;
  amount: number;
  damage_dealt: number;
  idempotency_key: string;
  status: 'valid' | 'flagged_suspicious' | 'rejected';
  created_at: string;
}

export interface BossParticipantWithProfile extends BossParticipantRow {
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}
