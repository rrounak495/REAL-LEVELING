import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';

import {
  HomeHeaderSection,
  GoalSection,
  SystemSection,
  ProgressSection,
  MissionBoardSection,
} from '@/components/home';
import { RewardOverlay } from '@/components/system/RewardOverlay';
import { useDashboardStore } from '@/store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const {
    goal,
    goalProgress,
    progressData,
    missionBoardData,
    systemMessage,
    hunterProfile,
    focusMissionId,
    initialize,
    startMission,
    pauseMission,
    resumeMission,
    completeMission,
    updateMissionProgress,
    editGoal,
  } = useDashboardStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Phase 3 — Header */}
        <HomeHeaderSection
          {...(hunterProfile?.level !== undefined ? { hunterLevel: hunterProfile.level } : {})}
          {...(hunterProfile?.xp !== undefined ? { currentXp: hunterProfile.xp } : {})}
          {...(hunterProfile?.xpRequired !== undefined
            ? { xpRequiredForNext: hunterProfile.xpRequired }
            : {})}
        />

        {/* Phase 4-7 — Main Content Sections */}
        <View style={styles.sectionsContainer}>
          <GoalSection
            {...(goal ? { goal } : {})}
            {...(goalProgress ? { progress: goalProgress } : {})}
            onEditPress={() => {
              if (goal?.id) editGoal(goal.id);
            }}
          />
          <SystemSection {...(systemMessage ? { data: systemMessage } : {})} />
          <ProgressSection {...(progressData ? { data: progressData } : {})} />
          <MissionBoardSection
            {...(missionBoardData ? { data: missionBoardData } : {})}
            onComplete={completeMission}
            onPause={pauseMission}
            onResume={resumeMission}
            onStart={startMission}
            onUpdateProgress={updateMissionProgress}
            onViewDetails={(id) => console.log('view', id)}
          />
        </View>
      </ScrollView>
      <RewardOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#03030A', // color.bg.void
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20, // spacing.screen.horizontal
    paddingBottom: 120, // ample bottom scroll space for floating UI
    paddingTop: 8,
  },
  sectionsContainer: {
    marginTop: 32, // space.8 - visual break from header
    gap: 24, // spacing.section.gap - strict card rhythm
  },
});
