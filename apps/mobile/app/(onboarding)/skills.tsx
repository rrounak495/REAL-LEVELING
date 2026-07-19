/**
 * app/(onboarding)/skills.tsx — Step 4: Skill Selection
 *
 * Fetches available skill categories + skills from Supabase.
 * Uses TanStack Query for caching.
 * Falls back to a static set if the database has no seed data yet.
 */
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { repositories } from '@/db/repositories';
import { colors, fontFamily } from '@theme';

// Static fallback skills in case DB is empty (pre-seed)
const STATIC_SKILLS = [
  {
    id: 'running',
    name: 'Running',
    description: 'Cardio, stamina, and pacing',
    categoryIcon: '🏃',
  },
  {
    id: 'weightlifting',
    name: 'Weightlifting',
    description: 'Raw strength and hypertrophy',
    categoryIcon: '🏋️',
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics',
    description: 'Bodyweight mastery and control',
    categoryIcon: '🤸',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Full body endurance and breath work',
    categoryIcon: '🏊',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    description: 'Flexibility, mobility, and balance',
    categoryIcon: '🧘',
  },
  {
    id: 'martial_arts',
    name: 'Martial Arts',
    description: 'Combat technique, speed, and agility',
    categoryIcon: '🥋',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    description: 'Lower body endurance and stamina',
    categoryIcon: '🚴',
  },
  {
    id: 'stretching',
    name: 'Stretching',
    description: 'Recovery and injury prevention',
    categoryIcon: '🤸‍♂️',
  },
];

export default function SkillsScreen() {
  const { selectedSkillIds, toggleSkill } = useOnboardingStore();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const result = await repositories.skills.getCategories();
      return result.success ? result.data : [];
    },
  });

  const canContinue = selectedSkillIds.length >= 1;
  const isLoading = categoriesLoading;

  // Show static fallback when DB has no categories yet
  const showStatic = !isLoading && (!categories || categories.length === 0);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ProgressStepper currentStep={4} totalSteps={6} />

        <View style={styles.header}>
          <Text style={styles.step}>STEP 5 OF 6</Text>
          <Text style={styles.title}>Pick Your Skills</Text>
          <Text style={styles.subtitle}>
            Choose up to 5 skills to start leveling. You can add more later.
          </Text>
          <Text style={styles.selectionCount}>{selectedSkillIds.length}/5 selected</Text>
        </View>

        {isLoading ? (
          <View style={styles.list}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Skeleton height={88} />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          >
            {showStatic ? (
              STATIC_SKILLS.map((skill, index) => {
                const isSelected = selectedSkillIds.includes(skill.id);
                const isDisabled = !isSelected && selectedSkillIds.length >= 5;
                return (
                  <Animated.View key={skill.id} entering={FadeInDown.delay(index * 50).springify()}>
                    <SelectionCard
                      description={skill.description}
                      icon={<Text style={styles.icon}>{skill.categoryIcon}</Text>}
                      isDisabled={isDisabled}
                      isSelected={isSelected}
                      testID={`skill-${skill.id}`}
                      title={skill.name}
                      onPress={() => toggleSkill(skill.id)}
                    />
                  </Animated.View>
                );
              })
            ) : (
              // Sprint 3B+: Render skill categories when seed data is present
              <GlassCard>
                <Text style={styles.emptyText}>
                  Skill categories are loading. Add seed data to see them here.
                </Text>
              </GlassCard>
            )}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Button
            disabled={!canContinue}
            size="lg"
            onPress={() => router.push('/(onboarding)/permissions')}
          >
            Almost There →
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 8,
  },
  step: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  selectionCount: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.purple[400],
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  icon: { fontSize: 24 },
  footer: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  emptyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
