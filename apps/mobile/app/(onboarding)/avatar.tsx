import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { AvatarAssets } from '@/store/avatar.store';
import { ParticleBurst } from '@/components/avatar/ParticleBurst';
import { colors, fontFamily, radius } from '@theme';
import { HunterMaleIcon, HunterFemaleIcon } from '@/components/ui/OnboardingIcons';

// ── Step 0: Gender Selection ───────────────────────────────────────────────
function GenderStep({ onNext }: { onNext: () => void }) {
  const { gender, setGender } = useOnboardingStore();

  const handleNext = () => {
    if (gender) onNext();
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Hunter</Text>
      <Text style={styles.stepSubtitle}>Your journey begins here.</Text>

      <View style={styles.genderRow}>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: gender === 'male' }}
          style={[styles.genderCard, gender === 'male' && styles.genderCardSelected]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setGender('male');
          }}
        >
          <HunterMaleIcon
            color={gender === 'male' ? colors.purple.neon : colors.text.secondary}
            size={72}
          />
          <Text style={[styles.genderLabel, gender === 'male' && styles.genderLabelSelected]}>
            Male
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: gender === 'female' }}
          style={[styles.genderCard, gender === 'female' && styles.genderCardSelected]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setGender('female');
          }}
        >
          <HunterFemaleIcon
            color={gender === 'female' ? colors.purple.neon : colors.text.secondary}
            size={72}
          />
          <Text style={[styles.genderLabel, gender === 'female' && styles.genderLabelSelected]}>
            Female
          </Text>
        </Pressable>
      </View>

      <Button disabled={!gender} size="lg" style={styles.stepBtn} onPress={handleNext}>
        Preview →
      </Button>
    </Animated.View>
  );
}

// ── Step 1: Preview + Confirm ────────────────────────────────────────────────
function PreviewStep({ onBack }: { onBack: () => void }) {
  const { gender } = useOnboardingStore();

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/goals');
  };

  // Get Level 1 avatar for the selected gender
  // @ts-ignore
  const avatarImage = gender ? AvatarAssets[gender][1] : AvatarAssets.male[1];

  const scale = useSharedValue(0.97);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.97, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(800)} exiting={FadeOut} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Hunter</Text>
      <Text style={styles.stepSubtitle}>Looking good, Hunter. Ready to begin?</Text>

      <View style={styles.heroPreviewContainer}>
        {/* Glow Background */}
        <Animated.View style={[styles.heroGlow, animatedGlowStyle]} />

        {/* Particle Effect Overlay */}
        <View style={StyleSheet.absoluteFill}>
          <ParticleBurst color={colors.purple.neon} />
        </View>

        {/* Breathing Avatar */}
        <Animated.Image
          entering={SlideInDown.duration(1000).springify()}
          resizeMode="cover"
          source={avatarImage}
          style={[styles.heroAvatarImage, animatedImageStyle]}
        />

        {/* Vignette Overlay for premium depth */}
        <View style={styles.heroVignette} />
      </View>

      <View style={styles.navRow}>
        <Button size="md" style={styles.navBtn} variant="outline" onPress={onBack}>
          ← Back
        </Button>
        <Button size="md" style={styles.navBtn} onPress={handleConfirm}>
          Begin Your Journey →
        </Button>
      </View>
    </Animated.View>
  );
}

// ── Main Avatar Screen ────────────────────────────────────────────────────────
export default function AvatarScreen() {
  const [activeStep, setActiveStep] = useState<0 | 1>(0);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <ProgressStepper currentStep={1} totalSteps={6} />
          <Text style={styles.stepCounter}>Choose Your Hunter — {activeStep + 1} / 2</Text>
        </View>

        {activeStep === 0 && <GenderStep onNext={() => setActiveStep(1)} />}
        {activeStep === 1 && <PreviewStep onBack={() => setActiveStep(0)} />}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  topBar: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  stepCounter: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  stepContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  stepTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 30,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    justifyContent: 'center',
  },
  genderCard: {
    width: 140,
    height: 140,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  genderCardSelected: {
    borderColor: colors.purple[400],
    backgroundColor: 'rgba(107, 47, 204, 0.18)',
  },
  genderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  genderLabel: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  genderLabelSelected: {
    color: colors.purple[300],
  },
  heroPreviewContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.4)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.purple.neon,
    opacity: 0.5,
    shadowColor: colors.purple.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  heroAvatarImage: {
    width: '100%',
    height: '100%',
  },
  heroVignette: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius['2xl'],
  },
  stepBtn: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  navBtn: {
    flex: 1,
  },
});
