import React from 'react';
import { View, Text } from 'react-native';
// import { CheckCircle2, Circle } from 'lucide-react-native'; // Native SVG crash
import { useSystemStore } from '@/store/system.store';
import { useMissionStore } from '@/store/mission.store';
import { useBossStore } from '@/store/boss.store';

export function DailyLevelingPath() {
  const { systemState } = useSystemStore();
  const { dailyMissions } = useMissionStore();
  const { activeBosses } = useBossStore();

  const score = systemState?.daily_progress_score || 0;

  // Dynamically generate the path based on available missions/bosses
  // In a real app, this logic would live in SystemInsightService
  const steps = [];

  // Step 1: Login / Comeback
  steps.push({
    title: systemState?.comeback_tier !== 'normal' ? 'Return Protocol' : 'System Boot',
    completed: true, // Login is always complete if they see this
  });

  // Step 2: Daily Mission
  const activeMission = dailyMissions[0];
  if (activeMission) {
    steps.push({
      title: activeMission.title,
      completed: activeMission.is_completed,
    });
  } else {
    steps.push({
      title: 'Daily Training',
      completed: score >= 20,
    });
  }

  // Step 3: Boss Attack (if active)
  if (activeBosses.length > 0) {
    steps.push({
      title: 'World Raid Contribution',
      completed: score >= 40, // approximation for UI
    });
  }

  // Step 4: Daily Chest
  steps.push({
    title: 'Daily Chest',
    completed: score >= 100,
  });

  return (
    <View className="bg-theme-bg-dark border border-theme-border/50 rounded-xl p-4">
      <Text className="text-theme-text font-rajdhani-bold text-lg mb-4">TODAY'S PATH</Text>

      <View className="relative">
        {/* Connecting Line */}
        <View className="absolute left-3 top-4 bottom-4 w-0.5 bg-theme-border/30 z-0" />
        <View
          className="absolute left-3 top-4 w-0.5 bg-theme-neon-purple z-0"
          style={{ height: `${(score / 100) * 100}%` }} // Approximate visual fill
        />

        {steps.map((step, index) => (
          <View key={index} className="flex-row items-center mb-6 last:mb-0 z-10 relative">
            <View className="bg-theme-bg-dark rounded-full">
              {step.completed ? (
                <Text style={{ fontSize: 24, color: '#C49BFF' }}>✅</Text>
              ) : (
                <Text style={{ fontSize: 24, color: '#4B5563' }}>⭕</Text>
              )}
            </View>
            <Text
              className={`ml-3 font-exo-medium text-sm ${step.completed ? 'text-theme-neon-purple' : 'text-theme-text-muted'}`}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
