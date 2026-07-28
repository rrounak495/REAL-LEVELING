import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressCard, type ProgressCardProps } from './progress/ProgressCard';

export type ProgressSectionProps = ProgressCardProps;

export const ProgressSection = memo(function ProgressSection(props: ProgressSectionProps) {
  return (
    <View style={styles.container}>
      <ProgressCard {...props} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
