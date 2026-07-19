/**
 * src/components/avatar/AvatarDisplay.tsx
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useAvatarStore } from '@/store/avatar.store';
import { ParticleBurst } from './ParticleBurst';
import { colors, radius } from '@theme';

export const AvatarDisplay = () => {
  const { currentStage, getAvatarImage } = useAvatarStore();
  const themeColor = currentStage?.theme_color || colors.purple.neon;

  const [currentImage, setCurrentImage] = useState(getAvatarImage());
  const [oldImage, setOldImage] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition Shared Values
  const transitionProgress = useSharedValue(1); // 0 = old image showing, 1 = new image showing
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // When stage changes (evolution occurs!)
  useEffect(() => {
    const nextImage = getAvatarImage();
    if (nextImage !== currentImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOldImage(currentImage);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentImage(nextImage);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTransitioning(true);

      // Start transition animation
      transitionProgress.value = 0;
      transitionProgress.value = withTiming(
        1,
        {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        },
        (finished) => {
          if (finished) {
            // setIsTransitioning(false); // Can't call state setter safely directly in worklet without runOnJS, doing it simply
          }
        },
      );

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setOldImage(null);
      }, 900);
      return () => clearTimeout(timer);
    }
    return () => {}; // return empty cleanup function if no transition
  }, [currentStage]);

  // Idle Glow Animation Loop
  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // infinite
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const idleGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
    shadowColor: themeColor,
    backgroundColor: themeColor,
  }));

  // Old Image fade out and scale down
  const oldImageStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transitionProgress.value, [0, 1], [1, 0]),
      transform: [{ scale: interpolate(transitionProgress.value, [0, 1], [1, 0.9]) }],
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  // New Image fade in and scale up
  const newImageStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transitionProgress.value, [0, 1], [0, 1]),
      transform: [{ scale: interpolate(transitionProgress.value, [0, 1], [0.9, 1]) }],
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  // Radial Evolution Flash
  const flashStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transitionProgress.value, [0, 0.5, 1], [0, 0.8, 0]),
      transform: [{ scale: interpolate(transitionProgress.value, [0, 1], [0.5, 2]) }],
      backgroundColor: themeColor,
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: radius.full,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Idle Glow */}
      <Animated.View style={[styles.idleGlow, idleGlowStyle]} />

      <View style={styles.avatarWrapper}>
        {oldImage && <Animated.Image source={oldImage} style={[styles.avatar, oldImageStyle]} />}
        <Animated.Image source={currentImage} style={[styles.avatar, newImageStyle]} />
      </View>

      {/* Evolution Flash overlay */}
      {isTransitioning && <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />}

      {/* Particles during transition */}
      {isTransitioning && <ParticleBurst color={themeColor} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idleGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    mixBlendMode: 'screen',
  },
});
