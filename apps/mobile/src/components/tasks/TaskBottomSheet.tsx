/**
 * TaskBottomSheet.tsx — Premium Add/Edit Task Bottom Sheet
 *
 * Sprint 2 UI + Sprint 3 CRUD
 * Full bottom sheet experience matching Reference Image 3.
 * Now connected to real Zustand store for create/edit/delete.
 *
 * Features:
 * - Spring slide-up animation + fade backdrop
 * - Drag indicator handle
 * - Swipe-down to dismiss (via PanResponder)
 * - Backdrop tap to dismiss
 * - Keyboard-aware layout
 * - Add mode vs Edit mode (real CRUD)
 * - TaskInput + TimeChipGroup + RepeatChipGroup + auto XP
 * - Primary gradient CTA (disabled when name empty)
 * - Delete with confirmation dialog
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskInput } from './TaskInput';
import { TimeChipGroup, type TimeSlot } from './TimeChipGroup';
import { RepeatChipGroup, type RepeatOption } from './RepeatChipGroup';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import * as Haptics from 'expo-haptics';
import { useTaskStore } from '@/store/task.store';
import { colors, fontFamily, radius, spacing } from '@theme';
import {
  type CustomTask,
  TASK_XP_MAP,
  type TaskTimeSlot,
  type TaskRepeat,
} from '@/types/task.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  /** If provided, opens in Edit Mode with this task's real data. */
  editTask?: CustomTask | null;
}

// ── Main Bottom Sheet ─────────────────────────────────────────────────────────

export function TaskBottomSheet({ visible, onClose, editTask }: TaskBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const isEditMode = Boolean(editTask);

  // ── Form State ──
  const [taskName, setTaskName] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [customTime, setCustomTime] = useState<string | undefined>(undefined);
  const [repeatOption, setRepeatOption] = useState<RepeatOption>('once');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Store actions ──
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  // Auto-calculated XP
  const estimatedXp = TASK_XP_MAP[repeatOption as TaskRepeat] ?? 20;

  // ── Populate edit mode ──
  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.title);
      setTimeSlot(editTask.timeSlot as TimeSlot);
      setCustomTime(editTask.customTime);
      setRepeatOption(editTask.repeat as RepeatOption);
    } else {
      // Reset for add mode
      setTaskName('');
      setTimeSlot('morning');
      setCustomTime(undefined);
      setRepeatOption('once');
    }
    setShowDeleteConfirm(false);
  }, [editTask, visible]);

  // ── Swipe-to-dismiss ──
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical downward swipes on the drag handle area
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          onClose();
        }
      },
    }),
  ).current;

  const handleCustomTimePress = useCallback(() => {
    setShowTimePicker(true);
  }, []);

  const handleTimeSelected = useCallback((time: string) => {
    setCustomTime(time);
  }, []);

  // ── CRUD Handlers (Sprint 3) ──
  const handleSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const title = taskName.trim();
    if (!title) return;

    if (isEditMode && editTask) {
      updateTask(editTask.id, {
        title,
        timeSlot: timeSlot as TaskTimeSlot,
        customTime: timeSlot === 'custom' ? customTime : undefined,
        repeat: repeatOption as TaskRepeat,
      });
    } else {
      createTask({
        title,
        timeSlot: timeSlot as TaskTimeSlot,
        customTime: timeSlot === 'custom' ? customTime : undefined,
        repeat: repeatOption as TaskRepeat,
      });
    }
    onClose();
  }, [
    taskName,
    timeSlot,
    customTime,
    repeatOption,
    isEditMode,
    editTask,
    createTask,
    updateTask,
    onClose,
  ]);

  const handleDeletePress = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    if (editTask) {
      deleteTask(editTask.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  }, [editTask, deleteTask, onClose]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const isButtonDisabled = taskName.trim().length === 0;

  if (!visible) return null;

  return (
    <>
      <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(200)}
          style={styles.overlay}
        >
          <Pressable
            accessibilityLabel="Close bottom sheet"
            style={styles.backdrop}
            onPress={onClose}
          />
        </Animated.View>

        {/* Sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.keyboardView, { paddingBottom: 85 }]}
        >
          <Animated.View
            entering={SlideInDown.springify().damping(20).stiffness(150)}
            exiting={SlideOutDown.duration(250)}
            style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
            {...panResponder.panHandlers}
          >
            {/* Drag Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Title */}
            <Text style={styles.sheetTitle}>{isEditMode ? 'Edit Task' : 'Add Task'}</Text>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Task Name Input */}
            <TaskInput
              autoFocus={!isEditMode}
              placeholder="What do you need to do?"
              value={taskName}
              onChangeText={setTaskName}
            />

            {/* WHEN Chips */}
            <TimeChipGroup
              customTime={customTime}
              selected={timeSlot}
              onCustomTimePress={handleCustomTimePress}
              onSelect={setTimeSlot}
            />

            {/* REPEAT Chips */}
            <RepeatChipGroup selected={repeatOption} onSelect={setRepeatOption} />

            {/* Estimated XP Preview */}
            <View style={styles.xpPreview}>
              <Text style={styles.xpLabel}>ESTIMATED XP</Text>
              <Text style={styles.xpValue}>+{estimatedXp} XP</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button disabled={isButtonDisabled} size="lg" variant="primary" onPress={handleSave}>
                {isEditMode ? 'Save Task' : 'Add Task'}
              </Button>

              {isEditMode && (
                <Button
                  size="md"
                  style={styles.deleteButton}
                  variant="danger"
                  onPress={handleDeletePress}
                >
                  Delete
                </Button>
              )}
            </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Native Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, date) => {
            if (Platform.OS === 'android') {
              setShowTimePicker(false);
            }
            if (event.type === 'set' && date) {
              const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
              setCustomTime(timeString);
              if (Platform.OS === 'ios') {
                setShowTimePicker(false);
              }
            } else if (event.type === 'dismissed') {
              setShowTimePicker(false);
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        taskTitle={editTask?.title ?? ''}
        visible={showDeleteConfirm}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 3, 10, 0.7)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  sheet: {
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(139, 60, 247, 0.2)',
    // Max height — don't cover the entire screen
    maxHeight: Dimensions.get('window').height * 0.88,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.muted,
    opacity: 0.5,
  },
  sheetTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 20,
    color: colors.text.primary,
    letterSpacing: 0.5,
    marginBottom: spacing.sectionGap,
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // ── XP Preview ──
  xpPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.componentMd,
    paddingVertical: 12,
    marginBottom: spacing.sectionGap,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.12)',
  },
  xpLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 1.2,
  },
  xpValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.purple[300],
    letterSpacing: 0.5,
  },
  // ── Actions ──
  actions: {
    gap: 10,
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 0,
  },
});
