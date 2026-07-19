/**
 * src/components/ui/XPCard.tsx
 *
 * Premium XP Progress card with animated bar and glowing level display.
 * Reusable across Dashboard and Profile.
 */
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { AnimatedXPBar } from './AnimatedXPBar';
import { colors, fontFamily, radius } from '@theme';

interface XPCardProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  rank: string;
}

export function XPCard({ currentXP, requiredXP, level, rank }: XPCardProps) {
  const xpRemaining = Math.max(requiredXP - currentXP, 0);
  const glowOpacity = useSharedValue(0.4);

  // Subtle glow pulse on the level text
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <GlassCard style={styles.card} variant="elevated">
      <Text style={styles.label}>EXPERIENCE</Text>

      <View style={styles.levelRow}>
        <Animated.View style={[styles.levelGlow, glowStyle]}>
          <Text style={styles.levelText}>LEVEL {level}</Text>
        </Animated.View>
        <View style={styles.rankChip}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      </View>

      <View style={styles.xpNumbers}>
        <Text style={styles.xpCurrent}>{currentXP.toLocaleString()}</Text>
        <Text style={styles.xpSeparator}> / </Text>
        <Text style={styles.xpRequired}>{requiredXP.toLocaleString()} XP</Text>
      </View>

      <View style={styles.barContainer}>
        <AnimatedXPBar
          barColor={colors.purple.neon}
          currentXP={currentXP}
          height={14}
          requiredXP={requiredXP}
          trackColor="rgba(139, 60, 247, 0.12)"
        />
      </View>

      <Text style={styles.remaining}>{xpRemaining.toLocaleString()} XP to next level</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
  },
  label: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelGlow: {
    shadowColor: colors.purple.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 4,
  },
  levelText: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 32,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  rankChip: {
    backgroundColor: 'rgba(139, 60, 247, 0.18)',
    borderColor: colors.purple[600],
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  rankText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.purple[300],
    letterSpacing: 1,
  },
  xpNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  xpCurrent: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 16,
    color: colors.purple[300],
  },
  xpSeparator: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 13,
    color: colors.text.muted,
  },
  xpRequired: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 13,
    color: colors.text.muted,
  },
  barContainer: {
    marginBottom: 8,
  },
  remaining: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'right',
  },
});
