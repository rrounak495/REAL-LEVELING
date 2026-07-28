import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLifeStore } from '@/store/life.store';
import { colors, fontFamily, spacing } from '@theme';

export default function TrophyRoomScreen() {
  const router = useRouter();
  const { trophies } = useLifeStore();
  const { width } = useWindowDimensions();

  // 3 columns of trophies
  const cardWidth = (width - spacing.screenHorizontal * 2 - 24) / 3;

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← PASSPORT</Text>
        </Pressable>
        <Text style={styles.headerTitle}>TROPHY ROOM</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>A testament to your victories and evolution.</Text>

        <View style={styles.grid}>
          {trophies.map((trophy, index) => {
            const isUnlocked = !!trophy.unlockedAt;
            return (
              <Animated.View
                key={trophy.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
                style={{ width: cardWidth }}
              >
                <GlassCard
                  padding={12}
                  style={[styles.trophyCard, isUnlocked ? styles.unlockedCard : styles.lockedCard]}
                >
                  <Text style={[styles.trophyIcon, !isUnlocked && styles.lockedIcon]}>
                    {isUnlocked ? trophy.icon : '🔒'}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={[styles.trophyName, !isUnlocked && styles.lockedText]}
                  >
                    {trophy.name}
                  </Text>
                  <Text style={styles.trophyType}>
                    {trophy.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </GlassCard>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: { padding: 8, marginLeft: -8, marginRight: 16 },
  backButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: 2,
  },

  scrollContent: { paddingHorizontal: spacing.screenHorizontal, paddingTop: 24, paddingBottom: 80 },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  trophyCard: { alignItems: 'center', justifyContent: 'center', height: 120 },
  unlockedCard: { borderColor: colors.purple[500], backgroundColor: 'rgba(139, 60, 247, 0.1)' },
  lockedCard: { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },

  trophyIcon: { fontSize: 32, marginBottom: 8 },
  lockedIcon: { opacity: 0.3 },

  trophyName: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 11,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedText: { color: colors.text.muted },

  trophyType: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 9,
    color: colors.purple[300],
    textAlign: 'center',
  },
});
