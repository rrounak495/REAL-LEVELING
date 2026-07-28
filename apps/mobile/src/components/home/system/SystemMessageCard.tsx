import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SystemHeader } from './SystemHeader';
import { SystemMessage } from './SystemMessage';
import type { SystemMessageData } from '@/types/system.types';

export interface SystemMessageCardProps {
  /** The data payload representing THE SYSTEM's communication. */
  data?: SystemMessageData;
}

export const SystemMessageCard = memo(function SystemMessageCard({ data }: SystemMessageCardProps) {
  // Graceful fallback for empty states or loading
  const messageText = data?.text || 'Observing hunter status...';

  return (
    <View
      accessibilityLabel={`System Message: ${messageText}`}
      accessibilityRole="summary"
      style={styles.card}
    >
      <SystemHeader badge={data?.badge} />
      <SystemMessage text={messageText} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#0A0A15', // bg-base tint, slightly darker than surface for void feel
    borderRadius: 12, // radius.md
    padding: 20, // space.5
    borderLeftWidth: 3, // HUD/technical structural element
    borderLeftColor: '#3B5BF6', // blue.500
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(59, 91, 246, 0.15)', // subtle tech border
  },
});
