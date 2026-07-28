import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface GoalHeaderProps {
  onEditPress?: (() => void) | undefined;
}

export const GoalHeader = memo(function GoalHeader({ onEditPress }: GoalHeaderProps) {
  return (
    <View style={styles.row}>
      {/* Left — Section label */}
      <Text accessibilityRole="header" style={styles.label}>
        CURRENT GOAL
      </Text>

      {/* Right — Edit icon button */}
      <Pressable
        accessibilityLabel="Edit goal"
        accessibilityRole="button"
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
        onPress={onEditPress}
      >
        <Text style={styles.editIcon}>⋯</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // space.4
  },
  label: {
    fontFamily: 'Inter_600SemiBold', // Label caps
    fontSize: 11,
    color: '#9CA3C8', // text-secondary
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  editButton: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonPressed: {
    opacity: 0.4,
  },
  editIcon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#4B5280', // text-muted
    lineHeight: 18,
    marginTop: -8, // visually center the ellipsis
  },
});
