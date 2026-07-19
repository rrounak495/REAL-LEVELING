import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { useInventoryStore } from '@/store/inventory.store';
import { useAvatarStore } from '@/store/avatar.store';
import { EquipmentSlotCard } from '@/components/equipment/EquipmentSlotCard';
import { AvatarPreview } from '@/components/common/AvatarPreview';
import { type EquipmentSlotKey, type InventoryItem } from '@/types/inventory.types';

// The slots that are supported for the avatar
const EQUIPMENT_SLOTS: { key: EquipmentSlotKey; label: string }[] = [
  { key: 'Helmet', label: 'Helmet' },
  { key: 'Hair', label: 'Hair' },
  { key: 'Face', label: 'Face' },
  { key: 'Armor', label: 'Armor' },
  { key: 'Weapon', label: 'Weapon' },
  { key: 'Gloves', label: 'Gloves' },
  { key: 'Boots', label: 'Boots' },
  { key: 'Ring', label: 'Ring' },
  { key: 'Aura', label: 'Aura' },
  { key: 'Background', label: 'Background' },
  { key: 'ProfileFrame', label: 'Profile Frame' },
  { key: 'Title', label: 'Title' },
  { key: 'Animation', label: 'Animation' },
];

export function EquipmentScreen({ navigation }: any) {
  const { items } = useInventoryStore();
  const { equipment } = useAvatarStore();

  // Find the full item details for each equipped ID
  const getEquippedItem = (slotKey: string): InventoryItem | null => {
    const dbKey = `${slotKey.toLowerCase()}_id`;
    const equippedId = equipment[dbKey];
    if (!equippedId) return null;
    return items.find((item) => item.id === equippedId) || null;
  };

  const handleSlotPress = (slotKey: EquipmentSlotKey) => {
    // Navigate to Inventory Screen and set the category filter to this slot
    navigation.navigate('InventoryScreen', { category: slotKey });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Equipment</Text>
      </View>

      {/* Live Avatar Preview Section */}
      <View style={styles.previewSection}>
        <AvatarPreview />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.slotsGrid}>
          {EQUIPMENT_SLOTS.map((slot) => (
            <View key={slot.key} style={styles.slotContainer}>
              <EquipmentSlotCard
                item={getEquippedItem(slot.key)}
                slotKey={slot.key}
                onPress={handleSlotPress}
              />
              <Text style={styles.slotLabel}>{slot.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.bg.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.elevated,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  previewSection: {
    height: 350,
    backgroundColor: colors.bg.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.elevated,
  },
  scrollContent: {
    padding: 20,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  slotContainer: {
    alignItems: 'center',
  },
  slotLabel: {
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
  },
});
