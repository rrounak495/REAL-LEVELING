import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontFamily, spacing, radius } from '@theme';

const PhotoPlaceholder = ({ label }: { label: string }) => (
  <View style={styles.photoBox}>
    <Text style={styles.photoIcon}>📷</Text>
    <Text style={styles.photoLabel}>{label}</Text>
  </View>
);

export default function ProgressPhotosScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </Pressable>
          <Text style={styles.headerTitle}>PROGRESS PHOTOS</Text>
          <Text style={styles.headerSubtitle}>
            Track your visual evolution. This feature is entirely optional and your photos are
            stored securely.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <GlassCard padding={24} style={styles.card}>
            <View style={styles.row}>
              <PhotoPlaceholder label="FRONT" />
              <PhotoPlaceholder label="SIDE" />
            </View>
            <View style={[styles.row, { marginTop: 16 }]}>
              <PhotoPlaceholder label="BACK" />
              <View style={[styles.photoBox, { backgroundColor: 'transparent', borderWidth: 0 }]} />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard padding={24} style={[styles.card, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🤖</Text>
            <Text style={styles.aiTitle}>FUTURE AI HOOKS READY</Text>
            <Text style={styles.aiDesc}>
              Architecture prepared for optional AI Posture & Form analysis. No analysis is
              currently active.
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: spacing.screenHorizontal, paddingTop: 60, paddingBottom: 60 },
  header: { marginBottom: spacing.sectionGap },
  backButton: { marginBottom: 16 },
  backText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.purple.neon,
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 34,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 22,
  },
  card: { marginBottom: spacing.sectionGap, borderColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', gap: 16 },
  photoBox: {
    flex: 1,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  photoIcon: { fontSize: 32, marginBottom: 8, opacity: 0.5 },
  photoLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
  },
  aiTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.cyan.neon,
    letterSpacing: 1,
    marginBottom: 8,
  },
  aiDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
