import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useJourneyStore } from '@store';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function JourneyMapScreen() {
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>JOURNEY MAP</Text>
          <Text style={styles.subtitle}>
            {(activeJourney.journey_type ?? '').replace('_', ' ').toUpperCase()} PATH
          </Text>
        </View>

        <View style={styles.mapContainer}>
          {journeyDays.map((day, index) => {
            const isCompleted = day.status === 'completed';
            const isCurrent = day.day_number === activeJourney.current_day;
            const isMissed = day.status === 'missed';
            const isBoss = day.day_type === 'boss';

            return (
              <Animated.View
                key={day.id || index}
                entering={FadeInUp.delay(index * 50).springify()}
                style={styles.nodeWrapper}
              >
                <View
                  style={[
                    styles.node,
                    isCompleted && styles.nodeCompleted,
                    isCurrent && styles.nodeCurrent,
                    isMissed && styles.nodeMissed,
                    isBoss && styles.nodeBoss,
                  ]}
                >
                  <Text style={styles.nodeText}>
                    {isBoss ? '💀' : isCompleted ? '✓' : isMissed ? '✕' : day.day_number}
                  </Text>
                </View>

                {/* Connecting Line */}
                {index < journeyDays.length - 1 && (
                  <View style={[styles.line, isCompleted && styles.lineCompleted]} />
                )}

                <View style={styles.nodeLabelContainer}>
                  <Text style={[styles.nodeLabel, isCurrent && styles.nodeLabelCurrent]}>
                    Day {day.day_number}
                  </Text>

                  {isBoss && <Text style={styles.nodeSubLabel}>BOSS TRIAL</Text>}
                  {!isBoss && isCurrent && <Text style={styles.nodeCurrentLabel}>IN PROGRESS</Text>}
                  {!isBoss && !isCurrent && index === journeyDays.length - 1 && (
                    <Text style={styles.nodeSubLabel}>FINAL EVOLUTION</Text>
                  )}
                  {!isBoss &&
                    !isCurrent &&
                    index !== journeyDays.length - 1 &&
                    day.day_number % 7 === 0 && (
                      <Text style={styles.nodeMilestoneLabel}>CHAPTER UNLOCK</Text>
                    )}
                </View>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.purple[400],
    letterSpacing: 1.5,
  },
  mapContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  nodeWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: 'rgba(0, 255, 170, 0.1)',
    borderColor: colors.semantic.success,
  },
  nodeCurrent: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[400],
    transform: [{ scale: 1.1 }],
  },
  nodeMissed: {
    backgroundColor: 'rgba(255, 50, 50, 0.1)',
    borderColor: colors.semantic.danger,
  },
  nodeBoss: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: colors.semantic.dangerNeon,
    backgroundColor: 'rgba(255, 0, 85, 0.15)',
  },
  nodeText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 20,
    color: colors.text.primary,
  },
  line: {
    width: 4,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
    marginVertical: -5,
  },
  lineCompleted: {
    backgroundColor: colors.semantic.success,
  },
  nodeLabelContainer: {
    position: 'absolute',
    left: '60%',
    top: 20,
  },
  nodeLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  nodeLabelCurrent: {
    color: colors.purple[300],
  },
  nodeSubLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.semantic.dangerNeon,
    letterSpacing: 1,
  },
  nodeCurrentLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.purple[300],
    letterSpacing: 1,
  },
  nodeMilestoneLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    color: colors.text.gold,
    letterSpacing: 1,
  },
});
