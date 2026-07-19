import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/auth.store';
import { useTransformationStore } from '@/store/transformation.store';
import { TransformationRepository } from '@/features/transformation/repositories/TransformationRepository';
import { colors, fontFamily, spacing, radius } from '@theme';

const MeasurementInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        keyboardType="numeric"
        placeholder="--"
        placeholderTextColor={colors.text.muted}
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
      <Text style={styles.unit}>cm</Text>
    </View>
  </View>
);

export default function BodyMeasurementsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, updateWeight } = useTransformationStore();

  const [weight, setWeight] = useState(profile?.current_weight?.toString() || '');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    // Update weight in profile
    if (weight) {
      await updateWeight(user.id, parseFloat(weight));
    }

    // Log measurements (partial updates allowed)
    if (chest || waist || arms) {
      await TransformationRepository.addMeasurement({
        user_id: user.id,
        date: new Date().toISOString(),
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        arms: arms ? parseFloat(arms) : null,
      });
    }

    setIsSaving(false);
    router.back();
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </Pressable>
          <Text style={styles.headerTitle}>LOG PROGRESS</Text>
          <Text style={styles.headerSubtitle}>Partial updates are fully supported.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <GlassCard padding={24} style={styles.card}>
            <Text style={styles.sectionTitle}>WEIGHT</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Weight</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="--"
                  placeholderTextColor={colors.text.muted}
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard padding={24} style={styles.card}>
            <Text style={styles.sectionTitle}>BODY MEASUREMENTS</Text>
            <MeasurementInput label="Chest" value={chest} onChange={setChest} />
            <MeasurementInput label="Waist" value={waist} onChange={setWaist} />
            <MeasurementInput label="Arms" value={arms} onChange={setArms} />
            <Text style={styles.note}>
              Other fields (Neck, Shoulders, Hips, Thighs) can be added in full settings.
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          disabled={isSaving}
          size="lg"
          style={{ backgroundColor: colors.purple[600] }}
          onPress={handleSave}
        >
          {isSaving ? 'SAVING...' : 'SAVE TRANSFORMATION LOG'}
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 140,
  },
  header: { marginBottom: spacing.sectionGap },
  backButton: { marginBottom: 16 },
  backText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.purple.neon,
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 34,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  card: { marginBottom: spacing.sectionGap, borderColor: 'rgba(255,255,255,0.05)' },
  sectionTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
    marginBottom: 16,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 18,
    color: colors.text.primary,
  },
  unit: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.muted,
    marginLeft: 8,
  },
  note: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.screenHorizontal + 20,
    backgroundColor: 'rgba(5, 2, 10, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});
