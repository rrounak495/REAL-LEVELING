-- supabase/migrations/20260705173923_sprint_4c_achievements.sql
-- Migration for Sprint 4C: Rewards & Achievements Engine

-- 1. Create user_stats
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_pushups integer NOT NULL DEFAULT 0,
    total_squats integer NOT NULL DEFAULT 0,
    total_situps integer NOT NULL DEFAULT 0,
    total_running_distance numeric NOT NULL DEFAULT 0, -- e.g. in KM
    total_water_intake numeric NOT NULL DEFAULT 0, -- e.g. in Liters
    total_workouts integer NOT NULL DEFAULT 0,
    total_sleep_days integer NOT NULL DEFAULT 0,
    total_stretch_sessions integer NOT NULL DEFAULT 0,
    total_cardio_sessions integer NOT NULL DEFAULT 0,
    longest_streak integer NOT NULL DEFAULT 0,
    current_streak integer NOT NULL DEFAULT 0,
    last_mission_date date, -- Local date string e.g., '2026-07-06'
    total_xp_earned integer NOT NULL DEFAULT 0,
    total_coins_earned integer NOT NULL DEFAULT 0,
    total_gems_earned integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.user_stats TO authenticated;
GRANT ALL ON TABLE public.user_stats TO service_role;

CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 2. Create badges (Global lookup)
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon text,
    rarity text NOT NULL, -- Common, Rare, Epic, Legendary, Mythic
    animation_metadata jsonb, -- e.g. Glow Color, Particle Color
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.badges TO authenticated;
GRANT ALL ON TABLE public.badges TO service_role;

CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only service_role can modify badges" ON public.badges FOR ALL TO service_role USING (true) WITH CHECK (true);


-- 3. Create achievements (Global lookup)
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_id uuid REFERENCES public.badges(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    requirement_type text NOT NULL, -- e.g., 'total_pushups', 'level', 'current_streak'
    requirement_value integer NOT NULL,
    xp_reward integer NOT NULL DEFAULT 0,
    coin_reward integer NOT NULL DEFAULT 0,
    gem_reward integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.achievements TO authenticated;
GRANT ALL ON TABLE public.achievements TO service_role;

CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only service_role can modify achievements" ON public.achievements FOR ALL TO service_role USING (true) WITH CHECK (true);


-- 4. Create user_achievements (Unlock tracking)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.user_achievements TO authenticated;
GRANT ALL ON TABLE public.user_achievements TO service_role;

CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


-- 5. Create user_badges (Unlock tracking)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.user_badges TO authenticated;
GRANT ALL ON TABLE public.user_badges TO service_role;

CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


-- 6. Create rewards_history (Immutable log)
CREATE TABLE IF NOT EXISTS public.rewards_history (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_type text NOT NULL, -- e.g. 'mission_claim', 'streak_bonus', 'achievement_unlock'
    source text NOT NULL, -- e.g. 'daily_mission', 'achievement'
    source_id uuid, -- Reference to the specific mission/achievement that caused this
    xp integer NOT NULL DEFAULT 0,
    coins integer NOT NULL DEFAULT 0,
    gems integer NOT NULL DEFAULT 0,
    badge_id uuid REFERENCES public.badges(id) ON DELETE SET NULL,
    achievement_id uuid REFERENCES public.achievements(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.rewards_history ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.rewards_history TO authenticated;
GRANT ALL ON TABLE public.rewards_history TO service_role;

CREATE POLICY "Users can view their own rewards history" ON public.rewards_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rewards history" ON public.rewards_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- INTENTIONALLY OMIT UPDATE AND DELETE FOR rewards_history to keep it immutable


-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_user_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_stats_updated_at();

-- Insert dummy data for achievements (so it can be tested)
INSERT INTO public.achievements (name, description, requirement_type, requirement_value, xp_reward, coin_reward)
VALUES 
    ('100 Push-ups', 'Complete 100 push-ups total', 'total_pushups', 100, 100, 50),
    ('500 Squats', 'Complete 500 squats total', 'total_squats', 500, 500, 200),
    ('10 KM Run', 'Run a total distance of 10 KM', 'total_running_distance', 10, 300, 100),
    ('Level 10', 'Reach level 10', 'current_level', 10, 0, 500),
    ('7 Day Streak', 'Maintain a 7 day streak', 'longest_streak', 7, 500, 200)
ON CONFLICT DO NOTHING;
