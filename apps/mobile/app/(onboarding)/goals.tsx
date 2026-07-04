/**
 * app/(onboarding)/goals.tsx — Step 3: Goal Selection
 */
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore, ONBOARDING_GOALS } from '@store';
import { colors, fontFamily } from '@theme';

export default function GoalsScreen() {
  const { selectedGoalIds, toggleGoal } = useOnboardingStore();

  const canContinue = selectedGoalIds.length >= 1;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ProgressStepper currentStep={2} totalSteps={5} />

        <View style={styles.header}>
          <Text style={styles.step}>STEP 3 OF 5</Text>
          <Text style={styles.title}>Choose Your Goals</Text>
          <Text style={styles.subtitle}>
            Select up to 3 areas you want to level up. Your journey will be personalized around
            these.
          </Text>
          <Text style={styles.selectionCount}>{selectedGoalIds.length}/3 selected</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        >
          {ONBOARDING_GOALS.map((goal, index) => {
            const isSelected = selectedGoalIds.includes(goal.id);
            const isDisabled = !isSelected && selectedGoalIds.length >= 3;
            return (
              <Animated.View key={goal.id} entering={FadeInDown.delay(index * 50).springify()}>
                <SelectionCard
                  description={goal.description}
                  icon={<Text style={styles.goalIcon}>{goal.icon}</Text>}
                  isDisabled={isDisabled}
                  isSelected={isSelected}
                  testID={`goal-${goal.id}`}
                  title={goal.label}
                  onPress={() => toggleGoal(goal.id)}
                />
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            disabled={!canContinue}
            size="lg"
            onPress={() => router.push('/(onboarding)/skills')}
          >
            Continue to Skills →
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
  goalIcon: {
    fontSize: 24,
  },
  footer: {
    paddingBottom: 32,
    paddingTop: 8,
  },
});
