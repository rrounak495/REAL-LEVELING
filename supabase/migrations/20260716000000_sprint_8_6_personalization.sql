-- Sprint 8.6: Adaptive Hunter Personalization & Zero-Confusion UX
-- Add personalization fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fitness_experience TEXT NOT NULL DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS training_location TEXT NOT NULL DEFAULT 'home',
ADD COLUMN IF NOT EXISTS available_daily_time INT NOT NULL DEFAULT 30,
ADD COLUMN IF NOT EXISTS current_weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS goal_weight_kg NUMERIC;

-- Create first_use_guides table for persistent UX states
CREATE TABLE public.first_use_guides (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    guide_id TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, guide_id)
);

-- RLS for first_use_guides
ALTER TABLE public.first_use_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guides." ON public.first_use_guides
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guides." ON public.first_use_guides
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guides." ON public.first_use_guides
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guides." ON public.first_use_guides
FOR DELETE USING (auth.uid() = user_id);

-- Create a development helper to clear guides
CREATE OR REPLACE FUNCTION dev_reset_onboarding(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete all first use guides
    DELETE FROM public.first_use_guides WHERE user_id = p_user_id;
    
    -- Reset profile onboarding status
    UPDATE public.profiles
    SET onboarding_completed_at = NULL,
        fitness_experience = 'beginner',
        training_location = 'home',
        available_daily_time = 30
    WHERE id = p_user_id;

    -- Reset system moments viewed state
    UPDATE public.system_moments_queue
    SET is_viewed = false
    WHERE user_id = p_user_id AND moment_type = 'system_briefing';
END;
$$;
