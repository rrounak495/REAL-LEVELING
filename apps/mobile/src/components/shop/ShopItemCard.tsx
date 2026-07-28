import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { type ShopItem } from '@/types/inventory.types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
// import { Lock } from 'lucide-react-native'; // Native SVG crash
import { RarityBadge } from '../common/RarityBadge';

interface ShopItemCardProps {
  item: ShopItem;
  onPress: (item: ShopItem) => void;
  index: number;
}

export function ShopItemCard({ item, onPress, index }: ShopItemCardProps) {
  const isPressed = useSharedValue(0);

  const getRarityColors = () => {
    switch (item.rarity) {
      case 'Legendary':
        return { glow: colors.purple.neon, border: colors.purple[400] };
      case 'Epic':
        return { glow: colors.purple[500], border: colors.purple[600] };
      case 'Rare':
        return { glow: colors.blue.neon, border: colors.blue[500] };
      default:
        return { glow: 'transparent', border: colors.bg.elevated };
    }
  };

  const rarityStyle = getRarityColors();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(isPressed.value ? 0.95 : 1, { duration: 150 }) }],
      borderColor: isPressed.value ? rarityStyle.glow : rarityStyle.border,
      shadowColor: rarityStyle.glow,
      shadowOpacity: withTiming(isPressed.value ? 0.8 : item.rarity === 'Legendary' ? 0.5 : 0),
      shadowRadius: withTiming(isPressed.value ? 15 : 8),
    };
  });

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()} style={styles.wrapper}>
      <Pressable
        onPress={() => onPress(item)}
        // eslint-disable-next-line react-hooks/immutability
        onPressIn={() => (isPressed.value = 1)}
        // eslint-disable-next-line react-hooks/immutability
        onPressOut={() => (isPressed.value = 0)}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.imageContainer}>
            {item.imagePath ? (
              <Image source={item.imagePath} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}

            {item.isLocked && (
              <View style={styles.overlay}>
                <Text style={{ fontSize: 24, color: colors.text.primary }}>🔒</Text>
              </View>
            )}

            <View style={styles.rarityBadgeContainer}>
              <RarityBadge animated={false} rarity={item.rarity} size="sm" />
            </View>
          </View>

          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.priceContainer}>
              {item.coinPrice > 0 && (
                <View style={styles.priceTag}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.priceText}>{item.coinPrice}</Text>
                </View>
              )}
              {item.gemPrice > 0 && (
                <View style={styles.priceTag}>
                  <Text style={styles.gemIcon}>💎</Text>
                  <Text style={styles.priceText}>{item.gemPrice}</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 140,
    marginRight: 16,
    marginBottom: 16,
  },
  container: {
    backgroundColor: colors.bg.surface,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: colors.bg.elevated,
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
    width: 60,
    height: 60,
    backgroundColor: colors.bg.overlay,
    borderRadius: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityBadgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
  },
  name: {
    color: colors.text.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  priceText: {
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  coinIcon: {
    fontSize: 12,
  },
  gemIcon: {
    fontSize: 12,
  },
});
