import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SystemMessageCard, type SystemMessageCardProps } from './system/SystemMessageCard';

export type SystemSectionProps = SystemMessageCardProps;

export const SystemSection = memo(function SystemSection(props: SystemSectionProps) {
  return (
    <View style={styles.container}>
      <SystemMessageCard {...props} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
