/**
 * app/(auth)/login.tsx — Login Screen
 */
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { OAuthButton } from '@/components/ui/OAuthButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { colors, fontFamily } from '@theme';

export default function LoginScreen() {
  const { form, submit, isLoading, serverError } = useLogin();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

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
          {/* Header */}
          <View style={styles.header}>
            <Button size="sm" style={styles.backBtn} variant="ghost" onPress={() => router.back()}>
              ← Back
            </Button>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Your journey continues, Hunter.</Text>
          </View>

          {/* Form */}
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
                testID="login-email-input"
                value={watch('email') ?? ''}
                onChangeText={(t) => setValue('email', t)}
              />
            </Animated.View>

            <View style={styles.fieldSpacing} />

            <Animated.View entering={FadeInDown.delay(200)}>
              <AppTextInput
                isPassword
                errorMessage={errors.password?.message}
                label="Password"
                returnKeyType="done"
                testID="login-password-input"
                value={watch('password') ?? ''}
                onChangeText={(t) => setValue('password', t)}
                onSubmitEditing={handleSubmit(submit)}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)}>
              <Button
                size="sm"
                style={styles.forgotBtn}
                variant="ghost"
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                Forgot Password?
              </Button>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400)}>
              <Button
                isLoading={isLoading}
                size="lg"
                testID="login-submit-btn"
                onPress={handleSubmit(submit)}
              >
                Sign In
              </Button>
            </Animated.View>
          </GlassCard>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OAuth */}
          <View style={styles.oauthContainer}>
            <OAuthButton
              provider="google"
              onPress={() => {
                /* Sprint 3B+ */
              }}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button size="sm" variant="ghost" onPress={() => router.replace('/(auth)/register')}>
              Sign Up
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
  fieldSpacing: {
    height: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: 4,
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
    marginBottom: 20,
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
  oauthContainer: {
    gap: 12,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
});
