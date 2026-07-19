/**
 * src/components/ui/ComingSoonCard.tsx
 *
 * Premium placeholder card for unreleased features.
 * Renders a locked/teaser card with a title, icon, and "Coming Soon" label.
 */
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, fontFamily, radius } from '@theme';

interface ComingSoonCardProps {
  icon: string;
  title: string;
  description?: string;
}

export function ComingSoonCard({ icon, title, description }: ComingSoonCardProps) {
  return (
    <GlassCard padding={20} style={styles.card} variant="active">
      <View style={styles.lockBadge}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.comingSoonPill}>
        <Text style={styles.comingSoonText}>COMING SOON</Text>
      </View>
      {description && <Text style={styles.desc}>{description}</Text>}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    opacity: 0.65,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  lockIcon: {
    fontSize: 16,
  },
  icon: {
    fontSize: 38,
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.purple[400],
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  comingSoonPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 6,
  },
  comingSoonText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 11,
    color: colors.semantic.warning,
    letterSpacing: 2,
  },
  desc: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});
