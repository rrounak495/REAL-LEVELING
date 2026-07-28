import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ProgressMetric } from '@/types/progress.types';

interface ProgressMetricsProps {
  /** Exactly 4 metrics should be provided for the 2x2 grid. */
  metrics: readonly ProgressMetric[];
}

export const ProgressMetrics = memo(function ProgressMetrics({ metrics }: ProgressMetricsProps) {
  // Ensure we don't crash if less than 4 metrics are passed, but only render up to 4.
  const displayMetrics = metrics.slice(0, 4);

  return (
    <View style={styles.grid}>
      {displayMetrics.map((metric) => (
        <View key={metric.id} style={styles.cell}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.value}>
            {metric.value}
          </Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.label}>
            {metric.label}
          </Text>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 28, // space.7
    columnGap: 16, // space.4
  },
  cell: {
    width: '45%', // slightly less than 50% to account for gap
    flexGrow: 1,
  },
  value: {
    fontFamily: 'JetBrainsMono_700Bold', // Stat font
    fontSize: 24, // stat.lg
    lineHeight: 28,
    color: '#F4F4FF', // text.primary
    marginBottom: 4, // space.1
    letterSpacing: -0.5,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12, // body.sm
    lineHeight: 16,
    color: '#9CA3C8', // text.secondary
  },
});
