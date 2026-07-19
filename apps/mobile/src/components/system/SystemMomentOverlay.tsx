import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { BlurView } from 'expo-blur'; // Temporarily removed to prevent native crash
import Animated, { FadeIn, FadeOut, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { useSystemStore } from '@/store/system.store';
import { useAuthStore } from '@/store/auth.store';
import { type MomentType } from '@/types/system.types';
// import { X } from 'lucide-react-native'; // Native SVG crash

export function SystemMomentOverlay() {
  const { momentsQueue, markMomentViewed } = useSystemStore();
  const userId = useAuthStore((s) => s.user?.id);

  const activeMoment = momentsQueue.length > 0 ? momentsQueue[0] : null;

  if (!activeMoment || !userId) return null;

  const handleClose = () => {
    markMomentViewed(activeMoment.id, userId);
  };

  const getMomentContent = (type: MomentType, payload: any) => {
    switch (type) {
      case 'level_up':
        return {
          title: 'LEVEL UP',
          subtitle: `Hunter Level ${payload.level}`,
          image: null,
        };
      case 'rank_up':
        return {
          title: 'RANK ADVANCEMENT',
          subtitle: `New Rank: ${payload.rank}`,
          image: null, // Fallback placeholder
        };
      case 'boss_defeat':
        return {
          title: 'BOSS DEFEATED',
          subtitle: payload.bossName || 'Target Eliminated',
          image: null,
        };
      default:
        return {
          title: 'SYSTEM NOTIFICATION',
          subtitle: 'New Update Available',
          image: null,
        };
    }
  };

  const content = getMomentContent(activeMoment.moment_type, activeMoment.payload);

  return (
    <Modal statusBarTranslucent transparent animationType="none" visible={true}>
      <View className="flex-1 justify-center items-center bg-theme-bg-void/95">
        {/* Background Particles layer could go here */}
        <Animated.View
          className="absolute inset-0"
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <View className="absolute inset-0 bg-theme-bg-void opacity-50" />
        </Animated.View>

        <Animated.View
          className="items-center w-full px-6"
          entering={ZoomIn.duration(600).springify()}
          exiting={FadeOut.duration(300)}
        >
          {content.image && (
            <Image
              resizeMode="contain"
              source={content.image}
              style={{ width: 200, height: 200, marginBottom: 24 }}
            />
          )}

          <Animated.Text
            className="text-theme-neon-purple font-rajdhani-bold text-4xl tracking-widest text-center"
            entering={SlideInDown.delay(300).duration(500)}
          >
            {content.title}
          </Animated.Text>

          <Animated.Text
            className="text-theme-text font-exo-medium text-xl text-center mt-2"
            entering={SlideInDown.delay(500).duration(500)}
          >
            {content.subtitle}
          </Animated.Text>

          <Animated.View
            className="mt-12 w-full max-w-[200px]"
            entering={FadeIn.delay(1000).duration(500)}
          >
            <TouchableOpacity
              className="bg-theme-bg-dark border border-theme-neon-purple/50 py-3 rounded-lg items-center flex-row justify-center"
              onPress={handleClose}
            >
              <Text className="text-theme-neon-purple font-exo-bold">CONFIRM</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}
