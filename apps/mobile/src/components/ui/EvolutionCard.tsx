/**
 * src/components/ui/EvolutionCard.tsx
 *
 * Shows the current avatar evolution stage, next unlock, and progress.
 * Reusable on Dashboard and Profile.
 */
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { AnimatedXPBar } from './AnimatedXPBar';
import { colors, fontFamily, radius } from '@theme';

const EVOLUTION_STAGES = [
  { level: 1, name: 'Novice' },
  { level: 10, name: 'Warrior' },
  { level: 25, name: 'Elite' },
  { level: 50, name: 'Commander' },
  { level: 75, name: 'Champion' },
  { level: 100, name: 'Monarch' },
];

interface EvolutionCardProps {
  currentLevel?: number | undefined;
  stageName?: string | null | undefined;
}

export function EvolutionCard({ currentLevel = 1, stageName }: EvolutionCardProps) {
  const currentEvolution =
    EVOLUTION_STAGES.slice()
      .reverse()
      .find((s) => currentLevel >= s.level) || EVOLUTION_STAGES[0]!;
  const nextEvolution = EVOLUTION_STAGES.find((s) => s.level > currentLevel);
  const displayName = stageName || currentEvolution.name;

  // Progress within current stage bracket
  const prevLevel = currentEvolution.level;
  const nextLevel = nextEvolution?.level ?? 100;
  const stageProgress = Math.min((currentLevel - prevLevel) / (nextLevel - prevLevel), 1);

  return (
    <GlassCard style={styles.card} variant="elevated">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>CURRENT STAGE</Text>
          <Text style={styles.stageName}>{displayName}</Text>
        </View>
        <View style={styles.stageChip}>
          <Text style={styles.stageChipText}>Lv.{currentEvolution.level}+</Text>
        </View>
      </View>

      {nextEvolution ? (
        <>
          <View style={styles.nextRow}>
            <Text style={styles.nextLabel}>NEXT EVOLUTION</Text>
            <Text style={styles.nextName}>
              {nextEvolution.name}
              <Text style={styles.nextLevel}> — Level {nextEvolution.level}</Text>
            </Text>
          </View>

          <View style={styles.progressRow}>
            <AnimatedXPBar
              barColor={colors.semantic.success}
              currentXP={currentLevel - prevLevel}
              height={8}
              requiredXP={nextLevel - prevLevel}
              trackColor="rgba(255,255,255,0.06)"
            />
            <Text style={styles.progressText}>
              {nextEvolution.level - currentLevel} levels remaining
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.maxRow}>
          <Text style={styles.maxText}>✦ MAX EVOLUTION REACHED ✦</Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  stageName: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 24,
    color: colors.purple[400],
  },
  stageChip: {
    backgroundColor: 'rgba(139, 60, 247, 0.12)',
    borderColor: colors.purple[700],
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stageChipText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 11,
    color: colors.purple[300],
  },
  nextRow: {
    marginBottom: 10,
  },
  nextLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  nextName: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 16,
    color: colors.text.secondary,
  },
  nextLevel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 12,
    color: colors.text.muted,
  },
  progressRow: {
    marginTop: 4,
  },
  progressText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 6,
    textAlign: 'right',
  },
  maxRow: {
    marginTop: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  maxText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 13,
    color: colors.gold[400],
    letterSpacing: 2,
  },
});
