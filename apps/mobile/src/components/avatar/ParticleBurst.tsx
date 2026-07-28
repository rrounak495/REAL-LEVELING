/**
 * src/components/avatar/ParticleBurst.tsx
 */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface ParticleProps {
  color: string;
  onComplete?: () => void;
}

const NUM_PARTICLES = 12;

const Particle = ({ color, index, total }: { color: string; index: number; total: number }) => {
  const distance = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  const angle = (index / total) * Math.PI * 2;

  useEffect(() => {
    distance.value = withTiming(100 + Math.random() * 50, {
      duration: 1000 + Math.random() * 500,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withDelay(500, withTiming(0, { duration: 500 }));
    scale.value = withTiming(1.5, { duration: 1000 });
  }, [distance, opacity, scale]);

  const style = useAnimatedStyle(() => {
    const translateX = Math.cos(angle) * distance.value;
    const translateY = Math.sin(angle) * distance.value;

    return {
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: color,
      opacity: opacity.value,
      transform: [{ translateX }, { translateY }, { scale: scale.value }],
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
    };
  });

  return <Animated.View style={style} />;
};

export const ParticleBurst = ({ color, onComplete }: ParticleProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={styles.center}>
        {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
          <Particle key={i} color={color} index={i} total={NUM_PARTICLES} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
