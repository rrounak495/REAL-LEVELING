-- Avatar Evolution System

-- avatar_evolution_levels
CREATE TABLE public.avatar_evolution_levels (
    level integer PRIMARY KEY,
    stage_name text NOT NULL,
    theme_color text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.avatar_evolution_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avatar evolution levels are viewable by everyone."
    ON public.avatar_evolution_levels FOR SELECT
    USING (true);

-- avatar_unlocks
CREATE TABLE public.avatar_unlocks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    required_level integer NOT NULL REFERENCES public.avatar_evolution_levels(level) ON DELETE CASCADE,
    category text NOT NULL,
    name text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.avatar_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avatar unlocks are viewable by everyone."
    ON public.avatar_unlocks FOR SELECT
    USING (true);

-- user_avatar_unlocks
CREATE TABLE public.user_avatar_unlocks (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unlock_id uuid NOT NULL REFERENCES public.avatar_unlocks(id) ON DELETE CASCADE,
    unlocked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, unlock_id)
);

ALTER TABLE public.user_avatar_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own avatar unlocks."
    ON public.user_avatar_unlocks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatar unlocks."
    ON public.user_avatar_unlocks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Explicit GRANTS
GRANT ALL ON TABLE public.avatar_evolution_levels TO authenticated;
GRANT ALL ON TABLE public.avatar_unlocks TO authenticated;
GRANT ALL ON TABLE public.user_avatar_unlocks TO authenticated;

-- Initial Seed Data for Evolution Levels
INSERT INTO public.avatar_evolution_levels (level, stage_name, theme_color) VALUES
(1, 'Novice', '#4287f5'),      -- Blue
(10, 'Apprentice', '#00FFFF'), -- Cyan
(25, 'Elite', '#C800FF'),      -- Purple
(50, 'Master', '#FF00FF'),     -- Magenta
(75, 'Legend', '#FF2244'),     -- Red
(100, 'Mythic', '#FFD700');    -- Gold

-- Initial Seed Data for Avatar Unlocks (Examples based on stages)
INSERT INTO public.avatar_unlocks (required_level, category, name, description) VALUES
(1, 'Title', 'Novice', 'You have just begun your journey.'),
(10, 'Title', 'Apprentice', 'You are learning the ropes.'),
(25, 'Title', 'Elite', 'You stand above the rest.'),
(50, 'Title', 'Master', 'You have mastered your limits.'),
(75, 'Title', 'Legend', 'Your name will be remembered.'),
(100, 'Title', 'Mythic', 'You are a god among mortals.');
