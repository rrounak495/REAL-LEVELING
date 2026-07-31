import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Settings } from 'lucide-react-native';
import { colors, fontFamily, spacing } from '@theme';

export function ProfileHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.accentLine} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>PROFILE</Text>
          <Text style={styles.subtitle}>HUNTER HQ</Text>
        </View>
      </View>
      
      <Pressable style={styles.settingsButton} accessibilityRole="button">
        <Settings size={20} color={colors.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
    width: '100%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentLine: {
    width: 2,
    height: 32,
    backgroundColor: '#8B5CF6', // Purple matching reference
    marginRight: 12,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 22,
    color: colors.text.primary,
    letterSpacing: 2,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12, // Hexagon-like squircle appearance
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

