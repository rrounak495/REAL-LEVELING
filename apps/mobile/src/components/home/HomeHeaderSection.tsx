import React, { memo } from 'react';
import { View } from 'react-native';
import { HeaderGreeting } from './header/HeaderGreeting';
import { HeaderAvatar } from './header/HeaderAvatar';
import { HeaderActions } from './header/HeaderActions';

export interface HomeHeaderSectionProps {
  greeting?: string;
  hunterName?: string;
  hunterLevel?: number;
  currentXp?: number;
  xpRequiredForNext?: number;
  avatarUri?: string | null;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export const HomeHeaderSection = memo(function HomeHeaderSection(props: HomeHeaderSectionProps) {
  const {
    greeting,
    hunterName,
    hunterLevel,
    currentXp,
    xpRequiredForNext,
    avatarUri,
    onAvatarPress,
    onNotificationPress,
    onSettingsPress,
  } = props;

  return (
    <View
      accessibilityRole="header"
      className="flex-row items-center w-full"
      style={{ paddingTop: 8, paddingBottom: 8 }}
    >
      {/* LEFT — Avatar */}
      <HeaderAvatar imageUri={avatarUri} onPress={onAvatarPress} />

      {/* CENTER — Greeting + Name + Level */}
      <View style={{ flex: 1, paddingHorizontal: 14 }}>
        <HeaderGreeting
          currentXp={currentXp}
          greeting={greeting}
          hunterLevel={hunterLevel}
          hunterName={hunterName}
          xpRequiredForNext={xpRequiredForNext}
        />
      </View>

      {/* RIGHT — Actions (Notification + Settings) */}
      <HeaderActions onNotificationPress={onNotificationPress} onSettingsPress={onSettingsPress} />
    </View>
  );
});
