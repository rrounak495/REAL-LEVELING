import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GoalFooterProps {
  statusMessage?: string;
}

export const GoalFooter = memo(function GoalFooter({ statusMessage }: GoalFooterProps) {
  if (!statusMessage) return null;

  return (
    <View style={styles.container}>
      <Text numberOfLines={2} style={styles.text}>
        {statusMessage}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 32, // space.8 — visual separation without a heavy border
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#6B7280', // text.muted
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center', // Center it to ground the card visually
  },
});
