import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useOnboardingStore } from '@store';
import { colors, fontFamily } from '@theme';
import {
  LocationHomeIcon,
  LocationGymIcon,
  LocationOutdoorIcon,
} from '@/components/ui/OnboardingIcons';

const LOCATIONS = [
  { id: 'home', label: 'HOME', icon: '🏠' },
  { id: 'gym', label: 'GYM', icon: '🏋️' },
] as const;

type LocationId = 'home' | 'gym' | 'both';

function LocationIcon({ id, selected }: { id: LocationId; selected: boolean }) {
  const color = selected ? colors.purple.neon : colors.text.secondary;
  if (id === 'home') return <LocationHomeIcon color={color} size={32} />;
  if (id === 'gym') return <LocationGymIcon color={color} size={32} />;
  return <LocationOutdoorIcon color={color} size={32} />;
}

const TIMES = [
  { id: 15, label: '15 MIN', icon: '⏱️' },
  { id: 30, label: '30 MIN', icon: '⏳' },
  { id: 45, label: '45 MIN', icon: '⏰' },
  { id: 60, label: '60+ MIN', icon: '🔥' },
] as const;

export default function LogisticsScreen() {
  const { trainingLocation, setTrainingLocation, availableDailyTime, setAvailableDailyTime } =
    useOnboardingStore();

  const canContinue = trainingLocation !== null && availableDailyTime !== null;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ProgressStepper currentStep={4} totalSteps={6} />

        <View style={styles.header}>
          <Text style={styles.step}>STEP 4 OF 6</Text>
          <Text style={styles.title}>Training Setup</Text>
          <Text style={styles.subtitle}>Where do you train and how much time do you have?</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        >
          <Text style={styles.sectionTitle}>TRAINING LOCATION</Text>
          <View style={styles.rowGrid}>
            {LOCATIONS.map((loc, index) => {
              const isSelected = trainingLocation === loc.id;
              return (
                <Animated.View
                  key={loc.id}
                  entering={FadeInDown.delay(index * 50).springify()}
                  style={{ flex: 1, marginHorizontal: 4 }}
                >
                  <SelectionCard
                    icon={
                      <LocationIcon
                        id={loc.id as LocationId}
                        selected={trainingLocation === loc.id}
                      />
                    }
                    isSelected={trainingLocation === loc.id}
                    title={loc.label}
                    onPress={() => setTrainingLocation(loc.id as any)}
                  />
                </Animated.View>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>AVAILABLE DAILY TIME</Text>
          <View style={styles.rowGrid}>
            {TIMES.map((time, index) => {
              const isSelected = availableDailyTime === time.id;
              return (
                <Animated.View
                  key={time.id}
                  entering={FadeInDown.delay(200 + index * 50).springify()}
                  style={{ width: '48%', marginBottom: 8 }}
                >
                  <SelectionCard
                    icon={<Text style={styles.goalIcon}>{time.icon}</Text>}
                    isSelected={isSelected}
                    title={time.label}
                    onPress={() => setAvailableDailyTime(time.id as any)}
                  />
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            disabled={!canContinue}
            size="lg"
            onPress={() => router.push('/(onboarding)/skills')}
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
  sectionTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 16,
    color: colors.text.muted,
    marginBottom: 12,
    letterSpacing: 1,
  },
  rowGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  goalIcon: { fontSize: 20 },
  footer: { paddingBottom: 32, paddingTop: 8 },
});
