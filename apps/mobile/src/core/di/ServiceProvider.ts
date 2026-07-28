import { repositories } from './RepositoryProvider';

import {
  type IGoalService,
  type IGoalValidationService,
} from '../../features/goal_engine/domain/services/IGoalServices';
import { GoalService } from '../../features/goal_engine/application/services/GoalService';
import { GoalValidationService } from '../../features/goal_engine/application/services/GoalValidationService';

import { type IXpCalculationService } from '../../features/xp_engine/domain/services/IXpCalculationService';
import { type IXpModifierService } from '../../features/xp_engine/domain/services/IXpModifierService';
import { type IXpAwardService } from '../../features/xp_engine/domain/services/IXpAwardService';
import { XpCalculationService } from '../../features/xp_engine/application/services/XpCalculationService';
import { XpModifierService } from '../../features/xp_engine/application/services/XpModifierService';
import { XpAwardService } from '../../features/xp_engine/application/services/XpAwardService';

import {
  type IStreakService,
  type IMomentumService,
  type IStreakValidationService,
} from '../../features/streak_engine/domain/services/IStreakServices';
import { StreakService } from '../../features/streak_engine/application/services/StreakService';
import { MomentumService } from '../../features/streak_engine/application/services/MomentumService';
import { StreakValidationService } from '../../features/streak_engine/application/services/StreakValidationService';

import {
  type ILevelService,
  type ILevelValidationService,
} from '../../features/level_engine/domain/services/ILevelServices';
import { LevelService } from '../../features/level_engine/application/services/LevelService';
import { LevelValidationService } from '../../features/level_engine/application/services/LevelValidationService';

import { type IAchievementService } from '../../features/achievement_engine/domain/services/IAchievementServices';
import { AchievementService } from '../../features/achievement_engine/application/services/AchievementService';

import { type IReminderService } from '../../features/reminder_engine/domain/services/IReminderServices';
import { ReminderService } from '../../features/reminder_engine/application/services/ReminderService';

import {
  type IPremiumService,
  type IPremiumValidationService,
} from '../../features/premium_engine/domain/services/IPremiumServices';
import { PremiumService } from '../../features/premium_engine/application/services/PremiumService';
import { PremiumValidationService } from '../../features/premium_engine/application/services/PremiumValidationService';

import { type IMissionGeneratorService } from '../../features/mission_engine/domain/services/IMissionGeneratorService';
import { type IMissionCompletionService } from '../../features/mission_engine/domain/services/IMissionCompletionService';
import { type IMissionValidationService } from '../../features/mission_engine/domain/services/IMissionValidationService';
import { type IDailyLifecycleService } from '../../features/mission_engine/domain/services/IDailyLifecycleService';
import { type IHunterProgressionService } from '../../features/progression_engine/domain/services/IHunterProgressionService';
import { MissionGeneratorService } from '../../features/mission_engine/application/services/MissionGeneratorService';
import { MissionCompletionService } from '../../features/mission_engine/application/services/MissionCompletionService';
import { MissionValidationService } from '../../features/mission_engine/application/services/MissionValidationService';
import { DailyLifecycleService } from '../../features/mission_engine/application/services/DailyLifecycleService';
import { HunterProgressionService } from '../../features/progression_engine/application/services/HunterProgressionService';

export interface Services {
  goalValidation: IGoalValidationService;
  goal: IGoalService;
  xpCalculation: IXpCalculationService;
  xpModifier: IXpModifierService;
  xpAward: IXpAwardService;
  streakValidation: IStreakValidationService;
  momentum: IMomentumService;
  streak: IStreakService;
  levelValidation: ILevelValidationService;
  level: ILevelService;
  achievement: IAchievementService;
  reminder: IReminderService;
  premiumValidation: IPremiumValidationService;
  premium: IPremiumService;
  missionValidation: IMissionValidationService;
  missionGenerator: IMissionGeneratorService;
  missionCompletion: IMissionCompletionService;
  dailyLifecycle: IDailyLifecycleService;
  hunterProgression: IHunterProgressionService;
}

const goalValidationService = new GoalValidationService(repositories.goal);
const goalService = new GoalService(repositories.goal, goalValidationService);

const xpCalculationService = new XpCalculationService();
const xpModifierService = new XpModifierService(
  repositories.streak,
  repositories.premium,
  xpCalculationService,
);
const xpAwardService = new XpAwardService(
  xpModifierService,
  xpCalculationService,
  repositories.xp,
  repositories.level,
);

const streakValidationService = new StreakValidationService();
const momentumService = new MomentumService();
const streakService = new StreakService(repositories.streak, streakValidationService);

const levelValidationService = new LevelValidationService(repositories.level);
const levelService = new LevelService(repositories.level, levelValidationService);

const achievementService = new AchievementService(repositories.achievement);

const reminderService = new ReminderService(repositories.reminder);

const premiumValidationService = new PremiumValidationService(repositories.premium);
const premiumService = new PremiumService(repositories.premium);
const hunterProgressionService = new HunterProgressionService(repositories.level);

const missionValidationService = new MissionValidationService();
const missionGeneratorService = new MissionGeneratorService(repositories.mission);
const missionCompletionService = new MissionCompletionService(
  repositories.mission,
  missionValidationService,
  hunterProgressionService,
  streakService,
  achievementService,
);
const dailyLifecycleService = new DailyLifecycleService(repositories.mission);

export const services: Services = {
  goalValidation: goalValidationService,
  goal: goalService,
  xpCalculation: xpCalculationService,
  xpModifier: xpModifierService,
  xpAward: xpAwardService,
  streakValidation: streakValidationService,
  momentum: momentumService,
  streak: streakService,
  levelValidation: levelValidationService,
  level: levelService,
  achievement: achievementService,
  reminder: reminderService,
  premiumValidation: premiumValidationService,
  premium: premiumService,
  missionValidation: missionValidationService,
  missionGenerator: missionGeneratorService,
  missionCompletion: missionCompletionService,
  dailyLifecycle: dailyLifecycleService,
  hunterProgression: hunterProgressionService,
};
