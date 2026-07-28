/**
 * TimeChipGroup.tsx — WHEN Section Chip Group
 *
 * Sprint 2: Bottom Sheet UI
 * Morning | Afternoon | Evening | Custom Time (⏰)
 * Single selection. Custom time shows a simple time text after selection.
 */
import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { TaskChip } from './TaskChip';
import { colors, fontFamily, radius, spacing } from '@theme';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'custom';

interface TimeChipGroupProps {
  selected: TimeSlot;
  customTime?: string | undefined;
  onSelect: (slot: TimeSlot) => void;
  onCustomTimePress: () => void;
}

export const TimeChipGroup = memo(function TimeChipGroup({
  selected,
  customTime,
  onSelect,
  onCustomTimePress,
}: TimeChipGroupProps) {
  const slots: { key: TimeSlot; label: string }[] = [
    { key: 'morning', label: 'Morning' },
    { key: 'afternoon', label: 'Afternoon' },
    { key: 'evening', label: 'Evening' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>WHEN</Text>
      <View style={styles.chipRow}>
        {slots.map((slot) => (
          <TaskChip
            key={slot.key}
            isSelected={selected === slot.key}
            label={slot.label}
            onPress={() => onSelect(slot.key)}
          />
        ))}
        {/* Custom time chip */}
        <Pressable
          accessibilityLabel="Select custom time"
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === 'custom' }}
          style={[styles.timeChip, selected === 'custom' && styles.timeChipSelected]}
          onPress={() => {
            onSelect('custom');
            onCustomTimePress();
          }}
        >
          <Text style={styles.timeIcon}>⏰</Text>
          {selected === 'custom' && customTime ? (
            <Text style={styles.timeValue}>{customTime}</Text>
          ) : null}
        </Pressable>
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
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)',
    gap: 6,
  },
  timeChipSelected: {
    backgroundColor: colors.bg.overlay,
    borderColor: colors.purple[400],
  },
  timeIcon: {
    fontSize: 14,
  },
  timeValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.purple[300],
  },
});
