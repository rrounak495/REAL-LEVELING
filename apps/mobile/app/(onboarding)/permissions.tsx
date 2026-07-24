/**
 * app/(onboarding)/permissions.tsx — Step 5: Notification Permission + Final Submit
 *
 * The final onboarding step:
 * 1. Requests notification permission from the OS
 * 2. Commits ALL onboarding data to Supabase:
 *    - profile row (username, display_name)
 *    - avatar_config row
 *    - user_skills rows for selected skills
 * 3. Updates user_metadata.onboarding_completed = true via Supabase Auth
 * 4. Redirects to the main app
 */
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { repositories } from '@/db/repositories';
import { authService } from '@/features/auth/services';
import { getCurrentUserId } from '@lib/supabase';
import { colors, fontFamily } from '@theme';
import { BellPremiumIcon } from '@/components/ui/OnboardingIcons';

export default function PermissionsScreen() {
  const onboarding = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    onboarding.setNotificationsGranted(granted);
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await authService.getSession();
      const userId = data?.session?.user?.id;
      const isDevUser = __DEV__ && data?.session?.user?.email?.endsWith('@real-leveling.dev');

      if (!userId) {
        Alert.alert('Session Expired', 'Please sign in again.');
        router.replace('/(auth)/welcome');
        return;
      }

      if (!isDevUser) {
        const profileResult = await repositories.profiles.upsertProfile(userId, {
          id: userId,
          username: onboarding.username.trim().toLowerCase(),
          display_name: onboarding.displayName.trim() || onboarding.username.trim(),
          fitness_goal: onboarding.fitnessGoal || 'general_fitness',
          fitness_experience: onboarding.fitnessExperience || 'beginner',
          training_location: onboarding.trainingLocation || 'home',
          available_daily_time: onboarding.availableDailyTime || 30,
        } as any);
        if (!profileResult.success) {
          console.error('[Onboarding] Profile Creation Failed:', profileResult.error);
          Alert.alert('Error', `Could not create your profile: ${profileResult.error.message}`);
          return;
        }

        // 2. Create avatar config (store gender in base_model)
        const gender = onboarding.gender || 'male';
        const avatarResult = await repositories.avatar.upsertAvatarConfig(userId, {
          base_model: gender,
        });
        if (!avatarResult.success) {
          console.error('[Onboarding] Avatar Config Failed:', avatarResult.error);
          Alert.alert('Error', `Could not save your avatar: ${avatarResult.error.message}`);
          return;
        }

        // 3. Track initial skills
        for (const skillId of onboarding.selectedSkillIds) {
          const skillResult = await repositories.userSkills.trackSkill(userId, skillId);
          if (!skillResult.success) {
            console.error(
              `[Onboarding] Skill Tracking Failed for skill ${skillId}:`,
              skillResult.error,
            );
          }
        }
      }

      // 4. Mark onboarding complete in Supabase Auth via authService
      await authService.updateUser({
        data: { onboarding_completed: true },
      });

      // 5. Reset transient stores
      onboarding.reset();

      // 6. Navigate to main app
      router.replace('/(app)/(tabs)/');
    } catch (error) {
      console.error('[Onboarding] Unexpected Error:', error);
      Alert.alert(
        'Something went wrong',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitScale = useSharedValue(1);

  useEffect(() => {
    // Hero pulse for the final submit button
    // eslint-disable-next-line react-hooks/immutability
    submitScale.value = withRepeat(
      withSequence(withTiming(1.02, { duration: 1500 }), withTiming(1, { duration: 1500 })),
      -1,
      true,
    );
  }, [submitScale]);

  const submitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <ProgressStepper currentStep={5} totalSteps={6} />

          <View style={styles.header}>
            <Text style={styles.step}>STEP 6 OF 6</Text>
            <Text style={styles.title}>One Last Thing</Text>
            <Text style={styles.subtitle}>
              Enable notifications to get reminded about your daily quests and milestone events.
            </Text>
          </View>

          {/* Notification card */}
          <GlassCard style={styles.notifCard} variant="elevated">
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <BellPremiumIcon color={colors.purple.neon} size={80} />
            </View>
            <Text style={styles.notifTitle}>Stay in the Game</Text>
            <Text style={styles.notifBody}>
              Get daily quest reminders, XP milestone alerts, and level-up celebrations. You can
              change this anytime in Settings.
            </Text>

            {permissionGranted === null ? (
              <Button
                size="md"
                style={styles.notifBtn}
                variant="secondary"
                onPress={requestNotifications}
              >
                Enable Notifications
              </Button>
            ) : permissionGranted ? (
              <View style={styles.grantedBadge}>
                <Text style={styles.grantedText}>✓ Notifications enabled</Text>
              </View>
            ) : (
              <View style={styles.deniedBadge}>
                <Text style={styles.deniedText}>Notifications declined — you can enable later</Text>
              </View>
            )}
          </GlassCard>

          {/* Summary preview */}
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Onboarding Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hunter Name</Text>
              <Text style={styles.summaryValue}>@{onboarding.username || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Goals:</Text>
              <Text style={styles.summaryValue}>
                {onboarding.fitnessGoal ? onboarding.fitnessGoal.replace('_', ' ') : 'None'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Skills</Text>
              <Text style={styles.summaryValue}>{onboarding.selectedSkillIds.length} selected</Text>
            </View>
          </GlassCard>
        </ScrollView>

        <Animated.View style={[styles.footer, submitStyle]}>
          <Button
            isLoading={isSubmitting}
            size="lg"
            testID="start-journey-btn"
            onPress={submitOnboarding}
          >
            🚀 Begin My Journey
          </Button>
          {permissionGranted === null && (
            <Button
              isLoading={isSubmitting}
              size="sm"
              style={styles.skipBtn}
              variant="ghost"
              onPress={submitOnboarding}
            >
              Skip Notifications
            </Button>
          )}
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  step: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  notifCard: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 24,
  },
  notifEmoji: { fontSize: 48, marginBottom: 12 },
  notifTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  notifBody: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  notifBtn: {
    width: '100%',
  },
  grantedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.semantic.success,
  },
  grantedText: {
    color: colors.semantic.success,
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
  },
  deniedBadge: {
    backgroundColor: 'rgba(107, 47, 204, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  deniedText: {
    color: colors.text.muted,
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.muted,
  },
  summaryValue: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.primary,
  },
  footer: {
    paddingBottom: 32,
    gap: 8,
  },
  skipBtn: {
    alignSelf: 'center',
  },
});
