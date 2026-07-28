/**
 * src/core/di/RepositoryProvider.ts
 *
 * Centralized Dependency Injection for all Repositories across engines.
 * Ensures singletons and prevents direct Supabase usage in components.
 */

import { supabase } from '../../lib/supabase';

// Infrastructure Implementation Imports
import { SupabaseAuthRepository } from '../../features/user_foundation/infrastructure/repositories/SupabaseAuthRepository';
import { LocalProfileRepository } from '../../features/user_foundation/infrastructure/repositories/LocalProfileRepository';
import { LocalGoalRepository } from '../../features/goal_engine/infrastructure/repositories/LocalGoalRepository';
import { LocalMissionRepository } from '../../features/mission_engine/infrastructure/repositories/LocalMissionRepository';
import { SupabaseXpRepository } from '../../features/xp_engine/infrastructure/repositories/SupabaseXpRepository';
import { LocalLevelRepository } from '../../features/level_engine/infrastructure/repositories/LocalLevelRepository';
import { LocalStreakRepository } from '../../features/streak_engine/infrastructure/repositories/LocalStreakRepository';
import { SupabaseAchievementRepository } from '../../features/achievement_engine/infrastructure/repositories/SupabaseAchievementRepository';
import { SupabaseReminderRepository } from '../../features/reminder_engine/infrastructure/repositories/SupabaseReminderRepository';
import { SupabaseAiMemoryRepository } from '../../features/ai_engine/infrastructure/repositories/SupabaseAiMemoryRepository';
import { SupabasePremiumRepository } from '../../features/premium_engine/infrastructure/repositories/SupabasePremiumRepository';

// Domain Interface Imports
import { type IAuthRepository } from '../../features/user_foundation/domain/repositories/IAuthRepository';
import { type IUserProfileRepository } from '../../features/user_foundation/domain/repositories/IUserProfileRepository';
import { type IGoalRepository } from '../../features/goal_engine/domain/repositories/IGoalRepository';
import { type IMissionRepository } from '../../features/mission_engine/domain/repositories/IMissionRepository';
import { type IXpRepository } from '../../features/xp_engine/domain/repositories/IXpRepository';
import { type ILevelRepository } from '../../features/level_engine/domain/repositories/ILevelRepository';
import { type IStreakRepository } from '../../features/streak_engine/domain/repositories/IStreakRepository';
import { type IAchievementRepository } from '../../features/achievement_engine/domain/repositories/IAchievementRepository';
import { type IReminderRepository } from '../../features/reminder_engine/domain/repositories/IReminderRepository';
import { type IAiMemoryRepository } from '../../features/ai_engine/domain/repositories/IAiMemoryRepository';
import { type IPremiumRepository } from '../../features/premium_engine/domain/repositories/IPremiumRepository';

export interface Repositories {
  auth: IAuthRepository;
  profile: IUserProfileRepository;
  goal: IGoalRepository;
  mission: IMissionRepository;
  xp: IXpRepository;
  level: ILevelRepository;
  streak: IStreakRepository;
  achievement: IAchievementRepository;
  reminder: IReminderRepository;
  aiMemory: IAiMemoryRepository;
  premium: IPremiumRepository;
}

export const repositories: Repositories = {
  auth: new SupabaseAuthRepository(supabase),
  profile: new LocalProfileRepository(),
  goal: new LocalGoalRepository(),
  mission: new LocalMissionRepository(),
  xp: new SupabaseXpRepository(supabase),
  level: new LocalLevelRepository(),
  streak: new LocalStreakRepository(),
  achievement: new SupabaseAchievementRepository(supabase),
  reminder: new SupabaseReminderRepository(supabase),
  aiMemory: new SupabaseAiMemoryRepository(supabase),
  premium: new SupabasePremiumRepository(supabase),
};
