-- Sprint 8.5: THE SYSTEM
-- Adds tables for daily progress, system moments, personal records, rivals, and notification preferences.

-- 1. System User State (Tracks Daily Chest, Progress Score, Comeback State)
CREATE TABLE IF NOT EXISTS public.system_user_state (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_progress_score INT DEFAULT 0,
  daily_chest_status TEXT DEFAULT 'locked' CHECK (daily_chest_status IN ('locked', 'charging', 'ready', 'claimed')),
  streak_shield_active BOOLEAN DEFAULT false,
  comeback_tier TEXT DEFAULT 'normal' CHECK (comeback_tier IN ('normal', 'return_protocol', 'recovery_protocol', 'reawakening_protocol')),
  last_login_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_progress_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  timezone_offset_minutes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.system_user_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own system state" ON public.system_user_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own system state" ON public.system_user_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert state" ON public.system_user_state FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. System Moments Queue
CREATE TABLE IF NOT EXISTS public.system_moments_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  priority INT DEFAULT 10,
  moment_type TEXT NOT NULL, -- e.g., 'level_up', 'boss_defeat', 'chest_ready'
  payload JSONB DEFAULT '{}'::jsonb,
  is_viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.system_moments_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own moments" ON public.system_moments_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark moments viewed" ON public.system_moments_queue FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert moments" ON public.system_moments_queue FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Personal Records
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'pushups', 'running_km', 'plank_seconds', etc.
  record_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb, -- Store verification state, date, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, activity_type)
);

-- RLS
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own records" ON public.personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert records" ON public.personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update records" ON public.personal_records FOR UPDATE USING (auth.uid() = user_id);

-- 4. Rivals
CREATE TABLE IF NOT EXISTS public.rivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rival_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, rival_user_id)
);

-- RLS
ALTER TABLE public.rivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own rivals" ON public.rivals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage rivals" ON public.rivals FOR ALL USING (auth.uid() = user_id);

-- 5. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_briefing BOOLEAN DEFAULT true,
  streak_risk BOOLEAN DEFAULT true,
  daily_chest BOOLEAN DEFAULT true,
  boss_enraged BOOLEAN DEFAULT true,
  boss_ending BOOLEAN DEFAULT true,
  social_interactions BOOLEAN DEFAULT true,
  rival_updates BOOLEAN DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);


-- 6. RPC: Add Daily Progress (Idempotent and Atomic)
-- We need to atomically add points and check if we hit 100 to change chest status to 'ready'.
CREATE OR REPLACE FUNCTION add_daily_progress(p_user_id UUID, p_points INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_state public.system_user_state%ROWTYPE;
  v_new_score INT;
  v_new_chest_status TEXT;
  v_result JSONB;
BEGIN
  -- Lock the row
  SELECT * INTO v_state 
  FROM public.system_user_state 
  WHERE user_id = p_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Initialize if missing
    INSERT INTO public.system_user_state (user_id, daily_progress_score, daily_chest_status)
    VALUES (p_user_id, LEAST(p_points, 100), CASE WHEN p_points >= 100 THEN 'ready' ELSE 'charging' END)
    RETURNING * INTO v_state;
  ELSE
    -- We are updating
    v_new_score := LEAST(v_state.daily_progress_score + p_points, 100);
    
    -- Chest transition
    IF v_new_score >= 100 AND v_state.daily_chest_status IN ('locked', 'charging') THEN
      v_new_chest_status := 'ready';
    ELSE
      v_new_chest_status := v_state.daily_chest_status;
      IF v_new_chest_status = 'locked' AND v_new_score > 0 THEN
        v_new_chest_status := 'charging';
      END IF;
    END IF;

    UPDATE public.system_user_state
    SET 
      daily_progress_score = v_new_score,
      daily_chest_status = v_new_chest_status,
      last_progress_date = now(),
      updated_at = now()
    WHERE user_id = p_user_id
    RETURNING * INTO v_state;
  END IF;

  v_result := jsonb_build_object(
    'success', true,
    'daily_progress_score', v_state.daily_progress_score,
    'daily_chest_status', v_state.daily_chest_status
  );

  RETURN v_result;
END;
$$;

-- 7. RPC: Claim Daily Chest
CREATE OR REPLACE FUNCTION claim_daily_chest(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_state public.system_user_state%ROWTYPE;
BEGIN
  SELECT * INTO v_state 
  FROM public.system_user_state 
  WHERE user_id = p_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'System state not found');
  END IF;

  IF v_state.daily_chest_status != 'ready' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Chest is not ready');
  END IF;

  UPDATE public.system_user_state
  SET 
    daily_chest_status = 'claimed',
    updated_at = now()
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_system_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_user_state_modtime
    BEFORE UPDATE ON public.system_user_state
    FOR EACH ROW
    EXECUTE FUNCTION update_system_updated_at_column();
    
CREATE TRIGGER update_personal_records_modtime
    BEFORE UPDATE ON public.personal_records
    FOR EACH ROW
    EXECUTE FUNCTION update_system_updated_at_column();
    
CREATE TRIGGER update_notification_prefs_modtime
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_system_updated_at_column();
