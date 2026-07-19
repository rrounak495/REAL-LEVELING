import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { colors, fontFamily } from '@theme';

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    label: 'BEGINNER',
    description: "I'm starting my fitness journey.",
    icon: '🌱',
  },
  {
    id: 'intermediate',
    label: 'INTERMEDIATE',
    description: 'I train regularly and know the basics.',
    icon: '⚡',
  },
  {
    id: 'experienced',
    label: 'EXPERIENCED',
    description: 'I follow structured or advanced training.',
    icon: '🔥',
  },
] as const;

export default function ExperienceScreen() {
  const { fitnessExperience, setFitnessExperience } = useOnboardingStore();

  const canContinue = fitnessExperience !== null;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ProgressStepper currentStep={3} totalSteps={6} />

        <View style={styles.header}>
          <Text style={styles.step}>STEP 3 OF 6</Text>
          <Text style={styles.title}>Fitness Experience</Text>
          <Text style={styles.subtitle}>
            This sets your initial objective difficulty. It is not your Hunter Level.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        >
          {EXPERIENCE_LEVELS.map((level, index) => {
            const isSelected = fitnessExperience === level.id;
            return (
              <Animated.View key={level.id} entering={FadeInDown.delay(index * 50).springify()}>
                <SelectionCard
                  description={level.description}
                  icon={<Text style={styles.goalIcon}>{level.icon}</Text>}
                  isDisabled={false}
                  isSelected={isSelected}
                  testID={`exp-${level.id}`}
                  title={level.label}
                  onPress={() => setFitnessExperience(level.id as any)}
                />
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            disabled={!canContinue}
            size="lg"
            onPress={() => router.push('/(onboarding)/logistics')}
          >
            Continue →
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 24 },
  header: { marginTop: 20, marginBottom: 8 },
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
  list: { flex: 1 },
  listContent: { paddingTop: 16, paddingBottom: 16 },
  goalIcon: { fontSize: 24 },
  footer: { paddingBottom: 32, paddingTop: 8 },
});
