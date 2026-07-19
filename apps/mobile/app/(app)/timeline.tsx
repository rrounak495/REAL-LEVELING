import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useLifeStore } from '@/store/life.store';
import { colors, fontFamily, spacing } from '@theme';

export default function TimelineScreen() {
  const router = useRouter();
  const { diary } = useLifeStore();

  const getEventDotColor = (type: string) => {
    switch (type) {
      case 'boss_defeated':
        return colors.semantic.dangerNeon;
      case 'rank_up':
        return colors.text.gold;
      case 'evolution':
        return colors.cyan.neon;
      case 'personal_record':
        return colors.semantic.successNeon;
      default:
        return colors.purple.neon;
    }
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← PASSPORT</Text>
        </Pressable>
        <Text style={styles.headerTitle}>HUNTER TIMELINE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>The chronological story of your growth.</Text>

        <View style={styles.timelineContainer}>
          {/* Vertical line */}
          <View style={styles.timelineLine} />

          {diary.map((entry, index) => {
            const dateStr = new Date(entry.date).toLocaleDateString();
            const timeStr = new Date(entry.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Animated.View
                key={entry.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
                style={styles.timelineItem}
              >
                <View
                  style={[styles.timelineDot, { backgroundColor: getEventDotColor(entry.type) }]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineDate}>
                    {dateStr} • {timeStr}
                  </Text>
                  <View
                    style={[styles.timelineCard, { borderLeftColor: getEventDotColor(entry.type) }]}
                  >
                    <Text style={styles.timelineText}>{entry.content}</Text>
                  </View>
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
    marginBottom: 32,
    fontStyle: 'italic',
  },

  timelineContainer: { position: 'relative', paddingLeft: 24 },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  timelineItem: { position: 'relative', marginBottom: 32 },
  timelineDot: {
    position: 'absolute',
    left: -21,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
  },

  timelineContent: { paddingLeft: 8 },
  timelineDate: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 8,
    letterSpacing: 1,
  },
  timelineCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderLeftWidth: 3,
    padding: 16,
    borderRadius: 4,
  },
  timelineText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 22,
  },
});
