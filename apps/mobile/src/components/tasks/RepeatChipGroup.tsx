/**
 * RepeatChipGroup.tsx — REPEAT Section Chip Group
 *
 * Sprint 2: Bottom Sheet UI
 * Once | Daily | Weekdays
 * Single selection. Default: Once.
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskChip } from './TaskChip';
import { colors, fontFamily, spacing } from '@theme';

export type RepeatOption = 'once' | 'daily' | 'weekdays';

interface RepeatChipGroupProps {
  selected: RepeatOption;
  onSelect: (option: RepeatOption) => void;
}

export const RepeatChipGroup = memo(function RepeatChipGroup({
  selected,
  onSelect,
}: RepeatChipGroupProps) {
  const options: { key: RepeatOption; label: string }[] = [
    { key: 'once', label: 'Once' },
    { key: 'daily', label: 'Daily' },
    { key: 'weekdays', label: 'Weekdays' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>REPEAT</Text>
      <View style={styles.chipRow}>
        {options.map((option) => (
          <TaskChip
            key={option.key}
            isSelected={selected === option.key}
            label={option.label}
            onPress={() => onSelect(option.key)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sectionGap,
  },
  sectionLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.componentSm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
