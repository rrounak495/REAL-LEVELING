-- ====================================================================
-- SPRINT 8: Boss Battles & Real-Time World Bosses
-- ====================================================================

-- 1. Bosses Table
CREATE TABLE public.bosses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  lore TEXT,
  artwork_url TEXT,
  boss_type TEXT NOT NULL, -- 'world_boss', 'weekly_boss', 'solo_boss'
  difficulty TEXT NOT NULL, -- 'normal', 'hard', 'extreme'
  rarity TEXT NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
  total_hp BIGINT NOT NULL,
  current_hp BIGINT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'active', 'enraged', 'defeated', 'expired'
  recommended_level INT NOT NULL DEFAULT 1,
  min_level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_bosses_status ON public.bosses(status);
CREATE INDEX idx_bosses_dates ON public.bosses(start_time, end_time);

-- 2. Boss Phases Table
CREATE TABLE public.boss_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  phase_name TEXT NOT NULL,
  hp_threshold_pct INT NOT NULL, -- 70 means triggers when HP <= 70%
  damage_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  visual_state TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_boss_phases_boss_id ON public.boss_phases(boss_id);

-- 3. Boss Objectives Table
CREATE TABLE public.boss_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'pushup', 'squat', 'running', etc.
  base_damage DECIMAL(8,2) NOT NULL, -- Server-side config for damage
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_boss_objectives_boss_id ON public.boss_objectives(boss_id);

-- 4. Boss Participants Table
CREATE TABLE public.boss_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_damage BIGINT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(boss_id, user_id)
);
CREATE INDEX idx_boss_participants_boss_id ON public.boss_participants(boss_id);
CREATE INDEX idx_boss_participants_user_damage ON public.boss_participants(boss_id, total_damage DESC);

-- 5. Boss Contributions Table (Idempotent tracking)
CREATE TABLE public.boss_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES public.boss_objectives(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  damage_dealt BIGINT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'valid', -- 'valid', 'flagged_suspicious', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_boss_contributions_user ON public.boss_contributions(user_id, boss_id);

-- 6. Boss Reward Rules Table
CREATE TABLE public.boss_reward_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL, -- 'participation', 'damage_milestone', 'top_rank', 'final_hit', 'defeat'
  condition_value TEXT, -- e.g. "2500" for damage, "100" for rank
  reward_type TEXT NOT NULL, -- 'xp', 'coin', 'gem', 'item', 'achievement'
  reward_id TEXT, -- Item ID or Achievement ID if applicable
  quantity INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Boss Reward Claims Table
CREATE TABLE public.boss_reward_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES public.boss_reward_rules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rule_id, user_id)
);

-- ====================================================================
-- ATOMIC CONTRIBUTION RPC
-- ====================================================================
-- This function processes a boss contribution atomically to avoid concurrent HP overwrite issues.
-- It returns JSON with success, damage applied, and new HP.
CREATE OR REPLACE FUNCTION submit_boss_contribution(
  p_boss_id UUID,
  p_user_id UUID,
  p_objective_id UUID,
  p_activity_type TEXT,
  p_amount DECIMAL,
  p_damage_dealt BIGINT,
  p_idempotency_key TEXT,
  p_status TEXT
) RETURNS jsonb AS $$
DECLARE
  v_current_hp BIGINT;
  v_boss_status TEXT;
  v_actual_damage BIGINT;
  v_new_hp BIGINT;
  v_participant_id UUID;
BEGIN
  -- 1. Check idempotency (handled by unique constraint, but we catch it)
  IF EXISTS (SELECT 1 FROM public.boss_contributions WHERE idempotency_key = p_idempotency_key) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Duplicate contribution');
  END IF;

  -- 2. Lock boss row for update
  SELECT current_hp, status INTO v_current_hp, v_boss_status 
  FROM public.bosses 
  WHERE id = p_boss_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Boss not found');
  END IF;

  IF v_boss_status IN ('defeated', 'expired') OR v_current_hp <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Boss already defeated or expired');
  END IF;

  -- 3. Calculate actual damage (don't overkill below 0)
  v_actual_damage := LEAST(p_damage_dealt, v_current_hp);
  v_new_hp := v_current_hp - v_actual_damage;

  -- 4. Update boss
  UPDATE public.bosses 
  SET 
    current_hp = v_new_hp,
    status = CASE WHEN v_new_hp <= 0 THEN 'defeated' ELSE status END,
    updated_at = NOW()
  WHERE id = p_boss_id;

  -- 5. Record contribution
  INSERT INTO public.boss_contributions (boss_id, user_id, objective_id, activity_type, amount, damage_dealt, idempotency_key, status)
  VALUES (p_boss_id, p_user_id, p_objective_id, p_activity_type, p_amount, v_actual_damage, p_idempotency_key, p_status);

  -- 6. Upsert participant
  INSERT INTO public.boss_participants (boss_id, user_id, total_damage, updated_at)
  VALUES (p_boss_id, p_user_id, v_actual_damage, NOW())
  ON CONFLICT (boss_id, user_id) 
  DO UPDATE SET 
    total_damage = public.boss_participants.total_damage + EXCLUDED.total_damage,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true, 'damage_applied', v_actual_damage, 'new_hp', v_new_hp);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ====================================================================
-- RLS POLICIES & REALTIME
-- ====================================================================
ALTER TABLE public.bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_reward_claims ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users
CREATE POLICY "Enable read access for all authenticated users" ON public.bosses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all authenticated users" ON public.boss_phases FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all authenticated users" ON public.boss_objectives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all authenticated users" ON public.boss_participants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all authenticated users" ON public.boss_reward_rules FOR SELECT USING (auth.role() = 'authenticated');

-- Contributions & Claims: Users can only see their own (or all if public leaderboard, but leaderboard is via participant table)
CREATE POLICY "Users can view all contributions for leaderboard" ON public.boss_contributions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own contributions" ON public.boss_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own claims" ON public.boss_reward_claims FOR SELECT USING (auth.uid() = user_id);

-- Enable Supabase Realtime for boss HP updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.bosses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.boss_participants;
