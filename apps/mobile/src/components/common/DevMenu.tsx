import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/theme/colors';
// import { Wrench } from 'lucide-react-native'; // Native SVG crash

export function DevMenu() {
  const [isOpen, setIsOpen] = useState(false);

  if (!__DEV__) return null;

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(true)}>
        <Text style={{ fontSize: 24 }}>🔧</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dev Tools</Text>
        <TouchableOpacity onPress={() => setIsOpen(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Grant Coins')}>
          <Text style={styles.buttonText}>Grant Coins (+1000)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Grant Gems')}>
          <Text style={styles.buttonText}>Grant Gems (+100)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Unlock All')}>
          <Text style={styles.buttonText}>Unlock All Cosmetics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Reset Inventory')}>
          <Text style={styles.buttonText}>Reset Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Equip All')}>
          <Text style={styles.buttonText}>Equip All (Test Set)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Remove Equipment')}>
          <Text style={styles.buttonText}>Remove All Equipment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.purple.neon,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 250,
    backgroundColor: colors.bg.elevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.purple.neon,
    padding: 16,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  closeText: {
    color: colors.text.muted,
    fontFamily: 'Inter-Medium',
  },
  button: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.surface,
  },
  buttonText: {
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
});
