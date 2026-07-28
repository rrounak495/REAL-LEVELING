import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressHeaderProps {
  subtitle?: string | undefined;
}

export const ProgressHeader = memo(function ProgressHeader({ subtitle }: ProgressHeaderProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        TODAY'S PROGRESS
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 24, // space.6
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#9CA3C8', // text.secondary
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: '#4B5280', // text.muted
  },
});
