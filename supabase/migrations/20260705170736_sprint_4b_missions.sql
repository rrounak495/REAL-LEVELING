-- supabase/migrations/20260705170736_sprint_4b_missions.sql
-- Migration for Sprint 4B: Mission Engine

-- Create the user_missions table
CREATE TABLE IF NOT EXISTS public.user_missions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    category text NOT NULL, -- e.g., 'Strength', 'Cardio', 'Mobility', 'Nutrition', 'Recovery', 'Discipline'
    mission_type text NOT NULL, -- e.g., 'daily', 'weekly', 'monthly'
    difficulty text NOT NULL, -- e.g., 'Easy', 'Medium', 'Hard', 'Extreme'
    rarity text NOT NULL, -- e.g., 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'
    xp_reward integer NOT NULL DEFAULT 0,
    coin_reward integer NOT NULL DEFAULT 0,
    required_count integer NOT NULL DEFAULT 1,
    current_progress integer NOT NULL DEFAULT 0,
    is_completed boolean NOT NULL DEFAULT false,
    is_claimed boolean NOT NULL DEFAULT false,
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON TABLE public.user_missions TO authenticated;
GRANT ALL ON TABLE public.user_missions TO service_role;

-- Policies
CREATE POLICY "Users can view their own missions"
    ON public.user_missions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own missions"
    ON public.user_missions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own missions"
    ON public.user_missions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own missions"
    ON public.user_missions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_user_missions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_missions_updated_at
    BEFORE UPDATE ON public.user_missions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_missions_updated_at();

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON public.user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_expires_at ON public.user_missions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_missions_type ON public.user_missions(mission_type);
