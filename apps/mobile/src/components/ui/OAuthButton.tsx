/**
 * src/components/ui/OAuthButton.tsx
 *
 * OAuth sign-in buttons for Google and Apple.
 * Styled to feel premium but platform-correct.
 *
 * Note: Apple Sign In is required on iOS for apps offering other social logins.
 * For Android MVP, only Google is required; Apple is shown but can be
 * hidden with `platform="android"` prop.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, fontFamily, radius, springConfigs } from '@theme';

type OAuthProvider = 'google' | 'apple';

interface OAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  isLoading?: boolean;
}

const PROVIDER_CONFIG: Record<
  OAuthProvider,
  { label: string; icon: string; bg: string; border: string; textColor: string }
> = {
  google: {
    label: 'Continue with Google',
    icon: 'G',
    bg: colors.bg.elevated,
    border: 'rgba(255,255,255,0.12)',
    textColor: colors.text.primary,
  },
  apple: {
    label: 'Continue with Apple',
    icon: '',
    bg: colors.bg.elevated,
    border: 'rgba(255,255,255,0.12)',
    textColor: colors.text.primary,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OAuthButton({ provider, onPress, isLoading = false }: OAuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={config.label}
      accessibilityRole="button"
      disabled={isLoading}
      style={[
        animatedStyle,
        styles.button,
        { backgroundColor: config.bg, borderColor: config.border },
        isLoading && styles.disabled,
      ]}
      onPress={onPress}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.97, springConfigs.stiff);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1, springConfigs.stiff);
      }}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.iconText, { color: config.textColor }]}>{config.icon}</Text>
      </View>
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 22,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 17,
    fontFamily: fontFamily.exo2.bold,
  },
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
  },
});
