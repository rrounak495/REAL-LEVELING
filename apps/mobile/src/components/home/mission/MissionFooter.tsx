import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MissionFooterProps {
  summary?: string | undefined;
}

export const MissionFooter = memo(function MissionFooter({ summary }: MissionFooterProps) {
  if (!summary) return null;

  return (
    <View style={styles.container}>
      <Text numberOfLines={2} style={styles.text}>
        {summary}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 24, // space.6
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 60, 247, 0.12)', // subtle border matching goal card footer
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#6B7280', // text.muted
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
