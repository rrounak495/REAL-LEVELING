/**
 * src/components/ui/GlobalPopupQueue.tsx
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { usePopupStore } from '@/store/popup.store';
import { colors, fontFamily, radius, spacing } from '@theme';

export function GlobalPopupQueue() {
  const { queue, isDisplaying, dequeue } = usePopupStore();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(20);

  // We only show the first item in the queue. When it's dequeued, the component re-renders.
  const currentPopup = queue[0];

  const dismissPopup = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.9, { duration: 200 });
    translateY.value = withTiming(20, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(dequeue)();
      }
    });
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (isDisplaying && currentPopup) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });

      // Auto dismiss after 3 seconds
      timeout = setTimeout(() => {
        dismissPopup();
      }, 3000);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
      translateY.value = withTiming(20, { duration: 200 });
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisplaying, currentPopup]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  if (!isDisplaying || !currentPopup) return null;

  // Determine styles based on type
  let accentColor: string = colors.purple.neon;
  let icon = '✨';

  if (currentPopup.type === 'coin_gain') {
    accentColor = colors.semantic.premiumNeon;
    icon = '🪙';
  } else if (currentPopup.type === 'gem_gain') {
    accentColor = '#00FFFF';
    icon = '💎';
  } else if (currentPopup.type === 'achievement_unlock') {
    accentColor = colors.semantic.legendaryNeon;
    icon = '🏆';
  } else if (currentPopup.type === 'level_up') {
    accentColor = colors.semantic.successNeon;
    icon = '📈';
  } else if (currentPopup.type === 'rank_up') {
    accentColor = colors.semantic.dangerNeon;
    icon = '🔥';
  } else if (currentPopup.type === 'item_unlock') {
    accentColor = '#00FF88'; // Vibrant green/cyan for items
    icon = '🔓';
  } else if (currentPopup.type === 'evolution') {
    accentColor = '#FFD700'; // Gold flash for evolution
    icon = '⚡';
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Pressable style={styles.touchableArea} onPress={dismissPopup}>
        <Animated.View style={[styles.popupContainer, animatedStyle, { borderColor: accentColor }]}>
          {/* Background Glow */}
          <View style={[styles.glow, { backgroundColor: accentColor }]} />

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: accentColor }]}>{currentPopup.title}</Text>

              {currentPopup.subtitle && (
                <Text style={styles.subtitle}>{currentPopup.subtitle}</Text>
              )}

              {currentPopup.amount && <Text style={styles.amount}>+{currentPopup.amount}</Text>}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60, // Avoid safe area notch
    zIndex: 9999,
  },
  touchableArea: {
    width: '90%',
    maxWidth: 400,
  },
  popupContainer: {
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.componentLg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.componentMd,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.primary,
  },
  amount: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 20,
    color: colors.text.primary,
    marginTop: 4,
  },
});
