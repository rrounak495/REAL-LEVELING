import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MissionCard } from './MissionCard';
import type { Mission, MissionAction } from '@/types/mission.types';

interface MissionListProps extends MissionAction {
  missions: readonly Mission[];
}

export const MissionList = memo(function MissionList({ missions, ...actions }: MissionListProps) {
  // Allow all passed missions to render (Foundation Missions + future Custom Habits)
  const displayMissions = missions;

  if (displayMissions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Scanning for available quests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {displayMissions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} {...actions} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    gap: 16, // space.4 - Premium gap between quest cards
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B7280', // text.muted
    fontStyle: 'italic',
  },
});
