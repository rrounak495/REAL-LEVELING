/**
 * TaskCard.tsx — Premium Task Card
 *
 * Sprint 1: UI Foundation
 * Layout: Checkbox (left) | Title + Metadata (center) | XP (right)
 * Matches Reference Image 2 exactly.
 * No business logic — pure UI placeholder.
 */
import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@theme';

export interface TaskCardData {
  id: string;
  title: string;
  xp: number;
  time?: string;
  repeat?: string;
  isCompleted?: boolean;
  completedAt?: string;
}

interface TaskCardProps {
  task: TaskCardData;
  onPress?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export const TaskCard = memo(function TaskCard({ task, onPress, onToggle }: TaskCardProps) {
  const isCompleted = task.isCompleted ?? false;

  return (
    <Pressable
      accessibilityLabel={`Task: ${task.title}. ${isCompleted ? 'Completed' : 'Pending'}. ${task.xp} XP.`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={() => onPress?.(task.id)}
    >
      {/* Left — Checkbox */}
      <Pressable
        accessibilityLabel="Toggle task completion"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={() => onToggle?.(task.id)}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      {/* Center — Title + Metadata */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, isCompleted && styles.completedTitle]}>
          {task.title}
        </Text>

        {/* Metadata Row */}
        {!isCompleted && (task.time || task.repeat) && (
          <View style={styles.metaRow}>
            {task.time && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏰</Text>
                <Text style={styles.metaText}>{task.time}</Text>
              </View>
            )}
            {task.repeat && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🔁</Text>
                <Text style={styles.metaText}>{task.repeat}</Text>
              </View>
            )}
          </View>
        )}

        {/* Completed timestamp */}
        {isCompleted && task.completedAt && (
          <Text style={styles.completedTime}>completed at {task.completedAt}</Text>
        )}
      </View>

      {/* Right — XP */}
      <Text style={[styles.xp, isCompleted && styles.completedXp]}>+{task.xp} XP</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.12)',
    marginBottom: spacing.listGap,
  },
  completedCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  // ── Checkbox ──
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // ── Content ──
  content: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 15,
    color: colors.text.primary,
    letterSpacing: 0.1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  // ── Metadata ──
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 10,
  },
  metaText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  // ── XP ──
  xp: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 13,
    color: colors.purple[300],
    letterSpacing: 0.3,
  },
  completedXp: {
    color: colors.semantic.success,
  },
  // ── Completed Time ──
  completedTime: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: 'rgba(16, 185, 129, 0.7)',
    marginTop: 3,
  },
});
