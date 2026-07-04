/**
 * app/(onboarding)/avatar.tsx — Step 2: Avatar Builder (3-Step Flow)
 *
 * Step 0: Choose Base Model (archetype selector)
 * Step 1: Customize Layers (tabbed layer picker with color swatches)
 * Step 2: Preview + Confirm
 */
import { useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { AvatarPreview } from '@/components/avatar/AvatarPreview';
import { useAvatarBuilderStore } from '@/features/avatar/store';
import {
  AVATAR_LAYER_DEFINITIONS,
  AVATAR_HAIR_COLORS,
  AVATAR_EYE_COLORS,
} from '@/features/avatar/constants/layers';
import type { AvatarConfig, AvatarBaseModel } from '@/features/avatar/types';
import { colors, fontFamily, radius } from '@theme';

const BASE_MODELS: { id: AvatarBaseModel; label: string; emoji: string }[] = [
  { id: 'default_male', label: 'Male', emoji: '⚔️' },
  { id: 'default_female', label: 'Female', emoji: '🌸' },
  { id: 'default_nonbinary', label: 'Non-Binary', emoji: '✨' },
  { id: 'warrior_male', label: 'Warrior ♂', emoji: '🛡️' },
  { id: 'warrior_female', label: 'Warrior ♀', emoji: '⚡' },
  { id: 'mage_male', label: 'Mage ♂', emoji: '🔮' },
  { id: 'mage_female', label: 'Mage ♀', emoji: '🌟' },
];

// ── Step 0: Base Model Selection ────────────────────────────────────────────
function BaseStep() {
  const { draft, setDraftField, setActiveStep } = useAvatarBuilderStore();

  return (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Archetype</Text>
      <Text style={styles.stepSubtitle}>This shapes your Hunter's base appearance.</Text>

      <AvatarPreview config={draft} size="lg" style={styles.previewCenter} />

      <FlatList
        columnWrapperStyle={styles.baseGrid}
        data={BASE_MODELS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const isSelected = draft.base_model === item.id;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[styles.baseCard, isSelected && styles.baseCardSelected]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDraftField('base_model', item.id);
              }}
            >
              <Text style={styles.baseEmoji}>{item.emoji}</Text>
              <Text style={[styles.baseLabel, isSelected && styles.baseLabelSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
        scrollEnabled={false}
        style={styles.baseList}
      />

      <Button size="lg" style={styles.stepBtn} onPress={() => setActiveStep(1)}>
        Customize Appearance →
      </Button>
    </Animated.View>
  );
}

// ── Step 1: Layer Customizer ─────────────────────────────────────────────────
function CustomizeStep() {
  const { draft, setDraftField, setActiveStep, activeLayerKey, setActiveLayerKey } =
    useAvatarBuilderStore();

  const activeDef = AVATAR_LAYER_DEFINITIONS.find((d) => d.key === activeLayerKey);
  const colorOptions =
    activeDef?.colorField === 'hair_color'
      ? AVATAR_HAIR_COLORS
      : activeDef?.colorField === 'eye_color'
        ? AVATAR_EYE_COLORS
        : null;

  const currentValue = activeDef
    ? (draft[activeDef.configField as keyof AvatarConfig] as string | null)
    : null;

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!activeDef) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDraftField(activeDef.configField as keyof AvatarConfig, optionId);
    },
    [activeDef, setDraftField],
  );

  const handleSelectColor = useCallback(
    (color: string) => {
      if (!activeDef?.colorField) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDraftField(activeDef.colorField as keyof AvatarConfig, color);
    },
    [activeDef, setDraftField],
  );

  return (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Customize Your Hunter</Text>

      {/* Live preview */}
      <AvatarPreview config={draft} size="md" style={styles.previewCenter} />

      {/* Layer tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {AVATAR_LAYER_DEFINITIONS.map((def) => (
          <Pressable
            key={def.key}
            style={[styles.tab, activeLayerKey === def.key && styles.tabActive]}
            onPress={() => {
              if (activeLayerKey !== def.key) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveLayerKey(def.key);
              }
            }}
          >
            <Text style={[styles.tabLabel, activeLayerKey === def.key && styles.tabLabelActive]}>
              {def.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Options grid */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.optionsScroll}>
        {activeDef && (
          <View style={styles.optionsGrid}>
            {activeDef.options.map((opt) => {
              const isSelected = currentValue === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                  onPress={() => handleSelectOption(opt.id)}
                >
                  <View
                    style={[
                      styles.optionSwatch,
                      { backgroundColor: opt.previewColor || colors.bg.overlay },
                    ]}
                  />
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Color picker row (for layers with color support) */}
        {colorOptions && (
          <View style={styles.colorSection}>
            <Text style={styles.colorSectionLabel}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorRow}>
                {colorOptions.map((c) => {
                  const colorField = activeDef?.colorField as keyof AvatarConfig | null;
                  const currentColor = colorField ? draft[colorField] : null;
                  const isSelected = currentColor === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      accessibilityLabel={c.label}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: c.id },
                        isSelected && styles.colorSwatchSelected,
                      ]}
                      onPress={() => handleSelectColor(c.id)}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.navRow}>
        <Button size="md" style={styles.navBtn} variant="outline" onPress={() => setActiveStep(0)}>
          ← Back
        </Button>
        <Button size="md" style={styles.navBtn} onPress={() => setActiveStep(2)}>
          Preview →
        </Button>
      </View>
    </Animated.View>
  );
}

// ── Step 2: Preview + Confirm ────────────────────────────────────────────────
function PreviewStep() {
  const { draft, setActiveStep } = useAvatarBuilderStore();

  const handleConfirm = () => {
    // Avatar config will be saved to Supabase in the permissions step (final submit)
    router.push('/(onboarding)/goals');
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Hunter</Text>
      <Text style={styles.stepSubtitle}>Looking good, Hunter. Ready to begin?</Text>

      <AvatarPreview config={draft} size="xl" style={styles.previewCenter} />

      <GlassCard style={styles.previewCard} variant="elevated">
        <Text style={styles.previewLabel}>Base Model</Text>
        <Text style={styles.previewValue}>{draft.base_model.replace(/_/g, ' ')}</Text>
        {draft.aura_id && draft.aura_id !== 'none' && (
          <>
            <Text style={styles.previewLabel}>Aura</Text>
            <Text style={styles.previewValue}>{draft.aura_id.replace(/_/g, ' ')}</Text>
          </>
        )}
      </GlassCard>

      <View style={styles.navRow}>
        <Button size="md" style={styles.navBtn} variant="outline" onPress={() => setActiveStep(1)}>
          ← Edit
        </Button>
        <Button size="md" style={styles.navBtn} onPress={handleConfirm}>
          Looks Great! →
        </Button>
      </View>
    </Animated.View>
  );
}

// ── Main Avatar Screen ────────────────────────────────────────────────────────
export default function AvatarScreen() {
  const activeStep = useAvatarBuilderStore((s) => s.activeStep);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <ProgressStepper currentStep={1} totalSteps={5} />
          <Text style={styles.stepCounter}>Avatar Builder — {activeStep + 1} / 3</Text>
        </View>

        {activeStep === 0 && <BaseStep />}
        {activeStep === 1 && <CustomizeStep />}
        {activeStep === 2 && <PreviewStep />}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  topBar: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  stepCounter: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.purple[400],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 30,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewCenter: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  // Base model step
  baseList: {
    marginBottom: 20,
  },
  baseGrid: {
    gap: 12,
    marginBottom: 12,
  },
  baseCard: {
    flex: 1,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  baseCardSelected: {
    borderColor: colors.purple[400],
    backgroundColor: 'rgba(107, 47, 204, 0.18)',
  },
  baseEmoji: { fontSize: 28, marginBottom: 6 },
  baseLabel: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  baseLabelSelected: {
    color: colors.purple[300],
  },
  stepBtn: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  // Customize step
  tabRow: {
    marginBottom: 12,
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    marginRight: 8,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  tabActive: {
    backgroundColor: colors.purple[800],
    borderColor: colors.purple[500],
  },
  tabLabel: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 13,
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.purple[300],
  },
  optionsScroll: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)',
    backgroundColor: colors.bg.surface,
  },
  optionChipSelected: {
    borderColor: colors.purple[400],
    backgroundColor: 'rgba(107, 47, 204, 0.18)',
  },
  optionSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: colors.text.secondary,
  },
  optionLabelSelected: {
    color: colors.purple[300],
  },
  colorSection: {
    marginBottom: 16,
  },
  colorSectionLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: colors.purple[300],
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  navBtn: {
    flex: 1,
  },
  // Preview step
  previewCard: {
    marginBottom: 16,
  },
  previewLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
    marginTop: 8,
  },
  previewValue: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 16,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
});
