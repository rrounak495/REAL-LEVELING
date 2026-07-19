-- Sprint 3A Foundation Migration
-- Creates the 5 core tables for the backend schema:
-- profiles, user_settings, skill_categories, skills, user_skills.
-- Includes full RLS policies restricting access to owners.

-- 1. Profiles Table
-- One row per user, public-facing identity. Linked to auth.users.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  timezone TEXT,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Intent: Profiles are public player cards, viewable by everyone.
CREATE POLICY "Profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
-- Intent: Users can only insert their own profile on signup.
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Intent: Users can only update their own profile fields.
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. User Settings Table
-- User-specific application preferences.
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_channels JSONB DEFAULT '{"push": true, "email": true}'::jsonb,
  privacy_level TEXT DEFAULT 'public',
  theme_preference TEXT DEFAULT 'system',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Settings RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
-- Intent: Users can only view their own settings.
CREATE POLICY "Users can view own settings." ON public.user_settings FOR SELECT USING (auth.uid() = id);
-- Intent: Users can insert their own settings on signup.
CREATE POLICY "Users can insert own settings." ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = id);
-- Intent: Users can only update their own settings.
CREATE POLICY "Users can update own settings." ON public.user_settings FOR UPDATE USING (auth.uid() = id);


-- 3. Skill Categories Table
-- High-level categories (e.g. Strength, Mind, Discipline). Reference data.
CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skill Categories RLS
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
-- Intent: Categories are reference data, public read-only for clients.
CREATE POLICY "Skill categories are viewable by everyone." ON public.skill_categories FOR SELECT USING (true);


-- 4. Skills Table
-- Individual skills users can track. Can be system-defined or user-created.
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying skills by category
CREATE INDEX idx_skills_category_id ON public.skills(category_id);
-- Allow duplicate skill names only if created by different users. System skills are considered owned by the null/zero uuid for this constraint.
CREATE UNIQUE INDEX idx_skills_name_creator ON public.skills (name, COALESCE(created_by, '00000000-0000-0000-0000-000000000000'::uuid));

-- Skills RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
-- Intent: Users can view all system skills and any custom skills they created.
CREATE POLICY "System skills and own skills are viewable." ON public.skills FOR SELECT USING (is_system = true OR auth.uid() = created_by);
-- Intent: Users can create custom skills for themselves (is_system must be false).
CREATE POLICY "Users can create custom skills." ON public.skills FOR INSERT WITH CHECK (auth.uid() = created_by AND is_system = false);
-- Intent: Users can only update their own custom skills.
CREATE POLICY "Users can update own custom skills." ON public.skills FOR UPDATE USING (auth.uid() = created_by AND is_system = false);


-- 5. User Skills Table
-- Join table tracking user progression per skill. 
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  current_xp INT NOT NULL DEFAULT 0,
  current_level INT NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Index for querying a user's skills
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);

-- User Skills RLS
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
-- Intent: Users can view their own tracked skills.
CREATE POLICY "Users can view own skills." ON public.user_skills FOR SELECT USING (auth.uid() = user_id);
-- Intent: Users can insert tracking rows for themselves.
CREATE POLICY "Users can insert own skills." ON public.user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Intent: Users can update their own tracking rows.
CREATE POLICY "Users can update own skills." ON public.user_skills FOR UPDATE USING (auth.uid() = user_id);


-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
