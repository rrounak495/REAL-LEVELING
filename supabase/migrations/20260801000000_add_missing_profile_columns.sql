-- 20260801000000_add_missing_profile_columns.sql
-- Add missing columns to public.profiles required by the frontend application.
-- Email is deliberately excluded to prevent duplicating auth.users.email.

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'NOT_STARTED',
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS primary_goal_category TEXT,
  ADD COLUMN IF NOT EXISTS premium_status TEXT DEFAULT 'FREE';
