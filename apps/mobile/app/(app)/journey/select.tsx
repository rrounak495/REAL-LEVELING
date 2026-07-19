import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useJourneyStore, useAuthStore } from '@store';
import { repositories } from '@/db/repositories';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontFamily, spacing, radius } from '@theme';

const JOURNEY_TYPES = [
  {
    id: 'weight_loss',
    label: 'Weight Loss',
    icon: '❄️',
    description: 'Burn fat and increase cardiovascular endurance.',
    color: colors.cyan.neon,
  },
  {
    id: 'muscle_gain',
    label: 'Muscle Gain',
    icon: '🔥',
    description: 'Build mass and raw strength.',
    color: colors.semantic.dangerNeon,
  },
  {
    id: 'strength',
    label: 'Strength',
    icon: '🦍',
    description: 'Focus on heavy lifting and power.',
    color: colors.text.gold,
  },
  {
    id: 'endurance',
    label: 'Endurance',
    icon: '🏃',
    description: 'Run longer, move faster, breathe easier.',
    color: colors.semantic.success,
  },
  {
    id: 'general_fitness',
    label: 'General Fitness',
    icon: '🌟',
    description: 'A balanced path of overall health.',
    color: colors.purple[400],
  },
];

const DURATIONS = [
  { id: 7, label: '7 Days' },
  { id: 14, label: '14 Days' },
  { id: 30, label: '30 Days' },
];

export default function JourneySelectScreen() {
  const router = useRouter();
  const { startJourney, isLoading } = useJourneyStore();
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] = useState<string>('general_fitness');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const activeThemeColor =
    JOURNEY_TYPES.find((t) => t.id === selectedType)?.color || colors.purple[400];

  const handleStart = async () => {
    if (!user) return;

    // In a real implementation we would fetch the user's full profile
    // to pass into the generation service.
    const profileRes = await repositories.profiles.getProfile(user.id);
    const profile = profileRes.success ? profileRes.data : {};

    await startJourney(profile, selectedType, selectedDuration);
    router.replace('/journey/intro');
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>CHOOSE YOUR PATH</Text>
          <Text style={styles.subtitle}>Select a Journey to guide your daily progression.</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionTitle}>JOURNEY TYPE</Text>
          {JOURNEY_TYPES.map((type) => {
            const isActive = selectedType === type.id;
            return (
              <Pressable
                key={type.id}
                style={[
                  styles.card,
                  isActive && { backgroundColor: `${type.color}15`, borderColor: type.color },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={styles.cardIcon}>{type.icon}</Text>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, isActive && { color: type.color }]}>
                    {type.label}
                  </Text>
                  <Text style={styles.cardDescription}>{type.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.durationSection}
        >
          <Text style={styles.sectionTitle}>DURATION</Text>
          <View style={styles.durationGrid}>
            {DURATIONS.map((dur) => {
              const isActive = selectedDuration === dur.id;
              return (
                <Pressable
                  key={dur.id}
                  style={[
                    styles.durationCard,
                    isActive && {
                      backgroundColor: `${activeThemeColor}15`,
                      borderColor: activeThemeColor,
                    },
                  ]}
                  onPress={() => setSelectedDuration(dur.id)}
                >
                  <Text style={[styles.durationText, isActive && { color: activeThemeColor }]}>
                    {dur.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          disabled={isLoading}
          size="lg"
          style={{ backgroundColor: activeThemeColor }}
          onPress={handleStart}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'EMBARK ON JOURNEY'}
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 16,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 16,
    color: colors.text.muted,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
  },
  cardActive: {
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderColor: colors.purple[500],
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
  },
  durationSection: {
    marginTop: 24,
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  durationCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  durationCardActive: {
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderColor: colors.purple[500],
  },
  durationText: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  durationTextActive: {
    color: colors.purple[300],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: 40,
    backgroundColor: colors.bg.void,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});
