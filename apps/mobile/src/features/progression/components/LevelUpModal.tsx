/**
 * src/features/progression/components/LevelUpModal.tsx
 *
 * A full-screen overlay for Level Ups.
 */
import { useEffect } from 'react';
import { StyleSheet, Text, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily } from '@theme';
import { Button } from '@/components/ui/Button';

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ visible, level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={styles.overlay}
      >
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.content}>
          <Text style={styles.title}>LEVEL UP</Text>
          <Text style={styles.levelText}>{level}</Text>

          <Animated.View entering={SlideInDown.delay(300).springify()}>
            <Button size="lg" style={styles.button} variant="primary" onPress={onClose}>
              Continue
            </Button>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 10, 0.95)', // Deep void background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 48,
    color: colors.semantic.warning, // Gold/Yellow for level up
    textShadowColor: 'rgba(234, 179, 8, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 8,
    marginBottom: 16,
  },
  levelText: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 120,
    color: colors.text.primary,
    marginBottom: 64,
  },
  button: {
    minWidth: 200,
  },
});
