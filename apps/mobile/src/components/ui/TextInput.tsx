/**
 * src/components/ui/TextInput.tsx
 *
 * Animated floating-label text input following the approved design system.
 *
 * Behavior:
 *  - Label starts in the placeholder position (centered in field)
 *  - On focus OR when value is non-empty, label floats up with spring animation
 *  - Border color: muted (default) → purple (focus) → danger (error)
 *  - Shows error message below the field when errorMessage is set
 *  - Password variant toggles visibility with an eye icon
 *
 * Usage:
 *   <AppTextInput
 *     label="Email"
 *     value={email}
 *     onChangeText={setEmail}
 *     keyboardType="email-address"
 *     errorMessage={errors.email?.message}
 *   />
 */
import { useRef, useState, useEffect } from 'react';
import {
  type KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  Text,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontFamily, motionDuration, radius } from '@theme';

interface AppTextInputProps extends Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'autoCapitalize' | 'autoCorrect' | 'returnKeyType' | 'onSubmitEditing'
> {
  label: string;
  errorMessage?: string | undefined;
  keyboardType?: KeyboardTypeOptions;
  isPassword?: boolean;
  testID?: string;
}

export function AppTextInput({
  label,
  value,
  onChangeText,
  errorMessage,
  keyboardType,
  isPassword = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  returnKeyType,
  onSubmitEditing,
  testID,
}: AppTextInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 0 = label at center, 1 = label floated up
  const floatProgress = useSharedValue(value && value.length > 0 ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    // eslint-disable-next-line react-hooks/immutability
    floatProgress.value = withTiming(1, { duration: motionDuration.quick });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value || value.length === 0) {
      // eslint-disable-next-line react-hooks/immutability
      floatProgress.value = withTiming(0, { duration: motionDuration.quick });
    }
  };

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatProgress.value, [0, 1], [0, -24]) },
      { scale: interpolate(floatProgress.value, [0, 1], [1, 0.82]) },
    ],
  }));

  const hasError = !!errorMessage;

  // Trigger haptic feedback when an error appears
  useEffect(() => {
    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [hasError]);

  const borderColor = hasError
    ? colors.semantic.danger
    : isFocused
      ? colors.purple[500]
      : 'rgba(139, 60, 247, 0.2)';

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.container, { borderColor }]}
        onPress={() => inputRef.current?.focus()}
      >
        {/* Floating label */}
        <Animated.Text style={[styles.label, labelAnimatedStyle, hasError && styles.labelError]}>
          {label}
        </Animated.Text>

        <TextInput
          ref={inputRef}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          cursorColor={colors.purple[400]}
          keyboardType={keyboardType}
          placeholderTextColor="transparent"
          returnKeyType={returnKeyType}
          secureTextEntry={isPassword && !showPassword}
          selectionColor={colors.purple[400]}
          style={styles.input}
          testID={testID}
          value={value}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={onSubmitEditing}
        />

        {/* Password toggle */}
        {isPassword && (
          <Pressable
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            hitSlop={8}
            style={styles.eyeButton}
            onPress={() => setShowPassword((p) => !p)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </Pressable>
        )}
      </Pressable>

      {/* Error message */}
      {hasError && (
        <Text accessibilityLiveRegion="polite" style={styles.errorText}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  container: {
    height: 60,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: colors.bg.surface,
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 16,
    color: colors.text.muted,
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    transformOrigin: 'left center',
  },
  labelError: {
    color: colors.semantic.danger,
  },
  input: {
    color: colors.text.primary,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    paddingTop: 0,
    paddingBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    color: colors.semantic.danger,
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
