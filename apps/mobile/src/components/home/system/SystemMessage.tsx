import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';

interface SystemMessageProps {
  text: string;
}

export const SystemMessage = memo(function SystemMessage({ text }: SystemMessageProps) {
  return (
    <Text accessibilityRole="text" ellipsizeMode="tail" numberOfLines={3} style={styles.message}>
      {text}
    </Text>
  );
});

const styles = StyleSheet.create({
  message: {
    fontFamily: 'Exo2_600SemiBold', // Heading type for readability & geometry
    fontSize: 18,
    lineHeight: 26,
    color: '#F4F4FF', // text.primary
    letterSpacing: 0.2,
  },
});
