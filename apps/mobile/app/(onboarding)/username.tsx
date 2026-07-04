/**
 * app/(onboarding)/username.tsx — Step 1: Username Selection
 */
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { supabase } from '@lib/supabase';
import { colors, fontFamily } from '@theme';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export default function UsernameScreen() {
  const { username, displayName, setUsername, setDisplayName } = useOnboardingStore();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (value: string): string | null => {
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must be at most 20 characters';
    if (!USERNAME_REGEX.test(value)) return 'Only letters, numbers, and underscores allowed';
    return null;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(null);
  };

  const checkUsernameAvailability = async (): Promise<boolean> => {
    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameError(validationError);
      return false;
    }

    setIsCheckingUsername(true);
    try {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('username', username.toLowerCase());

      if (count && count > 0) {
        setUsernameError('This username is already taken. Try another.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return false;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return true;
    } catch {
      setUsernameError('Could not check username. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    const isAvailable = await checkUsernameAvailability();
    setIsLoading(false);
    if (isAvailable) {
      router.push('/(onboarding)/avatar');
    }
  };

  const canContinue = username.trim().length >= 3 && !isCheckingUsername;

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <ProgressStepper currentStep={0} totalSteps={5} />

          <View style={styles.header}>
            <Text style={styles.step}>STEP 1 OF 5</Text>
            <Text style={styles.title}>Choose Your Hunter Name</Text>
            <Text style={styles.subtitle}>
              This is your identity in the Hunter World. Choose wisely — it cannot be changed
              easily.
            </Text>
          </View>

          <GlassCard>
            <AppTextInput
              autoCapitalize="none"
              errorMessage={usernameError ?? undefined}
              label="Username"
              returnKeyType="done"
              testID="username-input"
              value={username}
              onChangeText={handleUsernameChange}
              onSubmitEditing={handleContinue}
            />

            <View style={styles.spacing} />

            <AppTextInput
              autoCapitalize="words"
              label="Display Name (optional)"
              returnKeyType="done"
              testID="displayname-input"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <View style={styles.hints}>
              <Text style={styles.hint}>• 3–20 characters</Text>
              <Text style={styles.hint}>• Letters, numbers, and underscores only</Text>
              <Text style={styles.hint}>• Unique across all Hunters</Text>
            </View>
          </GlassCard>

          <View style={styles.spacer} />

          {isCheckingUsername && (
            <View style={styles.checking}>
              <ActivityIndicator color={colors.purple[400]} size="small" />
              <Text style={styles.checkingText}>Checking availability…</Text>
            </View>
          )}

          <Button
            disabled={!canContinue}
            isLoading={isLoading}
            size="lg"
            testID="username-continue-btn"
            onPress={handleContinue}
          >
            Confirm Hunter Name
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginTop: 28,
    marginBottom: 24,
  },
  step: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
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
  },
  spacing: {
    height: 12,
  },
  hints: {
    marginTop: 16,
    gap: 4,
  },
  hint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 20,
  },
  spacer: {
    flex: 1,
  },
  checking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  checkingText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.muted,
  },
});
