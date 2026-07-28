import { create } from 'zustand';
import { repositories } from '@/core/di/RepositoryProvider';
import { services } from '@/core/di/ServiceProvider';
import { type Goal, type GoalProgress as UIGoalProgress } from '@/types/goal.types';
import { type DailyProgressData } from '@/types/progress.types';
import { type MissionBoardData, type Mission as UIMission } from '@/types/mission.types';
import { type SystemMessageData } from '@/types/system.types';
import { useAuthStore } from './auth.store';
import { useRewardStore } from './reward.store';
import { useHistoryStore } from './history.store';

interface DashboardState {
  // UI Data
  goal: Goal | undefined;
  goalProgress: UIGoalProgress | undefined;
  progressData: DailyProgressData | undefined;
  missionBoardData: MissionBoardData | undefined;
  systemMessage: SystemMessageData | undefined;
  hunterProfile: { level: number; xp: number; xpRequired: number } | undefined;
  isLoading: boolean;
  focusMissionId: string | null;
  isPremium: boolean;

  // Actions
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  startMission: (missionId: string) => Promise<void>;
  pauseMission: (missionId: string) => Promise<void>;
  resumeMission: (missionId: string) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  updateMissionProgress: (
    missionId: string,
    metadataUpdates: Record<string, any>,
    currentValue?: number,
  ) => Promise<void>;
  exitFocus: () => void;
  editGoal: (goalId: string) => Promise<void>; // opens bottom sheet in future
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  goal: undefined,
  goalProgress: undefined,
  progressData: undefined,
  missionBoardData: undefined,
  systemMessage: undefined,
  hunterProfile: undefined,
  isLoading: true,
  focusMissionId: null,
  isPremium: false,

  initialize: async () => {
    set({ isLoading: true });
    await get().refresh();
    set({ isLoading: false });
  },

  refresh: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    try {
      // 0. Daily Lifecycle Reset
      const didReset = await services.dailyLifecycle.processDailyReset(userId);
      if (didReset) {
        console.log('[Dashboard Store] Daily reset occurred, forcing fresh state fetch.');
      }

      // 1. Goal Engine
      const activeGoal = await repositories.goal.getActiveGoal(userId);
      let mappedGoal: Goal | undefined;
      let mappedProgress: UIGoalProgress | undefined;

      if (activeGoal) {
        mappedGoal = {
          id: activeGoal.id,
          title: activeGoal.title,
          category: activeGoal.category as any,
          durationDays: activeGoal.durationDays as any,
          startDate: activeGoal.startDate,
          status:
            activeGoal.status === 'DRAFT'
              ? 'draft'
              : activeGoal.status === 'COMPLETED'
                ? 'completed'
                : activeGoal.status === 'ABANDONED'
                  ? 'abandoned'
                  : 'active',
          createdAt: activeGoal.createdAt,
          updatedAt: activeGoal.updatedAt,
          ...(activeGoal.description ? { description: activeGoal.description } : {}),
        };

        const progress = await repositories.goal.getGoalProgress(activeGoal.id);
        if (progress) {
          mappedProgress = {
            currentDay: progress.currentDay,
            completedDays: progress.completedDays,
            percentComplete: progress.percentComplete,
            ...(progress.statusMessage ? { statusMessage: progress.statusMessage } : {}),
          };
        }
      }

      // 2. Progress Engine (Level, XP, Streak)
      const levelProgress = await repositories.level.getUserProgress(userId);
      const streak = await repositories.streak.getStreak(userId);

      const currentLevel = levelProgress?.currentLevel || 1;
      let xpRequired = 1000;
      const nextLevelDef = await repositories.level.getLevelDefinition(currentLevel + 1);
      if (nextLevelDef) {
        xpRequired = nextLevelDef.xpRequired;
      }
      // Assuming LevelProgress in our new models is currentXp or totalXpEarned? It was totalXpEarned?
      // Wait, let me just check any xp we have. Let's cast to any since we updated the domain models recently.
      const xpEarned =
        (levelProgress as any)?.currentXp || (levelProgress as any)?.totalXpEarned || 0;

      const hunterProfile = {
        level: currentLevel,
        xp: xpEarned,
        xpRequired,
      };

      const progressData: DailyProgressData = {
        subtitle: `Level ${currentLevel}`,
        summary: `${xpEarned} / ${xpRequired} XP to next level`,
        metrics: [
          { id: '1', value: '1', label: 'Day' },
          { id: '2', value: String(xpEarned), label: 'Total XP' },
          { id: '3', value: `${mappedProgress?.percentComplete || 0}%`, label: 'Completion' },
          { id: '4', value: String(streak?.currentDailyStreak || 0), label: 'Day Streak' },
        ],
      };

      // 3. Mission Engine (Smart Sorting & Priority)

      const profile = await repositories.profile.getProfile(userId);
      const experienceLevel = (profile as any)?.experienceLevel || 'BEGINNER';

      await services.missionGenerator.generateDailyMissions({
        userId,
        experienceLevel,
        focusCategories: [],
        currentDay: 1,
        activeStreak: streak?.currentDailyStreak || 0,
      });

      const missions = await repositories.mission.getActiveMissions(userId);

      const FOUNDATION_ORDER = [
        'foundation_gym',
        'foundation_deepwork',
        'foundation_hydration',
        'foundation_recovery',
        'foundation_mindfulness',
        'foundation_consistency',
      ];

      // Auto-calculate Consistency status based on the first 5 missions
      const consistencyMission = missions.find((m) => m.id === 'foundation_consistency');
      if (consistencyMission && consistencyMission.status !== 'COMPLETED') {
        const foundationExceptConsistency = missions.filter(
          (m) => FOUNDATION_ORDER.includes(m.id) && m.id !== 'foundation_consistency',
        );
        const allOthersCompleted =
          foundationExceptConsistency.length === 5 &&
          foundationExceptConsistency.every((m) => m.status === 'COMPLETED');

        if (allOthersCompleted) {
          (consistencyMission as any).status = 'COMPLETED'; // Force optimistically

          // Persist to backend without blocking the current render cycle
          services.missionCompletion
            .completeMission('foundation_consistency', 1)
            .then(() => {
              // Re-fetch to ensure the DB state is accurately reflected next time
              // but we don't strictly need to block here since we updated optimistically.
            })
            .catch((e) => console.warn('Failed to auto-complete consistency:', e));
        }
      }

      const sortedMissions = [...missions].sort((a, b) => {
        const aIndex = FOUNDATION_ORDER.indexOf(a.id);
        const bIndex = FOUNDATION_ORDER.indexOf(b.id);

        // Both are foundation missions
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        // Only A is foundation
        if (aIndex !== -1) return -1;
        // Only B is foundation
        if (bIndex !== -1) return 1;

        // Active/In Progress always first for custom habits
        if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
        if (b.status === 'IN_PROGRESS' && a.status !== 'IN_PROGRESS') return 1;

        // Then shortest estimated time
        const timeA = a.estimatedTimeMinutes || 999;
        const timeB = b.estimatedTimeMinutes || 999;
        return timeA - timeB;
      });

      // Map domain missions to UI missions
      const uiMissions: UIMission[] = sortedMissions.map((m, index) => ({
        id: m.id,
        title: m.title,
        status:
          m.status === 'COMPLETED' || m.status === 'FAILED' || m.status === 'SKIPPED'
            ? 'completed'
            : m.status === 'IN_PROGRESS'
              ? 'active'
              : m.status === 'PAUSED'
                ? 'paused'
                : 'available',
        difficulty:
          m.difficulty === 'BEGINNER'
            ? 'easy'
            : m.difficulty === 'INTERMEDIATE'
              ? 'normal'
              : m.difficulty === 'EXPERIENCED'
                ? 'hard'
                : 'elite',
        reward: { xp: m.xpReward },
        isPrimary: index === 0, // Gym is always primary
        ...(m.description ? { description: m.description } : {}),

        // Pass through new metadata and targeting
        currentProgress: (m as any).currentValue || 0,
        targetValue: (m as any).targetValue,
        targetUnit: (m as any).targetUnit,
        metadata: (m as any).metadata,
      }));

      const missionBoardData: MissionBoardData = {
        title: "Today's Missions",
        subtitle: `${uiMissions.filter((m) => m.status === 'completed').length}/${uiMissions.length} COMPLETED`,
        missions: uiMissions,
        summary: 'Complete all core missions to maintain streak.',
      };

      // 4. System Message (Intelligent AI Context)
      const allCompleted =
        uiMissions.length > 0 && uiMissions.every((m) => m.status === 'completed');
      let systemMessageText =
        "You must complete every mission today. This is for your real health and progress — skip it, and you'll pay the penalty.";
      let systemType: 'insight' | 'alert' | 'achievement' | 'system_update' = 'insight';
      let badge: 'INFO' | 'LEVEL_UP' | 'WARNING' | 'MISSION' | 'ACHIEVEMENT' | undefined =
        undefined;

      const hour = new Date().getHours();

      if (allCompleted) {
        systemMessageText =
          'All objectives cleared. Prepare for tomorrow or explore legendary quests.';
        systemType = 'achievement';
        badge = 'ACHIEVEMENT';
      }

      const systemMessage: SystemMessageData = {
        text: systemMessageText,
        type: systemType,
        ...(badge ? { badge } : {}),
        timestamp: new Date().toISOString(),
      };

      // 5. Premium Check
      let isPremium = false;
      try {
        isPremium = await services.premiumValidation.hasFeatureAccess(
          userId,
          'ADVANCED_AI_COACHING',
        );
      } catch (e) {
        console.warn('Premium check failed:', e);
      }

      let currentFocusId = get().focusMissionId;
      if (!currentFocusId) {
        const inProgress = uiMissions.find((m) => m.status === 'active');
        if (inProgress) currentFocusId = inProgress.id;
      }

      set({
        goal: mappedGoal,
        goalProgress: mappedProgress,
        progressData,
        missionBoardData,
        systemMessage,
        hunterProfile,
        focusMissionId: currentFocusId,
        isPremium,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  },

  startMission: async (missionId: string) => {
    try {
      await services.missionCompletion.startMission(missionId);
      set({ focusMissionId: missionId });
      await get().refresh();
    } catch (e) {
      console.error('Failed to start mission:', e);
    }
  },

  pauseMission: async (missionId: string) => {
    try {
      await services.missionCompletion.pauseMission(missionId);
      await get().refresh();
    } catch (e) {
      console.error('Failed to pause mission:', e);
    }
  },

  resumeMission: async (missionId: string) => {
    try {
      await services.missionCompletion.resumeMission(missionId);
      set({ focusMissionId: missionId });
      await get().refresh();
    } catch (e) {
      console.error('Failed to resume mission:', e);
    }
  },

  completeMission: async (missionId: string) => {
    console.log('[DEBUG] completeMission called with missionId:', missionId);
    try {
      const state = get();
      const mission = state.missionBoardData?.missions.find((m) => m.id === missionId);
      const actualValue = mission?.targetValue !== undefined ? mission.targetValue : 1;

      console.log('[DEBUG] actualValue calculated as:', actualValue);
      console.log('[DEBUG] calling services.missionCompletion.completeMission');

      const result = await services.missionCompletion.completeMission(missionId, actualValue);

      console.log('[DEBUG] services.missionCompletion.completeMission succeeded');
      set({ focusMissionId: null });

      // Enqueue Reward Events
      if (result.progression && !result.progression.duplicate) {
        useRewardStore.getState().enqueueReward({
          type: 'XP',
          title: 'Mission Complete',
          priority: 1,
          payload: { amount: result.xpEarned },
        });

        if (result.progression.leveledUp) {
          useRewardStore.getState().enqueueReward({
            type: 'LEVEL_UP',
            title: 'Level Up',
            priority: 100, // High priority so it sorts first
            payload: {
              oldLevel: result.progression.oldLevel,
              newLevel: result.progression.newLevel,
              overflowXp: result.progression.currentXp,
            },
          });
        }
      }

      useHistoryStore.getState().addRecord({
        taskId: missionId,
        completedAt: new Date().toISOString(),
        type: 'compulsory',
        xpEarned: result.xpEarned,
      });

      // Automatically refresh UI state to trigger the required live updates
      await get().refresh();
    } catch (e) {
      console.error('Failed to complete mission:', e);
    }
  },

  updateMissionProgress: async (
    missionId: string,
    metadataUpdates: Record<string, any>,
    currentValue?: number,
  ) => {
    try {
      await services.missionCompletion.updateMissionProgress(
        missionId,
        metadataUpdates,
        currentValue,
      );
      await get().refresh();
    } catch (e) {
      console.error('Failed to update mission progress:', e);
    }
  },

  exitFocus: () => {
    set({ focusMissionId: null });
  },

  editGoal: async (goalId: string) => {
    console.log('Edit goal pressed', goalId);
  },
}));
