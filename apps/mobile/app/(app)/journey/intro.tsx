import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { colors, fontFamily } from '@theme';

export default function JourneyIntroScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => {
        router.replace('/(app)/(tabs)/');
      }, 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <ScreenContainer>
      <StatusBar hidden style="light" />
      <View style={styles.center}>
        <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.systemText}>
          SYSTEM
        </Animated.Text>

        <View style={styles.logContainer}>
          {step >= 0 && (
            <Animated.Text entering={FadeIn.delay(200)} style={styles.logText}>
              &gt; Analyzing Hunter...
            </Animated.Text>
          )}
          {step >= 1 && (
            <Animated.Text entering={FadeIn} style={styles.logText}>
              &gt; Generating Journey...
            </Animated.Text>
          )}
          {step >= 2 && (
            <Animated.Text
              entering={FadeIn}
              style={[styles.logText, { color: colors.semantic.success }]}
            >
              &gt; Journey Created.
            </Animated.Text>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.void,
    padding: 32,
  },
  systemText: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.purple[400],
    letterSpacing: 4,
    marginBottom: 40,
  },
  logContainer: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 300,
  },
  logText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 16,
    color: colors.text.muted,
    marginBottom: 16,
  },
});
