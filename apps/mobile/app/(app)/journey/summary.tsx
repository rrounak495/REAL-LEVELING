import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function JourneySummaryScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(800).springify()} style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🏆</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.header}>
          <Text style={styles.title}>JOURNEY COMPLETE</Text>
          <Text style={styles.subtitle}>You have conquered the path.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1,000</Text>
            <Text style={styles.statLabel}>XP EARNED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>BOSSES DEFEATED</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800).duration(600)}
          style={[styles.statsContainer, { marginTop: 16 }]}
        >
          <View style={styles.statBox}>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>DAYS COMPLETED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>NEW PRs</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.nextJourneySection}
        >
          <Text style={styles.nextJourneyLabel}>RECOMMENDED NEXT</Text>
          <View style={styles.nextJourneyCard}>
            <Text style={styles.nextJourneyTitle}>The Ascension Path</Text>
            <Text style={styles.nextJourneyDesc}>Advanced endurance and core mastery.</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          size="lg"
          style={{ backgroundColor: colors.purple[600] }}
          onPress={() => router.replace('/(app)/(tabs)/')}
        >
          START NEXT JOURNEY
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 80,
    paddingBottom: 120,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderWidth: 2,
    borderColor: colors.purple[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: colors.purple[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  badgeIcon: {
    fontSize: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 36,
    color: colors.text.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 24,
    color: colors.text.gold,
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  nextJourneySection: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  nextJourneyLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  nextJourneyCard: {
    width: '100%',
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderWidth: 1,
    borderColor: colors.purple[500],
    borderRadius: radius.md,
    padding: 20,
    alignItems: 'center',
  },
  nextJourneyTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.purple[300],
    marginBottom: 4,
  },
  nextJourneyDesc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
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
