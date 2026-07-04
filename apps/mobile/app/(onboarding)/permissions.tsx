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
import { StyleSheet, Text, View, Alert } from 'react-native';
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
import { useAvatarBuilderStore } from '@/features/avatar/store';
import { repositories } from '@/db/repositories';
import { supabase } from '@lib/supabase';
import { getCurrentUserId } from '@lib/supabase';
import { colors, fontFamily } from '@theme';

export default function PermissionsScreen() {
  const onboarding = useOnboardingStore();
  const avatarDraft = useAvatarBuilderStore((s) => s.draft);
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
      const userId = await getCurrentUserId();
      if (!userId) {
        Alert.alert('Session Expired', 'Please sign in again.');
        router.replace('/(auth)/welcome');
        return;
      }

      // 1. Create profile
      const profileResult = await repositories.profiles.upsertProfile(userId, {
        id: userId,
        username: onboarding.username.trim().toLowerCase(),
        display_name: onboarding.displayName.trim() || onboarding.username.trim(),
      });
      if (!profileResult.success) {
        Alert.alert('Error', 'Could not create your profile. Please try again.');
        return;
      }

      // 2. Create avatar config
      await repositories.avatar.upsertAvatarConfig(userId, {
        base_model: avatarDraft.base_model,
        hair_id: avatarDraft.hair_id,
        hair_color: avatarDraft.hair_color,
        eyes_id: avatarDraft.eyes_id,
        eye_color: avatarDraft.eye_color,
        outfit_id: avatarDraft.outfit_id,
        aura_id: avatarDraft.aura_id,
        accessory_id: avatarDraft.accessory_id,
      });

      // 3. Track initial skills
      for (const skillId of onboarding.selectedSkillIds) {
        await repositories.userSkills.trackSkill(userId, skillId);
      }

      // 4. Mark onboarding complete in Supabase user metadata
      await supabase.auth.updateUser({
        data: { onboarding_completed: true },
      });

      // 5. Reset transient stores
      onboarding.reset();
      useAvatarBuilderStore.getState().resetDraft();

      // 6. Navigate to main app
      router.replace('/(app)/(tabs)/');
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
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
        <ProgressStepper currentStep={4} totalSteps={5} />

        <Animated.View entering={FadeIn} style={styles.content}>
          <Text style={styles.step}>STEP 5 OF 5</Text>
          <Text style={styles.title}>One Last Thing</Text>
          <Text style={styles.subtitle}>
            Enable notifications to get reminded about your daily quests and milestone events.
          </Text>

          {/* Notification card */}
          <GlassCard style={styles.notifCard} variant="elevated">
            <Text style={styles.notifEmoji}>🔔</Text>
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
              <Text style={styles.summaryLabel}>Goals</Text>
              <Text style={styles.summaryValue}>{onboarding.selectedGoalIds.length} selected</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Skills</Text>
              <Text style={styles.summaryValue}>{onboarding.selectedSkillIds.length} selected</Text>
            </View>
          </GlassCard>
        </Animated.View>

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
  step: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
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
