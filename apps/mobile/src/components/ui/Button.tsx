/**
 * src/components/ui/Button.tsx
 *
 * The primary interactive component. All taps in the app funnel through here.
 *
 * Variants:
 *   primary   — Neon purple CTA. Use for the single most important action.
 *   secondary — Glassmorphism. Use for alternative actions.
 *   outline   — Bordered, no fill. Use for tertiary actions.
 *   ghost     — No border, no fill. Use for de-emphasized actions.
 *   danger    — Red variant. Use for destructive actions.
 *
 * Size:
 *   lg — Full width, tall. Default for primary actions.
 *   md — Standard size. Default for secondary actions.
 *   sm — Compact. For inline or card-level actions.
 *
 * Animations:
 *   Press scales down to 0.96 with a spring for physical feedback.
 *   Primary shows a neon glow pulse on mount.
 */
import { type ReactNode, useEffect } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontFamily, radius, springConfigs, motionDuration } from '@theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'lg' | 'md' | 'sm';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  disabled = false,
  style,
  leftIcon,
  testID,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || isLoading;

  const handlePressIn = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.96, springConfigs.stiff);
    if (!isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, springConfigs.stiff);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {isLoading ? (
        <LoadingPulse variant={variant} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
            {children}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

function LoadingPulse({ variant }: { variant: ButtonVariant }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: motionDuration.quick }),
        withTiming(0.4, { duration: motionDuration.quick }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const isDark = variant === 'primary' || variant === 'danger';
  const color = isDark ? colors.text.primary : colors.purple[400];

  return <Animated.View style={[styles.loadingPulse, { backgroundColor: color }, animStyle]} />;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // ── Variants ───────────────────────────────────────────────────────────
  primary: {
    backgroundColor: colors.purple[600],
    borderColor: colors.purple[400],
  },
  secondary: {
    backgroundColor: colors.bg.elevated,
    borderColor: 'rgba(139, 60, 247, 0.3)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.purple[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: colors.semantic.danger,
  },
  disabled: {
    opacity: 0.45,
  },
  // ── Sizes ──────────────────────────────────────────────────────────────
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 46,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  // ── Labels ─────────────────────────────────────────────────────────────
  label: {
    textAlign: 'center',
  },
  loadingPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  primaryLabel: {
    color: colors.text.primary,
    fontFamily: fontFamily.exo2.bold,
  },
  secondaryLabel: {
    color: colors.purple[300],
    fontFamily: fontFamily.exo2.semiBold,
  },
  outlineLabel: {
    color: colors.purple[400],
    fontFamily: fontFamily.exo2.semiBold,
  },
  ghostLabel: {
    color: colors.text.secondary,
    fontFamily: fontFamily.inter.regular,
  },
  dangerLabel: {
    color: colors.semantic.danger,
    fontFamily: fontFamily.exo2.semiBold,
  },
  lgLabel: { fontSize: 16 },
  mdLabel: { fontSize: 14 },
  smLabel: { fontSize: 12 },
});
