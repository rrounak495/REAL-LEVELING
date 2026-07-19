/**
 * src/components/ui/SectionHeader.tsx
 *
 * Reusable section header with left neon-purple accent border.
 * Consistent across all screens.
 */
import { StyleSheet, Text, type ViewStyle, type StyleProp } from 'react-native';
import { colors, fontFamily, spacing } from '@theme';

interface SectionHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ title, style }: SectionHeaderProps) {
  return <Text style={[styles.title, style]}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 16,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.componentSm,
    paddingLeft: spacing[2] + 3,
    borderLeftWidth: 3,
    borderLeftColor: colors.purple.neon,
  },
});
