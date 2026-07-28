import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLifeStore } from '@/store/life.store';
import { colors, fontFamily, spacing } from '@theme';

export default function MemoryVaultScreen() {
  const router = useRouter();
  const { memories } = useLifeStore();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'journey_completed':
        return '🗺️';
      case 'boss_victory':
        return '💀';
      case 'personal_record':
        return '🔥';
      case 'weekly_report':
        return '📊';
      default:
        return '🗄️';
    }
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← PASSPORT</Text>
        </Pressable>
        <Text style={styles.headerTitle}>MEMORY VAULT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          The archives of your past glories and completed records.
        </Text>

        {memories.map((memory, index) => {
          const dateStr = new Date(memory.date).toLocaleDateString();
          return (
            <Animated.View key={memory.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <GlassCard padding={16} style={styles.memoryCard}>
                <View style={styles.memoryRow}>
                  <Text style={styles.memoryIcon}>{getIconForType(memory.type)}</Text>
                  <View style={styles.memoryTextContent}>
                    <Text style={styles.memoryTitle}>{memory.title}</Text>
                    <Text style={styles.memoryDetails}>{memory.details}</Text>
                  </View>
                  <View style={styles.memoryDateBadge}>
                    <Text style={styles.memoryDateText}>{dateStr}</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          );
        })}
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

  memoryCard: { marginBottom: 12, borderColor: 'rgba(255,255,255,0.05)' },
  memoryRow: { flexDirection: 'row', alignItems: 'center' },
  memoryIcon: { fontSize: 32, marginRight: 16 },

  memoryTextContent: { flex: 1 },
  memoryTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  memoryDetails: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },

  memoryDateBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  memoryDateText: { fontFamily: fontFamily.mono.regular, fontSize: 10, color: colors.text.muted },
});
