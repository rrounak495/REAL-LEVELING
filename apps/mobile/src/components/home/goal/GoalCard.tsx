import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GoalHeader } from './GoalHeader';
import { GoalContent } from './GoalContent';
import { GoalProgress as GoalProgressComponent } from './GoalProgress';
import { GoalFooter } from './GoalFooter';
import type { Goal, GoalProgress } from '@/types/goal.types';

export interface GoalCardProps {
  /** The currently active goal. */
  goal?: Goal;
  /** Progress data for the active goal. */
  progress?: GoalProgress;
  /** Callback fired when the user presses Edit. Architecture handles the Bottom Sheet later. */
  onEditPress?: () => void;
}

export const GoalCard = memo(function GoalCard({ goal, progress, onEditPress }: GoalCardProps) {
  // Gracefully fallback to sensible defaults if no active goal exists yet
  const title = goal?.title || 'Set Your First Goal';
  const description = goal?.description;
  const durationDays = goal?.durationDays || 21;
  const currentDay = progress?.currentDay || 1;
  const completedDays = progress?.completedDays || 0;
  const percentComplete = progress?.percentComplete || 0;
  const statusMessage = progress?.statusMessage || 'Stay consistent. Every day counts.';

  return (
    <View
      accessibilityLabel={`Goal: ${title}. Day ${currentDay} of ${durationDays}. ${percentComplete} percent complete.`}
      accessibilityRole="summary"
      style={styles.card}
    >
      <GoalHeader onEditPress={onEditPress} />

      <GoalContent description={description} title={title} />

      <GoalProgressComponent
        completedDays={completedDays}
        currentDay={currentDay}
        percentComplete={percentComplete}
        totalDays={durationDays}
      />

      <GoalFooter statusMessage={statusMessage} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20, // radius.xl for hero card
    backgroundColor: 'rgba(14, 14, 28, 0.7)', // glass.dark surface
    paddingHorizontal: 16, // space.4
    paddingTop: 16, // space.4
    paddingBottom: 16, // space.4
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)', // subtle glass border
    borderTopColor: 'rgba(139, 60, 247, 0.25)', // slight top reflection
  },
});
