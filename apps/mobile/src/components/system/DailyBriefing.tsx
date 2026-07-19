import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
// import { BlurView } from 'expo-blur'; // Temporarily removed to prevent native crash
import Animated, { FadeIn, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { useSystemStore } from '@/store/system.store';
import { useProgressionStore } from '@/store/progression.store';
import { useAuthStore } from '@/store/auth.store';
// import { ChevronRight } from 'lucide-react-native'; // Native SVG crash

export function DailyBriefing() {
  const { hasViewedBriefing, markBriefingViewed, insights, nextBestAction } = useSystemStore();
  const { currentLevel, currentRank } = useProgressionStore();
  const user = useAuthStore((s) => s.user);
  const username = user?.user_metadata?.username || 'Hunter';

  if (hasViewedBriefing) return null;

  return (
    <Modal statusBarTranslucent transparent animationType="none" visible={true}>
      <View className="flex-1 bg-theme-bg-void/95">
        {/* Background Visuals */}
        <Animated.View className="absolute inset-0" entering={FadeIn.duration(1000)}>
          <View className="absolute inset-0 bg-theme-neon-purple opacity-10" />
        </Animated.View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <Animated.View entering={SlideInDown.delay(300).duration(800)}>
            <Text className="text-theme-neon-purple font-rajdhani-bold text-lg tracking-[0.2em] mb-1">
              SYSTEM BOOT SEQUENCE
            </Text>
            <Text className="text-white font-exo-bold text-4xl mb-6">
              WELCOME BACK,{'\n'}
              <Text className="text-theme-neon-purple">{username.toUpperCase()}</Text>
            </Text>

            <View className="flex-row items-center space-x-4 mb-8">
              <View className="bg-theme-bg-dark border border-theme-border/50 px-4 py-2 rounded-md">
                <Text className="text-theme-text-muted font-exo-semibold text-xs">
                  CURRENT LEVEL
                </Text>
                <Text className="text-white font-rajdhani-bold text-xl">{currentLevel}</Text>
              </View>
              <View className="bg-theme-bg-dark border border-theme-border/50 px-4 py-2 rounded-md">
                <Text className="text-theme-text-muted font-exo-semibold text-xs">
                  CURRENT RANK
                </Text>
                <Text className="text-theme-rank-s font-rajdhani-bold text-xl">{currentRank}</Text>
              </View>
            </View>

            {/* Next Best Action */}
            {nextBestAction && (
              <Animated.View
                className="bg-theme-bg-dark border border-theme-neon-purple rounded-xl p-5 mb-6 shadow-[0_0_15px_rgba(196,155,255,0.3)]"
                entering={ZoomIn.delay(800)}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-theme-neon-purple font-rajdhani-bold text-sm tracking-wider">
                    PRIMARY OBJECTIVE
                  </Text>
                  <View className="h-2 w-2 rounded-full bg-theme-neon-purple" />
                </View>
                <Text className="text-white font-exo-bold text-xl mb-1">
                  {nextBestAction.title}
                </Text>
                <Text className="text-theme-text-muted font-exo-medium text-sm leading-relaxed">
                  {nextBestAction.description}
                </Text>
              </Animated.View>
            )}

            {/* Other Insights */}
            {insights
              .filter((i) => i.id !== nextBestAction?.id)
              .slice(0, 2)
              .map((insight, index) => (
                <Animated.View
                  key={insight.id}
                  className="bg-theme-bg-dark/50 border border-theme-border/30 rounded-xl p-4 mb-3"
                  entering={SlideInDown.delay(1000 + index * 200)}
                >
                  <Text className="text-theme-text font-exo-bold text-base mb-1">
                    {insight.title}
                  </Text>
                  <Text className="text-theme-text-muted font-exo-medium text-sm">
                    {insight.description}
                  </Text>
                </Animated.View>
              ))}

            <Animated.View className="mt-10" entering={FadeIn.delay(1500)}>
              <TouchableOpacity
                className="bg-theme-neon-purple rounded-xl flex-row items-center justify-center p-4"
                onPress={markBriefingViewed}
              >
                <Text className="text-white font-exo-bold text-lg mr-2">
                  BEGIN TODAY'S LEVELING
                </Text>
                <Text style={{ fontSize: 24, color: 'white' }}>➡️</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
}
