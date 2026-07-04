/**
 * src/features/progression/components/RankUpModal.tsx
 *
 * A full-screen overlay for Rank Ups.
 */
import { useEffect } from 'react';
import { StyleSheet, Text, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily } from '@theme';
import { Button } from '@/components/ui/Button';

interface RankUpModalProps {
  visible: boolean;
  rank: string;
  onClose: () => void;
}

export function RankUpModal({ visible, rank, onClose }: RankUpModalProps) {
  useEffect(() => {
    if (visible) {
      // Multiple haptics for dramatic effect on rank up
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
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
          <Text style={styles.title}>RANK UP</Text>
          <Text style={styles.rankText}>{rank.toUpperCase()} RANK</Text>

          <Animated.View entering={SlideInDown.delay(500).springify()}>
            <Button size="lg" style={styles.button} variant="primary" onPress={onClose}>
              Accept Power
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
    backgroundColor: 'rgba(5, 5, 10, 0.98)', // Very deep void background
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
    fontSize: 32,
    color: colors.purple[400],
    textShadowColor: colors.purple[500],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 12,
    marginBottom: 8,
  },
  rankText: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 64,
    color: colors.text.primary,
    marginBottom: 64,
    textAlign: 'center',
    letterSpacing: 4,
  },
  button: {
    minWidth: 200,
  },
});
