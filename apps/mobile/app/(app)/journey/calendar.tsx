import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useJourneyStore } from '@store';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { colors, fontFamily, spacing, radius } from '@theme';

import Animated, { FadeInUp } from 'react-native-reanimated';

export default function JourneyCalendarScreen() {
  const { activeJourney, journeyDays, isLoading } = useJourneyStore();

  if (isLoading || !activeJourney) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator color={colors.purple[500]} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>JOURNEY CALENDAR</Text>
        </View>

        <View style={styles.grid}>
          {journeyDays.map((day, index) => {
            const isCompleted = day.status === 'completed';
            const isMissed = day.status === 'missed';
            const isCurrent = day.day_number === activeJourney.current_day;
            const isBoss = day.day_type === 'boss';
            const isRecovery = day.day_type === 'recovery';

            return (
              <Animated.View
                key={day.id || day.day_number}
                entering={FadeInUp.delay(index * 20).springify()}
                style={[
                  styles.dayCard,
                  isCompleted && styles.dayCardCompleted,
                  isMissed && styles.dayCardMissed,
                  isCurrent && styles.dayCardCurrent,
                  isBoss && styles.dayCardBoss,
                  isRecovery && styles.dayCardRecovery,
                ]}
              >
                <Text style={styles.dayNumber}>{day.day_number}</Text>
                {isBoss && <Text style={styles.icon}>💀</Text>}
                {isRecovery && <Text style={styles.icon}>🧘</Text>}
                {isCompleted && !isBoss && !isRecovery && <Text style={styles.icon}>✓</Text>}
                {isMissed && <Text style={styles.icon}>✕</Text>}
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 28,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  dayCard: {
    width: '21%', // fits 4 per row nicely
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardCompleted: {
    backgroundColor: 'rgba(0, 255, 170, 0.1)',
    borderColor: colors.semantic.success,
  },
  dayCardMissed: {
    backgroundColor: 'rgba(255, 50, 50, 0.1)',
    borderColor: colors.semantic.danger,
  },
  dayCardCurrent: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[400],
    borderWidth: 2,
  },
  dayCardBoss: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    borderColor: colors.semantic.dangerNeon,
  },
  dayCardRecovery: {
    backgroundColor: 'rgba(0, 200, 255, 0.1)',
    borderColor: colors.cyan.neon,
  },
  dayNumber: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  icon: {
    fontSize: 12,
    marginTop: 4,
  },
});
