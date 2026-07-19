import React from 'react';
import { View, StyleSheet, Image, type ViewStyle } from 'react-native';
import { useAvatarStore } from '@/store/avatar.store';
import { colors } from '@/theme/colors';

interface AvatarPreviewProps {
  style?: ViewStyle;
  previewEquipment?: Record<string, string | null>; // Inject temporary equipment changes for live preview
}

export function AvatarPreview({ style, previewEquipment }: AvatarPreviewProps) {
  const { gender, getAvatarImage, equipment } = useAvatarStore();
  const baseImage = getAvatarImage();

  // Merge base equipment with preview equipment
  const displayEquipment = {
    ...equipment,
    ...previewEquipment,
  };

  // In a real implementation, we would load transparent PNG layers based on the displayEquipment IDs
  // For the prototype, we just display the base evolution model
  return (
    <View style={[styles.container, style]}>
      {/* Background Layer */}
      {displayEquipment.background_id && <View style={styles.layer} />}

      {/* Base Avatar Model Layer */}
      <Image source={baseImage} style={styles.avatarImage} />

      {/* Aura Layer */}
      {displayEquipment.aura_id && (
        <View style={[styles.layer, { backgroundColor: 'rgba(200, 0, 255, 0.1)' }]} />
      )}

      {/* Cosmetics Layers (Armor, Helmet, Weapon, etc.) */}
      {/* This would map over slots and render images in correct z-index order */}

      {/* Profile Frame Layer */}
      {displayEquipment.frame_id && (
        <View
          style={[
            styles.layer,
            { borderWidth: 4, borderColor: colors.gold.neon, borderRadius: 12 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  layer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
