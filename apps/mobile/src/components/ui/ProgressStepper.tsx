/**
 * src/components/ui/ProgressStepper.tsx
 *
 * Visual step progress indicator for multi-step flows (onboarding).
 * Renders a row of dots/bars — filled for completed, pulsing for active, dim for future.
 */
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors, motionDuration } from '@theme';

interface ProgressStepperProps {
  totalSteps: number;
  currentStep: number;
}

function StepDot({ state }: { state: 'done' | 'active' | 'future' }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (state === 'active') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: motionDuration.slow }),
          withTiming(1, { duration: motionDuration.slow }),
        ),
        -1,
        false,
      );
    } else {
      opacity.value = 1;
    }
  }, [state, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const dotStyle =
    state === 'done' ? styles.done : state === 'active' ? styles.active : styles.future;

  const sizeStyle = state === 'active' ? styles.activeLarge : styles.small;

  return <Animated.View style={[styles.dot, dotStyle, sizeStyle, animStyle]} />;
}

export function ProgressStepper({ totalSteps, currentStep }: ProgressStepperProps) {
  return (
    <View accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}`} style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'future';
        return <StepDot key={i} state={state} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 999,
  },
  small: {
    width: 8,
    height: 8,
  },
  activeLarge: {
    width: 24,
    height: 8,
  },
  done: {
    backgroundColor: colors.purple[600],
  },
  active: {
    backgroundColor: colors.purple[400],
  },
  future: {
    backgroundColor: colors.bg.overlay,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.25)',
  },
});
