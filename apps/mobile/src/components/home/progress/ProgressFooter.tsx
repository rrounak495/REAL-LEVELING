import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressFooterProps {
  summary?: string | undefined;
}

export const ProgressFooter = memo(function ProgressFooter({ summary }: ProgressFooterProps) {
  if (!summary) return null;

  return (
    <View style={styles.container}>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.text}>
        {summary}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 28, // generous spacing to separate from grid
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#6B7280', // text.muted
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
