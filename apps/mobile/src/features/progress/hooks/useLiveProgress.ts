import { useMemo } from 'react';
import { useTaskStore } from '@/store/task.store';
import { useDashboardStore } from '@/store/dashboard.store';
import { useAchievementStore } from '@/store/achievement.store';

export interface LiveProgressData {
  completedToday: number;
  totalToday: number;
  completedWeekly: number;
  totalWeekly: number;
  currentStreak: number;
  xpEarnedToday: number;
  completionPercentage: number;
  headerCaption: string;
  isAllCompleted: boolean;
}

export function useLiveProgress(): LiveProgressData {
  // Subscribe to raw arrays from the stores
  const tasks = useTaskStore((s) => s.tasks);
  
  // Use a stable reference selector or derive safely
  const dashboardMissions = useDashboardStore((s) => s.missionBoardData?.missions);
  const missionsList = dashboardMissions || [];

  const streakStats = useAchievementStore((s) => s.stats);

  return useMemo(() => {
    // 1. Filter today's missions (Foundation)
    const foundationMissions = missionsList.filter((m) => m.id.startsWith('foundation_'));
    const completedMissions = foundationMissions.filter((m) => m.status === 'completed');

    // 2. Filter today's custom tasks
    const currentDayOfWeek = new Date().getDay();
    const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
    const todayStr = new Date().toLocaleDateString();

    const pendingTasks = tasks.filter((t) => {
      if ((t as any).isDeleted) return false;
      if (t.completed) return false;
      if (t.repeat === 'weekdays' && !isWeekday) return false;
      return true;
    });

    const completedTasks = tasks.filter((t) => {
      if ((t as any).isDeleted) return false;
      if (!t.completed) return false;
      if (!t.completedAt) return false;
      const completedDateStr = new Date(t.completedAt).toLocaleDateString();
      return completedDateStr === todayStr;
    });

    // 3. Compute Totals
    const completedToday = completedMissions.length + completedTasks.length;
    const totalToday = foundationMissions.length + pendingTasks.length + completedTasks.length;
    const completionPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    // 4. Compute XP
    let xpEarnedToday = 0;
    completedMissions.forEach((m) => {
      xpEarnedToday += m.reward.xp;
    });
    completedTasks.forEach((t) => {
      xpEarnedToday += t.xp;
    });

    // 5. Weekly Calculations (Rolling Architecture)
    // To support real rolling weekly calculations in the future, we evaluate dates.
    // For now, we simulate "weekly" by counting completions from the past 7 days.
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyCompletedTasks = tasks.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= oneWeekAgo && completedDate <= now;
    });

    // We don't have historic data for foundation missions in the UI store yet,
    // but we can prepare the architecture.
    const activeTasksCount = tasks.filter((t) => !(t as any).isDeleted).length;
    const completedWeekly = weeklyCompletedTasks.length + completedMissions.length;
    const totalWeekly = activeTasksCount * 7 + foundationMissions.length * 7; // Rough projection for rolling week

    // 6. Streak Logic
    // If completed Today == Total Today, streak goes up optimistically.
    const isAllCompleted = totalToday > 0 && completedToday === totalToday;
    const baseStreak = streakStats?.current_streak || 0;
    const currentStreak = isAllCompleted ? baseStreak + 1 : baseStreak;

    // 7. Header Caption
    let headerCaption = 'No tasks today. Add some!';
    if (totalToday > 0) {
      if (isAllCompleted) {
        headerCaption = 'All objectives cleared • excellent work';
      } else {
        headerCaption = `${completedToday} of ${totalToday} complete • keep going, hunter`;
      }
    }

    return {
      completedToday,
      totalToday,
      completedWeekly,
      totalWeekly,
      currentStreak,
      xpEarnedToday,
      completionPercentage,
      headerCaption,
      isAllCompleted,
    };
  }, [tasks, missionsList, streakStats?.current_streak]);
}
