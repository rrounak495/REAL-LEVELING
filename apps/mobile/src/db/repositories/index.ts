/**
 * src/db/repositories/index.ts
 *
 * Dependency injection and initialization for all repositories.
 * The rest of the app imports `repositories` from here, keeping the Supabase client isolated.
 */
import { supabase } from '@/lib/supabase';
import { ProfileRepository } from './supabase/ProfileRepository';
import { SkillRepository } from './supabase/SkillRepository';
import { UserSkillRepository } from './supabase/UserSkillRepository';
import { AvatarRepository } from './supabase/AvatarRepository';

// Initialize repositories with the singleton Supabase client
export const repositories = {
  profiles: new ProfileRepository(supabase),
  skills: new SkillRepository(supabase),
  userSkills: new UserSkillRepository(supabase),
  avatar: new AvatarRepository(supabase),
};

export * from './interfaces';
