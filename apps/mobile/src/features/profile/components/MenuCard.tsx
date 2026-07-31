import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MenuCardProps {
  children: React.ReactNode;
}

export function MenuCard({ children }: MenuCardProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    overflow: 'hidden',
  },
});

