/**
 * TaskInput.tsx — Premium Task Name Input
 *
 * Sprint 2: Bottom Sheet UI
 * Large text field with auto-focus and purple accent focus state.
 * Placeholder: "What do you need to do?"
 */
import React, { memo, useRef, useEffect } from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@theme';

interface TaskInputProps extends Pick<TextInputProps, 'autoFocus'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const TaskInput = memo(function TaskInput({
  value,
  onChangeText,
  placeholder = 'What do you need to do?',
  autoFocus = true,
}: TaskInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      // Small delay to ensure bottom sheet animation is complete before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoFocus]);

  return (
    <TextInput
      ref={inputRef}
      autoCapitalize="sentences"
      autoCorrect={false}
      cursorColor={colors.purple[400]}
      maxLength={120}
      placeholder={placeholder}
      placeholderTextColor={colors.text.muted}
      returnKeyType="done"
      selectionColor={colors.purple[400]}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 18,
    color: colors.text.primary,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 60, 247, 0.25)',
    paddingHorizontal: spacing.componentMd,
    paddingVertical: 16,
    marginBottom: spacing.sectionGap,
    letterSpacing: 0.2,
  },
});
