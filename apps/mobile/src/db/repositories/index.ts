// src/db/repositories/index.ts

/**
 * Dependency injection and initialization for all repositories.
 * The rest of the app imports `repositories` from here, keeping the Supabase client isolated.
 */
import { supabase } from '@/lib/supabase';
import { ProfileRepository } from './supabase/ProfileRepository';
import { SkillRepository } from './supabase/SkillRepository';
import { UserSkillRepository } from './supabase/UserSkillRepository';
import { AvatarRepository } from './supabase/AvatarRepository';
import { ProgressionRepository } from './supabase/ProgressionRepository';
import { MissionRepository } from './supabase/MissionRepository';
import { StatsRepository } from './supabase/StatsRepository';
import { RewardsHistoryRepository } from './supabase/RewardsHistoryRepository';
import { AchievementRepository } from './supabase/AchievementRepository';
import { AvatarEvolutionRepository } from './supabase/AvatarEvolutionRepository';
import { AvatarUnlockRepository } from './supabase/AvatarUnlockRepository';
import { InventoryRepository } from './supabase/InventoryRepository';
import { SocialRepository } from './supabase/SocialRepository';
import { FeedRepository } from './supabase/FeedRepository';
import { StorageRepository } from './supabase/StorageRepository';
import { BossRepository } from './supabase/BossRepository';
import { SystemRepository } from './supabase/SystemRepository';
import { JourneyRepository } from './supabase/JourneyRepository';

// Initialize repositories with the singleton Supabase client
export const repositories = {
  profiles: new ProfileRepository(supabase),
  skills: new SkillRepository(supabase),
  userSkills: new UserSkillRepository(supabase),
  avatar: new AvatarRepository(supabase),
  progression: new ProgressionRepository(supabase),
  missions: new MissionRepository(supabase),
  stats: new StatsRepository(supabase),
  rewardsHistory: new RewardsHistoryRepository(supabase),
  achievements: new AchievementRepository(supabase),
  avatarEvolution: new AvatarEvolutionRepository(supabase),
  avatarUnlock: new AvatarUnlockRepository(supabase),
  inventory: new InventoryRepository(supabase),
  social: new SocialRepository(),
  feed: new FeedRepository(),
  storage: new StorageRepository(),
  boss: new BossRepository(),
  system: new SystemRepository(),
  journey: new JourneyRepository(supabase),
};

export * from './interfaces';
