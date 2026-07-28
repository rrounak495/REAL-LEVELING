import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { useRewardStore, type AnyRewardEvent } from '@/store/reward.store';

/**
 * Global overlay layer to present queued reward events sequentially.
 */
export function RewardOverlay() {
  const { queue, isAnimating, setAnimating, shiftReward } = useRewardStore();
  const currentEvent = queue.length > 0 ? queue[0] : null;

  useEffect(() => {
    if (currentEvent && !isAnimating) {
      setAnimating(true);
    }
  }, [currentEvent, isAnimating, setAnimating]);

  if (!currentEvent || !isAnimating) return null;

  const handleAnimationComplete = () => {
    shiftReward();
  };

  if (currentEvent.type === 'XP') {
    return <XpRewardAnimation event={currentEvent} onComplete={handleAnimationComplete} />;
  }

  if (currentEvent.type === 'LEVEL_UP') {
    return <LevelUpAnimation event={currentEvent} onComplete={handleAnimationComplete} />;
  }

  return null;
}

function XpRewardAnimation({
  event,
  onComplete,
}: {
  event: AnyRewardEvent;
  onComplete: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(
        1200,
        withTiming(0, { duration: 400 }, (finished) => {
          if (finished) runOnJS(onComplete)();
        }),
      ),
    );

    translateY.value = withSequence(
      withSpring(0, { damping: 12 }),
      withDelay(1200, withTiming(-30, { duration: 400 })),
    );
  }, [event.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (event.type !== 'XP') return null;

  return (
    <View
      className="items-center justify-center"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Animated.View
        className="bg-theme-bg-dark/90 px-6 py-3 rounded-full border border-theme-neon-purple/30"
        style={animatedStyle}
      >
        <Text className="text-theme-neon-purple font-rajdhani-bold text-2xl tracking-widest">
          +{event.payload.amount} XP
        </Text>
      </Animated.View>
    </View>
  );
}

function LevelUpAnimation({
  event,
  onComplete,
}: {
  event: AnyRewardEvent;
  onComplete: () => void;
}) {
  if (event.type !== 'LEVEL_UP') return null;

  useEffect(() => {
    // Auto dismiss after 3 seconds for a smooth flow, or user can tap.
    // Given requirements, it should not interrupt flow unnecessarily but feel premium.
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [event.id]);

  return (
    <Modal transparent animationType="none" visible={true} onRequestClose={onComplete}>
      <View className="flex-1 justify-center items-center bg-theme-bg-void/90 px-6">
        <Animated.View
          className="absolute inset-0 bg-theme-bg-void opacity-60"
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
        />

        <Animated.View
          className="items-center w-full"
          entering={ZoomIn.duration(600).springify()}
          exiting={FadeOut.duration(300)}
        >
          <Animated.Text
            className="text-theme-neon-purple font-rajdhani-bold text-5xl tracking-widest text-center"
            entering={SlideInDown.delay(200).duration(500)}
          >
            LEVEL UP
          </Animated.Text>

          <Animated.View
            className="flex-row items-center mt-4"
            entering={SlideInDown.delay(400).duration(500)}
          >
            <Text className="text-theme-text-muted font-exo-medium text-xl mr-3">
              {event.payload.oldLevel}
            </Text>
            <Text className="text-theme-neon-purple text-2xl font-bold">→</Text>
            <Text className="text-theme-text font-exo-bold text-3xl ml-3">
              {event.payload.newLevel}
            </Text>
          </Animated.View>

          <Animated.Text
            className="text-theme-text-muted font-exo text-sm text-center mt-8"
            entering={SlideInDown.delay(600).duration(500)}
          >
            Overflow XP applied: {event.payload.overflowXp}
          </Animated.Text>
        </Animated.View>
      </View>
    </Modal>
  );
}
