/**
 * app/(auth)/register.tsx — Registration Screen
 */
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { OAuthButton } from '@/components/ui/OAuthButton';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { colors, fontFamily } from '@theme';

export default function RegisterScreen() {
  const { form, submit, isLoading, serverError, isSuccess } = useRegister();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>📬</Text>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successBody}>
            We sent a confirmation link to{'\n'}
            <Text style={styles.successEmail}>{watch('email')}</Text>
            {'\n\n'}Open the link to activate your account, then sign in.
          </Text>
          <Button
            size="lg"
            style={styles.successBtn}
            variant="primary"
            onPress={() => router.replace('/(auth)/login')}
          >
            Go to Sign In
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Button size="sm" style={styles.backBtn} variant="ghost" onPress={() => router.back()}>
              ← Back
            </Button>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Your legend begins here.</Text>
          </View>

          <GlassCard style={styles.card}>
            {serverError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{serverError}</Text>
              </View>
            )}

            <Animated.View entering={FadeInDown.delay(100)}>
              <AppTextInput
                errorMessage={errors.email?.message}
                keyboardType="email-address"
                label="Email"
                returnKeyType="next"
                testID="register-email-input"
                value={watch('email') ?? ''}
                onChangeText={(t) => setValue('email', t)}
              />
            </Animated.View>

            <View style={styles.spacing} />

            <Animated.View entering={FadeInDown.delay(200)}>
              <AppTextInput
                isPassword
                errorMessage={errors.password?.message}
                label="Password"
                returnKeyType="next"
                testID="register-password-input"
                value={watch('password') ?? ''}
                onChangeText={(t) => setValue('password', t)}
              />
            </Animated.View>

            <View style={styles.spacing} />

            <Animated.View entering={FadeInDown.delay(300)}>
              <AppTextInput
                isPassword
                errorMessage={errors.confirmPassword?.message}
                label="Confirm Password"
                returnKeyType="done"
                testID="register-confirm-input"
                value={watch('confirmPassword') ?? ''}
                onChangeText={(t) => setValue('confirmPassword', t)}
                onSubmitEditing={handleSubmit(submit)}
              />
            </Animated.View>

            <View style={styles.spacing} />

            <Animated.View entering={FadeInDown.delay(400)}>
              <Button
                isLoading={isLoading}
                size="lg"
                testID="register-submit-btn"
                onPress={handleSubmit(submit)}
              >
                Create My Account
              </Button>
            </Animated.View>
          </GlassCard>

          {/* OAuth */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <OAuthButton
            provider="google"
            onPress={() => {
              /* Sprint 3B+ */
            }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button size="sm" variant="ghost" onPress={() => router.replace('/(auth)/login')}>
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 0,
  },
  header: {
    marginBottom: 28,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 36,
    color: colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
  card: {
    marginBottom: 24,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(139,60,247,0.2)',
  },
  dividerText: {
    color: colors.text.muted,
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successEmoji: { fontSize: 64 },
  successTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    textAlign: 'center',
  },
  successBody: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  successEmail: {
    color: colors.purple[300],
    fontFamily: fontFamily.inter.semiBold,
  },
  successBtn: {
    marginTop: 8,
    width: '100%',
  },
});
