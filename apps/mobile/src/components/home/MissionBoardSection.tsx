import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MissionBoardCard, type MissionBoardCardProps } from './mission/MissionBoardCard';

export type MissionBoardSectionProps = MissionBoardCardProps;

export const MissionBoardSection = memo(function MissionBoardSection(
  props: MissionBoardSectionProps,
) {
  return (
    <View style={styles.container}>
      <MissionBoardCard {...props} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
