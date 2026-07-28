/**
 * TaskSectionHeader.tsx — Minimal Section Label
 *
 * Sprint 1: UI Foundation
 * Uppercase, muted, wide letter-spacing section label.
 * Distinct from the main app SectionHeader (no left border accent).
 */
import React, { memo } from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { colors, fontFamily, spacing } from '@theme';

interface TaskSectionHeaderProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

export const TaskSectionHeader = memo(function TaskSectionHeader({
  title,
  style,
}: TaskSectionHeaderProps) {
  return <Text style={[styles.label, style]}>{title}</Text>;
});

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.componentSm,
    marginTop: spacing[2],
  },
});
