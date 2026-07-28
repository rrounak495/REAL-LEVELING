/**
 * app/(auth)/welcome.tsx — Welcome / Splash Entry Screen
 *
 * The first screen users see. Features:
 * - App logo + brand name with fade-in animation
 * - Tagline with staggered slide-up animation
 * - Primary CTA: "Begin Your Journey" → Register
 * - Secondary: "I already have an account" → Login
 *
 * This is the single most important screen for brand impression.
 */
import { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, motionDuration } from '@theme';
import { authService } from '@/features/auth/services';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  // Staggered entrance animations
  const logoOpacity = useSharedValue(0);
  const logoTranslate = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslate = useSharedValue(16);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslate = useSharedValue(20);
  const orbScale = useSharedValue(0.95);

  useEffect(() => {
    // Logo: 0ms
    // eslint-disable-next-line react-hooks/immutability
    logoOpacity.value = withTiming(1, { duration: motionDuration.dramatic });
    // eslint-disable-next-line react-hooks/immutability
    logoTranslate.value = withTiming(0, { duration: motionDuration.dramatic });
    // Tagline: 400ms delay
    // eslint-disable-next-line react-hooks/immutability
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: motionDuration.slow }));
    // eslint-disable-next-line react-hooks/immutability
    taglineTranslate.value = withDelay(400, withTiming(0, { duration: motionDuration.slow }));
    // Buttons: 700ms delay
    // eslint-disable-next-line react-hooks/immutability
    buttonsOpacity.value = withDelay(700, withTiming(1, { duration: motionDuration.slow }));
    // eslint-disable-next-line react-hooks/immutability
    buttonsTranslate.value = withDelay(700, withTiming(0, { duration: motionDuration.slow }));

    // Orb float
    // eslint-disable-next-line react-hooks/immutability
    orbScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 4000 }), withTiming(0.95, { duration: 4000 })),
      -1,
      true,
    );
  }, [
    logoOpacity,
    logoTranslate,
    taglineOpacity,
    taglineTranslate,
    buttonsOpacity,
    buttonsTranslate,
    orbScale,
  ]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslate.value }],
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslate.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslate.value }],
  }));

  return (
    <ScreenContainer>
      {/* ── Hero Section ── */}
      <View style={styles.heroSection}>
        {/* Decorative background glow */}
        <Animated.View pointerEvents="none" style={[styles.glowOrb, orbStyle]} />

        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* Rank glyph */}
          <View style={styles.rankBadge}>
            <Text style={styles.rankGlyph}>E</Text>
          </View>
          <Text style={styles.appName}>REAL LEVELING</Text>
          <View style={styles.nameDivider} />
        </Animated.View>

        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>Your real life.</Text>
          <Text style={styles.taglineAccent}>Gamified.</Text>
          <Text style={styles.subtitle}>
            Build habits. Gain XP. Evolve your Hunter.{'\n'}
            Level up — for real.
          </Text>
        </Animated.View>
      </View>

      {/* ── CTA Section ── */}
      <Animated.View style={[styles.ctaSection, buttonsStyle]}>
        <Button size="lg" variant="primary" onPress={() => router.push('/(auth)/register')}>
          Begin Your Journey
        </Button>

        <Button
          size="md"
          style={styles.loginButton}
          variant="ghost"
          onPress={() => router.push('/(auth)/login')}
        >
          I already have an account
        </Button>

        {__DEV__ && (
          <Button
            size="md"
            style={Object.assign({}, styles.loginButton, { borderColor: colors.cyan.neon, borderWidth: 1 })}
            variant="ghost"
            onPress={async () => {
              await authService.signInWithPassword({ email: 'testhunter@real-leveling.dev' });
            }}
          >
            Continue as Test Hunter (Dev)
          </Button>
        )}

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink} onPress={() => router.push('/legal/terms')}>
            Terms & Conditions
          </Text>{' '}
          and{' '}
          <Text style={styles.termsLink} onPress={() => router.push('/legal/privacy')}>
            Privacy Policy
          </Text>.
        </Text>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
  },
  glowOrb: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 60, 247, 0.12)',
    top: height * 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  rankBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.purple[800],
    borderWidth: 2,
    borderColor: colors.purple[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rankGlyph: {
    fontSize: 36,
    fontFamily: fontFamily.rajdhani.bold,
    color: colors.purple[300],
  },
  appName: {
    fontSize: 32,
    fontFamily: fontFamily.rajdhani.bold,
    color: colors.text.primary,
    letterSpacing: 4,
    textAlign: 'center',
  },
  nameDivider: {
    width: 48,
    height: 2,
    backgroundColor: colors.purple[500],
    marginTop: 10,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 42,
    fontFamily: fontFamily.rajdhani.bold,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 48,
  },
  taglineAccent: {
    fontSize: 42,
    fontFamily: fontFamily.rajdhani.bold,
    color: colors.purple[400],
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  loginButton: {
    marginTop: 4,
  },
  termsText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 17,
  },
  termsLink: {
    color: colors.purple[400],
  },
});
