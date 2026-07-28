/**
 * app/_layout.tsx — Root Application Layout
 *
 * WHY THIS IS THE MOST IMPORTANT FILE:
 * This is the single entry point for the entire app. Every provider,
 * every global initialization, every singleton setup lives here.
 * Order matters — providers wrap their dependents.
 *
 * INITIALIZATION ORDER:
 * 1. validateEnv()     — Fail fast if env vars are missing
 * 2. Fonts loaded      — Before any UI renders (prevents font flash)
 * 3. GestureHandler    — Must wrap the entire app for gestures to work
 * 4. QueryClient       — Provides React Query context to all screens
 * 5. Supabase auth     — Initialize session, listen for auth changes
 * 6. SplashScreen      — Hidden after fonts + init complete
 * 7. Stack navigator   — Expo Router navigation shell
 */
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, ErrorBoundary } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalPopupQueue } from '@/components/ui/GlobalPopupQueue';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Rajdhani_600SemiBold, Rajdhani_700Bold } from '@expo-google-fonts/rajdhani';
import { Exo2_400Regular, Exo2_600SemiBold, Exo2_700Bold } from '@expo-google-fonts/exo-2';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';

import '../global.css';
import { queryClient } from '@lib/query-client';
import { validateEnv } from '@lib/env';
import { useAuthStore } from '@store';
import { authService } from '@/features/auth/services';

// ── Step 1: Validate environment on module load ───────────────────────────
// Throws immediately with a clear error if any required env var is missing.
try {
  validateEnv();
} catch (e) {
  console.error('[FATAL ENV ERROR]', e);
}

// ── Step 2: Prevent splash screen from auto-hiding ───────────────────────
// We control when it hides — after fonts load and auth initializes.
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary };

export default function RootLayout() {
  console.log('[DEBUG] RootLayout rendering');
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // ── Step 3: Load all design system fonts ───────────────────────────────
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_600SemiBold,
    Rajdhani_700Bold,
    Exo2_400Regular,
    Exo2_600SemiBold,
    Exo2_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
  });

  // ── Step 4: Initialize Supabase auth ───────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let authTimeout: ReturnType<typeof setTimeout>;

    const initAuth = async () => {
      console.log('[DEBUG] initAuth started');
      try {
        // Get the initial session via our Auth Layer (Development or Production)
        console.log('[DEBUG] Fetching session...');
        const {
          data: { session },
        } = await authService.getSession();
        console.log('[DEBUG] Session fetched:', session ? 'Exists' : 'None');
        if (isMounted) setSession(session);
      } catch (error) {
        console.error('[Auth Error]', error);
      } finally {
        if (isMounted) {
          console.log('[DEBUG] Setting isInitialized to true');
          setInitialized(true);
          clearTimeout(authTimeout);
        }
      }
    };

    // Fallback timeout in case initAuth hangs forever
    authTimeout = setTimeout(() => {
      console.error('[DEBUG] initAuth TIMED OUT after 10 seconds. Forcing initialization.');
      if (isMounted) {
        setInitialized(true);
      }
    }, 10000);

    initAuth();

    // Listen for auth state changes throughout the session
    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      isMounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [setSession, setInitialized]);

  // ── Step 5: Hide splash screen when ready ─────────────────────────────
  useEffect(() => {
    if ((fontsLoaded || fontError) && isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isInitialized]);

  // Don't render until fonts and auth are ready — prevents layout shift and blank screens
  if ((!fontsLoaded && !fontError) || !isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#03030A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="#B200FF" size="large" />
      </View>
    );
  }

  return (
    // ── GestureHandler must be the outermost wrapper ─────────────────
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* Dark status bar matches our void background */}
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
          <GlobalPopupQueue />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
