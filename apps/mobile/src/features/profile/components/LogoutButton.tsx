import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { colors, fontFamily } from '@theme';

export function LogoutButton() {
  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LogOut size={20} color="#EF4444" />
      <Text style={styles.text}>Log Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 40,
    paddingVertical: 14,
    width: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
  },
});

