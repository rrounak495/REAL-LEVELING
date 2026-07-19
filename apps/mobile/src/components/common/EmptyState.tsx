import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
// import { PackageOpen } from 'lucide-react-native'; // Native SVG crash
import Animated, { FadeInUp } from 'react-native-reanimated';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No Items Found',
  message = "You don't have any items in this category yet.",
  icon,
}: EmptyStateProps) {
  return (
    <Animated.View entering={FadeInUp.springify()} style={styles.container}>
      <View style={styles.iconContainer}>{icon || <Text style={{ fontSize: 48 }}>📦</Text>}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(200, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 0, 255, 0.3)',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
