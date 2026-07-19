import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { type EquipmentSlotKey, type InventoryItem } from '@/types/inventory.types';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import { Plus } from 'lucide-react-native'; // Native SVG crash

interface EquipmentSlotCardProps {
  slotKey: EquipmentSlotKey;
  item: InventoryItem | null;
  onPress: (slotKey: EquipmentSlotKey) => void;
}

export function EquipmentSlotCard({ slotKey, item, onPress }: EquipmentSlotCardProps) {
  const isPressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(isPressed.value ? 0.92 : 1, { duration: 150 }) }],
      borderColor: withTiming(isPressed.value ? colors.purple.neon : colors.bg.elevated),
      shadowColor: colors.purple.neon,
      shadowOpacity: withTiming(isPressed.value ? 0.5 : 0),
      shadowRadius: withTiming(isPressed.value ? 10 : 0),
    };
  });

  const getRarityGlow = () => {
    if (!item) return 'transparent';
    switch (item.rarity) {
      case 'Legendary':
        return colors.purple.neon;
      case 'Epic':
        return colors.purple[500];
      case 'Rare':
        return colors.blue.neon;
      default:
        return 'transparent';
    }
  };

  const rarityGlow = getRarityGlow();

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => onPress(slotKey)}
      onPressIn={() => (isPressed.value = 1)}
      onPressOut={() => (isPressed.value = 0)}
    >
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          item && { borderColor: rarityGlow !== 'transparent' ? rarityGlow : colors.bg.elevated },
        ]}
      >
        {item ? (
          <View style={styles.itemContainer}>
            {item.imagePath ? (
              <Image source={item.imagePath} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={[styles.glowBackground, { backgroundColor: rarityGlow, opacity: 0.1 }]} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 24, color: colors.text.muted }}>➕</Text>
            <Text style={styles.emptyText}>{slotKey}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 72,
    height: 72,
    margin: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg.surface,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyText: {
    color: colors.text.muted,
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: 40,
    height: 40,
    backgroundColor: colors.bg.overlay,
    borderRadius: 20,
  },
  glowBackground: {
    ...StyleSheet.absoluteFill,
  },
});
