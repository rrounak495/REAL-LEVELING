import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useSystemStore } from '@/store/system.store';
import { useAuthStore } from '@/store/auth.store';
import { type DailyChestStatus } from '@/types/system.types';

interface DailyChestProps {
  score: number; // 0-100
  status: DailyChestStatus;
}

export function DailyChest({ score, status }: DailyChestProps) {
  const { claimDailyChest, isLoading } = useSystemStore();
  const userId = useAuthStore((s) => s.user?.id);

  const handleClaim = () => {
    if (status === 'ready' && userId && !isLoading) {
      claimDailyChest(userId);
    }
  };

  const getChestEmoji = () => {
    switch (status) {
      case 'claimed':
        return '🔓';
      case 'ready':
        return '🎁';
      case 'charging':
        return '🔋';
      default:
        return '🔒';
    }
  };

  // Simple floating animation for ready state
  const floatStyle = useAnimatedStyle(() => {
    if (status === 'ready') {
      return {
        transform: [
          {
            translateY: withRepeat(
              withSequence(withTiming(-5, { duration: 1000 }), withTiming(0, { duration: 1000 })),
              -1,
              true,
            ),
          },
        ],
      };
    }
    return { transform: [{ translateY: 0 }] };
  });

  return (
    <View className="items-center justify-center p-4">
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={status !== 'ready' || isLoading}
        onPress={handleClaim}
      >
        <Animated.View className="relative items-center" style={[floatStyle]}>
          <View className="w-32 h-32 items-center justify-center bg-theme-bg-dark rounded-xl border border-theme-border/50">
            <Text style={{ fontSize: 64 }}>{getChestEmoji()}</Text>
          </View>
          {status === 'ready' && (
            <View className="absolute -bottom-2 bg-theme-neon-purple/20 border border-theme-neon-purple rounded-full px-3 py-1">
              <Text className="text-theme-neon-purple font-rajdhani-bold text-xs uppercase tracking-widest">
                Tap to Claim
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Progress Bar Container */}
      <View className="w-full max-w-xs mt-6 bg-theme-bg-dark rounded-full h-3 border border-theme-border/50 relative overflow-hidden">
        <Animated.View
          className="absolute left-0 top-0 bottom-0 bg-theme-neon-purple"
          style={{ width: `${Math.min(score, 100)}%` }}
        />

        {/* Milestone Markers */}
        {[25, 50, 75].map((milestone) => (
          <View
            key={milestone}
            className={`absolute top-0 bottom-0 w-[2px] z-10 ${score >= milestone ? 'bg-theme-neon-purple' : 'bg-theme-border/50'}`}
            style={{ left: `${milestone}%` }}
          />
        ))}
      </View>
      <Text className="text-theme-text-muted font-exo-semibold text-xs mt-2">
        {score} / 100 PROGRESS
      </Text>
    </View>
  );
}
