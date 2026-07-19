import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import { BlurView } from 'expo-blur'; // Temporarily removed to prevent native crash
import Animated, { FadeIn, SlideInDown, ZoomIn, FadeOut } from 'react-native-reanimated';
import { useAuthStore } from '@/store/auth.store';
import { AnalyticsService } from '@/services/AnalyticsService';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CheckCircle2 } from 'lucide-react-native'; // Native SVG crash

interface FirstUseGuideProps {
  guideId: string;
  title: string;
  hints: string[];
  onComplete?: () => void;
}

export function FirstUseGuide({ guideId, title, hints, onComplete }: FirstUseGuideProps) {
  const [visible, setVisible] = useState(false);
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;

    // Check local cache first for instant UX
    const cacheKey = `@guide_completed_${guideId}`;
    AsyncStorage.getItem(cacheKey).then((isCompletedLocally) => {
      if (isCompletedLocally === 'true') {
        return; // Already completed
      }

      // Fallback to Supabase check
      supabase
        .from('first_use_guides')
        .select('completed_at')
        .eq('user_id', userId)
        .eq('guide_id', guideId)
        .single()
        .then(({ data, error }) => {
          if (!data && !error) {
            setVisible(true); // Guide not found, show it
          } else if (data) {
            // Found in DB, update local cache
            AsyncStorage.setItem(cacheKey, 'true');
          }
        });
    });
  }, [userId, guideId]);

  const handleComplete = async () => {
    if (!userId) return;

    setVisible(false);
    AnalyticsService.track('first_use_guide_completed', { guideId });
    if (onComplete) onComplete();

    // Optimistic cache update
    await AsyncStorage.setItem(`@guide_completed_${guideId}`, 'true');

    // Persist to Supabase
    await supabase.from('first_use_guides').upsert({
      user_id: userId,
      guide_id: guideId,
    });
  };

  if (!visible) return null;

  return (
    <Modal statusBarTranslucent transparent animationType="none" visible={visible}>
      <View className="flex-1 justify-center items-center px-6 bg-theme-bg-void/95">
        <Animated.View
          className="bg-theme-bg-darker border border-theme-neon-purple/50 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_20px_rgba(196,155,255,0.15)]"
          entering={ZoomIn.duration(500).springify()}
          exiting={FadeOut.duration(300)}
        >
          <Text className="text-theme-neon-purple font-rajdhani-bold text-2xl tracking-widest text-center mb-6">
            {title.toUpperCase()}
          </Text>

          <View className="space-y-4 mb-8">
            {hints.slice(0, 3).map((hint, index) => (
              <Animated.View
                key={index}
                className="flex-row items-start"
                entering={SlideInDown.delay(200 + index * 150).duration(400)}
              >
                <View className="mt-1 mr-3">
                  <Text style={{ fontSize: 18, color: '#C49BFF' }}>✅</Text>
                </View>
                <Text className="text-theme-text font-exo-medium text-base flex-1">{hint}</Text>
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeIn.delay(800).duration(400)}>
            <TouchableOpacity
              className="bg-theme-neon-purple py-3 rounded-lg items-center"
              onPress={handleComplete}
            >
              <Text className="text-white font-exo-bold text-lg tracking-wide">CONTINUE</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}
