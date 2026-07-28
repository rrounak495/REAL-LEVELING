/**
 * DeleteConfirmDialog.tsx — Premium Delete Confirmation
 *
 * Sprint 3: Custom Task System
 * Modal confirmation dialog before deleting a task.
 * Matches the existing Real Leveling design system.
 */
import React, { memo } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, SlideOutDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, radius, spacing } from '@theme';

interface DeleteConfirmDialogProps {
  visible: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = memo(function DeleteConfirmDialog({
  visible,
  taskTitle,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onCancel}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <Animated.View
          entering={FadeInDown.springify().damping(20).stiffness(150)}
          exiting={SlideOutDown}
          style={styles.dialog}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚠️</Text>
          </View>
          <Text style={styles.title}>Delete Task</Text>
          <Text style={styles.message}>
            Are you sure you want to delete <Text style={styles.taskName}>"{taskTitle}"</Text>? This
            action cannot be undone.
          </Text>
          <View style={styles.actions}>
            <Button size="md" style={styles.cancelBtn} variant="secondary" onPress={onCancel}>
              Cancel
            </Button>
            <Button size="md" style={styles.deleteBtn} variant="danger" onPress={onConfirm}>
              Delete
            </Button>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 3, 10, 0.85)',
  },
  dialog: {
    width: '100%',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    padding: spacing.sectionGap,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 12,
  },
  message: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  taskName: {
    fontFamily: fontFamily.inter.semiBold,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
  },
  deleteBtn: {
    flex: 1,
  },
});
