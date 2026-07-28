import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { type InventoryItem } from '@/types/inventory.types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
// import { Lock, CheckCircle2 } from 'lucide-react-native'; // Native SVG crash

interface InventoryCardProps {
  item: InventoryItem;
  onPress: (item: InventoryItem) => void;
}

export function InventoryCard({ item, onPress }: InventoryCardProps) {
  const isPressed = useSharedValue(0);
  const particleAnim = useSharedValue(0);

  React.useEffect(() => {
    if (item.rarity === 'Legendary') {
      particleAnim.value = withRepeat(
        withSequence(withTiming(1, { duration: 2000 }), withTiming(0, { duration: 2000 })),
        -1,
        true,
      );
    }
  }, [item.rarity]);

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
    <Pressable
      style={styles.wrapper}
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

          {!item.owned && (
            <View style={styles.overlay}>
              <Text style={{ fontSize: 24, color: colors.text.primary }}>🔒</Text>
            </View>
          )}

          {item.equipped && (
            <View style={styles.equippedBadge}>
              <Text style={{ fontSize: 16, color: colors.semantic.successNeon }}>✅</Text>
              <Text style={styles.equippedText}>Equipped</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.rarity,
              {
                color:
                  rarityStyle.glow === 'transparent' ? colors.text.secondary : rarityStyle.glow,
              },
            ]}
          >
            {item.rarity}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
    aspectRatio: 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg.surface,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
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
  equippedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.semantic.successNeon,
    gap: 4,
  },
  equippedText: {
    color: colors.semantic.successNeon,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
  },
  name: {
    color: colors.text.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  rarity: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
