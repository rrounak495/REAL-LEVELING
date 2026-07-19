export interface SystemInsight {
  id: string;
  priority: number;
  type: 'urgency' | 'progression' | 'social' | 'system' | 'comeback' | 'habit';
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

export class SystemInsightService {
  /**
   * Resolves conflicting insights and returns a sorted list based on priority.
   * Hunter OS Priority (lower number = higher priority):
   * 1. Expiring real opportunities (e.g., Boss ending soon)
   * 2. Core Journey Objective (if uncompleted)
   * 3. Unclaimed earned rewards (Daily Chest, Journey Completion)
   * 4. Contextual Habits (Morning Hydration, Evening Sleep Prep)
   * 5. Comeback path
   * 6. Available daily progression
   * 7. Nearest progression unlock
   * 8. Rival movement
   */
  static generateInsights(context: any): SystemInsight[] {
    const insights: SystemInsight[] = [];
    const {
      bossState,
      progressionState,
      systemState,
      socialState,
      journeyState,
      habitState,
      dayState,
    } = context;

    // 1. Expiring real opportunities (Boss Ending Soon)
    if (bossState?.activeWorldBoss && bossState.activeWorldBoss.status === 'enraged') {
      insights.push({
        id: 'boss_enraged',
        priority: 1,
        type: 'urgency',
        title: 'World Boss Enraged',
        description: 'The World Boss has entered the enraged phase. It will escape soon!',
        actionLabel: 'Launch Attack',
        actionRoute: `/boss/${bossState.activeWorldBoss.id}`,
      });
    }

    // 2. Core Journey Objective (if not completed today)
    // Assuming journeyState tells us if today is completed.
    // In a full implementation, we'd check if the current day has been done.
    if (journeyState?.activeJourney && !journeyState?.todaysObjectiveCompleted) {
      const isBoss = journeyState.todaysObjective?.day_type === 'boss';
      insights.push({
        id: 'journey_objective',
        priority: 2,
        type: 'progression',
        title: isBoss ? 'Boss Trial Pending' : 'Daily Workout Pending',
        description: 'Complete today’s objective to advance your Journey.',
        actionLabel: 'Start Now',
        actionRoute: '/journey/today',
      });
    }

    // 3. Unclaimed earned rewards (Daily Chest)
    if (systemState?.dailyChestStatus === 'ready') {
      insights.push({
        id: 'daily_chest_ready',
        priority: 3,
        type: 'progression',
        title: 'Daily Chest Ready',
        description: 'You have reached 100 System Progress points. Claim your chest!',
        actionLabel: 'Claim Chest',
        actionRoute: '/(tabs)',
      });
    }

    // 4. Contextual Habits (Hunter OS Reminders)
    // Morning: Hydration
    if (dayState === 'morning' && habitState?.canNotify('morning_hydration', 4)) {
      insights.push({
        id: 'morning_hydration',
        priority: 4,
        type: 'habit',
        title: 'Morning Hydration',
        description: 'Start the day right. Log 500ml of water to fuel your system.',
        actionLabel: 'Log Water',
        actionRoute: '/planner',
      });
    }

    // Evening: Sleep Prep
    if (
      (dayState === 'evening' || dayState === 'night') &&
      habitState?.canNotify('sleep_prep', 8)
    ) {
      insights.push({
        id: 'sleep_prep',
        priority: 4,
        type: 'habit',
        title: 'Sleep Protocol',
        description: 'Recovery defines tomorrow’s strength. Prepare for sleep.',
        actionLabel: 'View Protocol',
        actionRoute: '/planner',
      });
    }

    // Afternoon: Recovery (if workout done)
    if (
      dayState === 'afternoon' &&
      journeyState?.todaysObjectiveCompleted &&
      habitState?.canNotify('afternoon_stretch', 4)
    ) {
      insights.push({
        id: 'afternoon_stretch',
        priority: 4,
        type: 'habit',
        title: 'Active Recovery',
        description: 'You completed your mission earlier. Do a quick 5-minute stretch.',
        actionLabel: 'Start Routine',
        actionRoute: '/planner',
      });
    }

    // 5. Comeback path
    if (systemState?.comebackTier && systemState.comebackTier !== 'normal') {
      insights.push({
        id: 'comeback_active',
        priority: 5,
        type: 'comeback',
        title: 'Hunter Return Protocol',
        description: 'Welcome back. Complete one light mission to restore full System privileges.',
        actionLabel: 'View Missions',
        actionRoute: '/(tabs)',
      });
    }

    // 6. Available daily progression
    if (systemState?.dailyProgressScore < 100) {
      insights.push({
        id: 'daily_progress',
        priority: 6,
        type: 'progression',
        title: 'Daily Progress Available',
        description: `You are ${100 - (systemState?.dailyProgressScore || 0)} points away from the Daily Chest.`,
        actionLabel: 'View Path',
        actionRoute: '/(tabs)',
      });
    }

    // Sort by priority
    return insights.sort((a, b) => a.priority - b.priority);
  }

  static getNextBestAction(insights: SystemInsight[]): SystemInsight | null {
    if (insights.length === 0) return null;
    return insights[0] || null;
  }
}
