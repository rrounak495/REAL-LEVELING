import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, fontFamily, spacing } from '@theme';
import * as Haptics from 'expo-haptics';

interface LegalHeaderProps {
  title: string;
}

export const LegalHeader = ({ title }: LegalHeaderProps) => {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.bg.void,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  placeholder: {
    width: 40,
  },
});
