import React, { memo } from 'react';
import { View } from 'react-native';
import { GoalCard, type GoalCardProps } from './goal/GoalCard';

export type GoalSectionProps = GoalCardProps;

export const GoalSection = memo(function GoalSection(props: GoalSectionProps) {
  return (
    <View style={{ width: '100%' }}>
      <GoalCard {...props} />
    </View>
  );
});
