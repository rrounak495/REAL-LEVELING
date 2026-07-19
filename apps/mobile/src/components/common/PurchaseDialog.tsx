import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { type ShopItem } from '@/types/inventory.types';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
// import { X } from 'lucide-react-native'; // Native SVG crash
import { RarityBadge } from './RarityBadge';

interface PurchaseDialogProps {
  visible: boolean;
  item: ShopItem | null;
  onClose: () => void;
  onPurchase: (item: ShopItem, currency: 'Coin' | 'Gem', price: number) => void;
  isLoading: boolean;
}

export function PurchaseDialog({
  visible,
  item,
  onClose,
  onPurchase,
  isLoading,
}: PurchaseDialogProps) {
  if (!visible || !item) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.duration(200)}
          style={styles.content}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ fontSize: 24, color: colors.text.secondary }}>❌</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.imageContainer}>
              {item.imagePath ? (
                <Image source={item.imagePath} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.name}>{item.name}</Text>
              <RarityBadge rarity={item.rarity} size="sm" />
              <Text style={styles.category}>{item.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>
          {item.lore ? <Text style={styles.lore}>"{item.lore}"</Text> : null}

          <View style={styles.divider} />

          <View style={styles.actions}>
            {item.coinPrice > 0 && (
              <TouchableOpacity
                disabled={isLoading}
                style={[styles.buyButton, styles.buyCoin]}
                onPress={() => onPurchase(item, 'Coin', item.coinPrice)}
              >
                <Text style={styles.buttonText}>Buy with 🪙 {item.coinPrice}</Text>
              </TouchableOpacity>
            )}

            {item.gemPrice > 0 && (
              <TouchableOpacity
                disabled={isLoading}
                style={[styles.buyButton, styles.buyGem]}
                onPress={() => onPurchase(item, 'Gem', item.gemPrice)}
              >
                <Text style={styles.buttonText}>Buy with 💎 {item.gemPrice}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bg.scrim,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.bg.elevated,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.bg.elevated,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg.overlay,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text.primary,
  },
  category: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.secondary,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 12,
    lineHeight: 24,
  },
  lore: {
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.bg.elevated,
    marginVertical: 20,
  },
  actions: {
    gap: 12,
  },
  buyButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buyCoin: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: colors.gold.neon,
  },
  buyGem: {
    backgroundColor: 'rgba(200, 0, 255, 0.1)',
    borderColor: colors.purple.neon,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.primary,
  },
});
