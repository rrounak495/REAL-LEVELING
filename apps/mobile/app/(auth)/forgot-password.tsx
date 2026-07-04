/**
 * app/(auth)/forgot-password.tsx — Forgot Password Screen
 */
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { colors, fontFamily } from '@theme';

export default function ForgotPasswordScreen() {
  const { form, submit, isLoading, serverError, isSuccess } = useForgotPassword();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.successEmoji}>✉️</Text>
          <Text style={styles.title}>Reset Link Sent</Text>
          <Text style={styles.body}>
            Check your email for a link to reset your password.
            {'\n\n'}
            If you don't receive it within a few minutes, check your spam folder.
          </Text>
          <Button
            size="lg"
            style={styles.btn}
            variant="primary"
            onPress={() => router.replace('/(auth)/login')}
          >
            Back to Sign In
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Button size="sm" style={styles.backBtn} variant="ghost" onPress={() => router.back()}>
          ← Back
        </Button>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.body}>Enter your email and we'll send you a reset link.</Text>

        <GlassCard style={styles.card}>
          {serverError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          )}

          <AppTextInput
            errorMessage={errors.email?.message}
            keyboardType="email-address"
            label="Email"
            returnKeyType="done"
            testID="forgot-email-input"
            value={watch('email') ?? ''}
            onChangeText={(t) => setValue('email', t)}
            onSubmitEditing={handleSubmit(submit)}
          />

          <View style={styles.spacing} />

          <Button
            isLoading={isLoading}
            size="lg"
            testID="forgot-submit-btn"
            onPress={handleSubmit(submit)}
          >
            Send Reset Link
          </Button>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    marginTop: 0,
  },
  spacing: {
    height: 12,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.semantic.danger,
  },
  errorBannerText: {
    color: colors.semantic.danger,
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
  },
  successEmoji: {
    fontSize: 64,
  },
  btn: {
    width: '100%',
    marginTop: 8,
  },
});
