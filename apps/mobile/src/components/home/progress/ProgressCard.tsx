import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressHeader } from './ProgressHeader';
import { ProgressMetrics } from './ProgressMetrics';
import { ProgressFooter } from './ProgressFooter';
import type { DailyProgressData } from '@/types/progress.types';

export interface ProgressCardProps {
  /** The data payload representing today's progress. */
  data?: DailyProgressData;
}

export const ProgressCard = memo(function ProgressCard({ data }: ProgressCardProps) {
  // Graceful fallback for empty states matching the 4-metric strict architecture
  const metrics = data?.metrics || [
    { id: '1', value: '-', label: 'Missions' },
    { id: '2', value: '-', label: 'XP Earned' },
    { id: '3', value: '-', label: 'Completion' },
    { id: '4', value: '-', label: 'Streak' },
  ];

  return (
    <View
      accessibilityLabel="Today's Progress Section"
      accessibilityRole="summary"
      style={styles.card}
    >
      <ProgressHeader subtitle={data?.subtitle} />
      <ProgressMetrics metrics={metrics} />
      <ProgressFooter summary={data?.summary} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'rgba(14, 14, 28, 0.7)', // glass.dark surface
    borderRadius: 20, // radius.xl to match Hero Goal Card exactly
    paddingHorizontal: 24, // space.6
    paddingTop: 24, // space.6
    paddingBottom: 24, // space.6
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)', // subtle glass border
    borderTopColor: 'rgba(139, 60, 247, 0.25)', // slight top reflection
  },
});
