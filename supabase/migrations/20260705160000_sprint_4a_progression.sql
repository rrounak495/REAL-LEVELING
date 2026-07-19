-- Sprint 4A: Core Progression Engine Migration
-- Creates the user_progression table to store XP, level, rank, coins, and gems.

CREATE TABLE public.user_progression (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INT NOT NULL DEFAULT 0,
  current_level INT NOT NULL DEFAULT 1,
  current_rank TEXT NOT NULL DEFAULT 'Unranked',
  coins INT NOT NULL DEFAULT 0,
  gems INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_progression ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT ALL ON TABLE public.user_progression TO authenticated;
GRANT ALL ON TABLE public.user_progression TO service_role;

-- Policies
-- Intent: Users can view their own progression.
CREATE POLICY "Users can view own progression." 
ON public.user_progression FOR SELECT 
USING (auth.uid() = id);

-- Intent: Users can insert their own progression row.
CREATE POLICY "Users can insert own progression." 
ON public.user_progression FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Intent: Users can update their own progression row.
CREATE POLICY "Users can update own progression." 
ON public.user_progression FOR UPDATE 
USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER trigger_user_progression_updated_at
BEFORE UPDATE ON public.user_progression
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
