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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { supabase } from '@lib/supabase';
import { validateEnv } from '@lib/env';
import { useAuthStore } from '@store';

// ── Step 1: Validate environment on module load ───────────────────────────
// Throws immediately with a clear error if any required env var is missing.
validateEnv();

// ── Step 2: Prevent splash screen from auto-hiding ───────────────────────
// We control when it hides — after fonts load and auth initializes.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

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
    // Get the initial session (from persisted MMKV storage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen for auth state changes throughout the session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setInitialized]);

  // ── Step 5: Hide splash screen when ready ─────────────────────────────
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are ready — prevents layout shift
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // ── GestureHandler must be the outermost wrapper ─────────────────
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* Dark status bar matches our void background */}
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
