import React, { memo } from 'react';
import { View, Pressable, Text } from 'react-native';

interface HeaderActionsProps {
  onNotificationPress?: (() => void) | undefined;
  onSettingsPress?: (() => void) | undefined;
}

function IconButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress?: (() => void) | undefined;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="items-center justify-center rounded-pill bg-bg-elevated"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ width: 38, height: 38, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
    </Pressable>
  );
}

export const HeaderActions = memo(function HeaderActions({
  onNotificationPress,
  onSettingsPress,
}: HeaderActionsProps) {
  return (
    <View className="flex-col items-center gap-y-2">
      <IconButton icon="🔔" label="Notifications" onPress={onNotificationPress} />
      <IconButton icon="⚙️" label="Settings" onPress={onSettingsPress} />
    </View>
  );
});
