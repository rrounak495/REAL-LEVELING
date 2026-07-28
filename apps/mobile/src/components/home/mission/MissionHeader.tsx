import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MissionHeaderProps {
  title?: string | undefined;
  subtitle?: string | undefined;
}

export const MissionHeader = memo(function MissionHeader({
  title = "TODAY'S QUESTS",
  subtitle,
}: MissionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {/* Accent bar */}
        <View style={styles.accentBar} />
        <View>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {/* Live indicator */}
      <View style={styles.liveRow}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>ACTIVE</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accentBar: {
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#8B3CF7',
    shadowColor: '#C800FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontFamily: 'Exo2_700Bold',
    fontSize: 13,
    color: '#F4F4FF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: '#4B5280',
    marginTop: 2,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
  },
  liveText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 9,
    color: '#00FF88',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
