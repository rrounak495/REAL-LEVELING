import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SystemBadgeType } from '@/types/system.types';

interface SystemHeaderProps {
  badge?: SystemBadgeType | undefined;
}

export const SystemHeader = memo(function SystemHeader({ badge }: SystemHeaderProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.label}>
        SYSTEM
      </Text>

      {/* Optional Status Badge Architecture */}
      {badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // space.3
  },
  label: {
    fontFamily: 'JetBrainsMono_600SemiBold', // Technical, HUD-inspired
    fontSize: 10,
    color: '#3B5BF6', // blue.500 - tech/electric feel
    letterSpacing: 2,
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(59, 91, 246, 0.1)', // subtle blue tint
    borderRadius: 4, // radius.sharp
    borderWidth: 1,
    borderColor: 'rgba(59, 91, 246, 0.3)',
  },
  badgeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 9,
    color: '#93AAF8', // blue.300
    letterSpacing: 1,
  },
});
