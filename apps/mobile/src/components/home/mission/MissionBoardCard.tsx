import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MissionHeader } from './MissionHeader';
import { MissionList } from './MissionList';
import { MissionFooter } from './MissionFooter';
import type { MissionBoardData, MissionAction } from '@/types/mission.types';

export interface MissionBoardCardProps extends MissionAction {
  /** The data payload representing the mission board. */
  data?: MissionBoardData;
}

export const MissionBoardCard = memo(function MissionBoardCard({
  data,
  ...actions
}: MissionBoardCardProps) {
  return (
    <View
      accessibilityLabel="Mission Board Section"
      accessibilityRole="summary"
      style={styles.card}
    >
      <MissionHeader subtitle={data?.subtitle} title={data?.title} />
      <MissionList missions={data?.missions || []} {...actions} />
      <MissionFooter summary={data?.summary} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    // No background wrapper — each quest card stands on its own
    // MissionHeader provides the section label
  },
});
