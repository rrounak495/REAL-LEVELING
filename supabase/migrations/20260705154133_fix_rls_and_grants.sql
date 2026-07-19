-- Fix missing table grants and update RLS policies to explicitly target authenticated role

-- 1. Explicitly grant permissions to authenticated role for all tables
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.user_settings TO authenticated;
GRANT ALL ON TABLE public.skill_categories TO authenticated;
GRANT ALL ON TABLE public.skills TO authenticated;
GRANT ALL ON TABLE public.user_skills TO authenticated;
GRANT ALL ON TABLE public.avatar_configs TO authenticated;

-- Also ensure service_role has access
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.user_settings TO service_role;
GRANT ALL ON TABLE public.skill_categories TO service_role;
GRANT ALL ON TABLE public.skills TO service_role;
GRANT ALL ON TABLE public.user_skills TO service_role;
GRANT ALL ON TABLE public.avatar_configs TO service_role;

-- 2. Drop existing policies to recreate them explicitly for 'authenticated' role
DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

DROP POLICY IF EXISTS "Users can view own settings." ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings." ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings." ON public.user_settings;

DROP POLICY IF EXISTS "System skills and own skills are viewable." ON public.skills;
DROP POLICY IF EXISTS "Users can create custom skills." ON public.skills;
DROP POLICY IF EXISTS "Users can update own custom skills." ON public.skills;

DROP POLICY IF EXISTS "Users can view own skills." ON public.user_skills;
DROP POLICY IF EXISTS "Users can insert own skills." ON public.user_skills;
DROP POLICY IF EXISTS "Users can update own skills." ON public.user_skills;

DROP POLICY IF EXISTS "Avatar configs are viewable by everyone." ON public.avatar_configs;
DROP POLICY IF EXISTS "Users can insert own avatar config." ON public.avatar_configs;
DROP POLICY IF EXISTS "Users can update own avatar config." ON public.avatar_configs;

-- 3. Recreate Policies with explicit 'TO authenticated' (and anon for select where applicable)

-- Profiles
CREATE POLICY "Profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User Settings
CREATE POLICY "Users can view own settings." ON public.user_settings FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own settings." ON public.user_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own settings." ON public.user_settings FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Skills
CREATE POLICY "System skills and own skills are viewable." ON public.skills FOR SELECT USING (is_system = true OR auth.uid() = created_by);
CREATE POLICY "Users can create custom skills." ON public.skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by AND is_system = false);
CREATE POLICY "Users can update own custom skills." ON public.skills FOR UPDATE TO authenticated USING (auth.uid() = created_by AND is_system = false);

-- User Skills
CREATE POLICY "Users can view own skills." ON public.user_skills FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills." ON public.user_skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills." ON public.user_skills FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Avatar Configs
CREATE POLICY "Avatar configs are viewable by everyone." ON public.avatar_configs FOR SELECT USING (true);
CREATE POLICY "Users can insert own avatar config." ON public.avatar_configs FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own avatar config." ON public.avatar_configs FOR UPDATE TO authenticated USING (auth.uid() = id);
