import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { AnimatedXPBar } from '@/components/ui/AnimatedXPBar';

interface HeaderGreetingProps {
  greeting?: string | undefined;
  hunterName?: string | undefined;
  hunterLevel?: number | undefined;
  currentXp?: number | undefined;
  xpRequiredForNext?: number | undefined;
}

export const HeaderGreeting = memo(function HeaderGreeting({
  greeting = 'Good Morning',
  hunterName = 'HUNTER',
  hunterLevel = 1,
  currentXp = 0,
  xpRequiredForNext = 1000,
}: HeaderGreetingProps) {
  return (
    <View className="flex-1 justify-center gap-y-0.5 pr-3">
      {/* Line 1 — Greeting */}
      <Text
        className="font-mono text-label-caps text-text-muted uppercase tracking-widest"
        numberOfLines={1}
      >
        {greeting}
      </Text>

      {/* Line 2 — Hunter Name */}
      <Text
        accessibilityRole="header"
        className="font-rajdhani text-heading-md text-text-primary tracking-wide"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {hunterName}
      </Text>

      {/* Line 3 — Hunter Level & XP */}
      <View className="flex-row items-center gap-x-2 mt-0">
        <Text
          className="font-exo-2 text-body-xs text-purple-400 tracking-wider uppercase"
          numberOfLines={1}
        >
          Level {hunterLevel}
        </Text>
        <View className="flex-1 max-w-[100px]">
          <AnimatedXPBar currentXP={currentXp} height={4} requiredXP={xpRequiredForNext} />
        </View>
      </View>
    </View>
  );
});
