import React, { memo } from 'react';
import { View, Pressable, Image } from 'react-native';

interface HeaderAvatarProps {
  imageUri?: string | null | undefined;
  onPress?: (() => void) | undefined;
}

export const HeaderAvatar = memo(function HeaderAvatar({ imageUri, onPress }: HeaderAvatarProps) {
  return (
    <Pressable
      accessibilityLabel="View profile"
      accessibilityRole="button"
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={{ width: 36, height: 36, borderRadius: 18, overflow: 'hidden' }}
      onPress={onPress}
    >
      {imageUri ? (
        // accessibilityLabel removed from Image — the parent Pressable
        // already describes this element to screen readers.
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no"
          source={{ uri: imageUri }}
          style={{ width: 36, height: 36 }}
        />
      ) : (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#141428', // bg-elevated
            borderWidth: 1.5,
            borderColor: 'rgba(139, 60, 247, 0.45)',
          }}
        />
      )}
    </Pressable>
  );
});
