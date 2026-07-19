/**
 * src/components/avatar/EvolutionGallery.tsx
 *
 * Premium horizontal gallery showing all 6 avatar stages.
 * Handles current stage highlighting, unlocked states, and locked states.
 * Plays unlock animations when a new stage is reached.
 */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { useAuthStore } from '@/store/auth.store';
import { colors, fontFamily, radius, elevation } from '@theme';

const EVOLUTION_STAGES = [
  { level: 1, name: 'Novice' },
  { level: 10, name: 'Apprentice' },
  { level: 25, name: 'Elite' },
  { level: 50, name: 'Master' },
  { level: 75, name: 'Legend' },
  { level: 100, name: 'Mythic' },
];

interface GalleryThumbnailProps {
  stage: { level: number; name: string };
  status: 'locked' | 'unlocked' | 'current';
  gender: 'male' | 'female';
  isNewlyUnlocked: boolean;
}

function GalleryThumbnail({ stage, status, gender, isNewlyUnlocked }: GalleryThumbnailProps) {
  // Resolve image source
  let imageSource;
  switch (stage.level) {
    case 1:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 1.jpg')
          : require('../../../assets/avatar-assets/female/female level 1.jpg');
      break;
    case 10:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 10.jpg')
          : require('../../../assets/avatar-assets/female/female level 10.jpg');
      break;
    case 25:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 25.jpg')
          : require('../../../assets/avatar-assets/female/female level 25.jpg');
      break;
    case 50:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 50.jpg')
          : require('../../../assets/avatar-assets/female/female level 50.jpg');
      break;
    case 75:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 75.jpg')
          : require('../../../assets/avatar-assets/female/female level 75.jpg');
      break;
    case 100:
      imageSource =
        gender === 'male'
          ? require('../../../assets/avatar-assets/male/male level 100.jpg')
          : require('../../../assets/avatar-assets/female/female level 100.jpg');
      break;
    default:
      imageSource = require('../../../assets/avatar-assets/male/male level 1.jpg');
  }

  const scale = useSharedValue(status === 'current' ? 1.1 : 1);
  const glowOpacity = useSharedValue(status === 'current' ? 0.6 : 0);
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    if (status === 'current') {
      scale.value = withSpring(1.1, { damping: 12, stiffness: 90 });
      glowOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 1500 }), withTiming(0.4, { duration: 1500 })),
        -1,
        true,
      );
    } else {
      scale.value = withSpring(1, { damping: 15 });
      glowOpacity.value = withTiming(0);
    }

    if (isNewlyUnlocked && status === 'current') {
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 800 }),
      );
    }
  }, [status, isNewlyUnlocked]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const getBorderColor = () => {
    if (status === 'current') return colors.purple.neon;
    if (status === 'unlocked') return colors.gold[500];
    return 'rgba(255,255,255,0.1)';
  };

  return (
    <Animated.View style={[styles.thumbnailContainer, containerStyle]}>
      {/* Glow Layer */}
      {status === 'current' && <Animated.View style={[styles.glowLayer, glowStyle]} />}

      {/* Main Card */}
      <View style={[styles.thumbnailCard, { borderColor: getBorderColor() }]}>
        <Image
          resizeMode="cover"
          source={imageSource}
          style={[styles.thumbnailImage, status === 'locked' && styles.lockedImage]}
        />

        {/* Locked Overlay */}
        {status === 'locked' && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockedText}>Lv.{stage.level}</Text>
          </View>
        )}

        {/* Flash Effect on Unlock */}
        <Animated.View pointerEvents="none" style={[styles.flashOverlay, flashStyle]} />
      </View>

      <Text style={[styles.stageName, status === 'current' && styles.currentStageName]}>
        {stage.name}
      </Text>
      {status !== 'locked' && <Text style={styles.stageLevel}>Lv.{stage.level}</Text>}
    </Animated.View>
  );
}

interface EvolutionGalleryProps {
  currentLevel: number;
}

export function EvolutionGallery({ currentLevel }: EvolutionGalleryProps) {
  const user = useAuthStore((s) => s.user);
  const gender = (user?.user_metadata?.gender as 'male' | 'female') || 'male';
  const scrollViewRef = useRef<ScrollView>(null);
  const previousLevelRef = useRef(currentLevel);
  const [newlyUnlockedLevel, setNewlyUnlockedLevel] = useState<number | null>(null);

  const currentEvolution =
    EVOLUTION_STAGES.slice()
      .reverse()
      .find((s) => currentLevel >= s.level) || EVOLUTION_STAGES[0]!;

  useEffect(() => {
    // Check if we just evolved to a new stage
    const oldEvolution =
      EVOLUTION_STAGES.slice()
        .reverse()
        .find((s) => previousLevelRef.current >= s.level) || EVOLUTION_STAGES[0]!;

    if (currentEvolution.level > oldEvolution.level) {
      setTimeout(() => setNewlyUnlockedLevel(currentEvolution.level), 0);
      // Reset animation flag after 2 seconds
      setTimeout(() => setNewlyUnlockedLevel(null), 2000);
    }

    previousLevelRef.current = currentLevel;
  }, [currentLevel, currentEvolution.level]);

  useEffect(() => {
    // Auto-scroll to current stage
    if (scrollViewRef.current) {
      const index = EVOLUTION_STAGES.findIndex((s) => s.level === currentEvolution.level);
      if (index >= 0) {
        // Approximate width calculation (item width + gap)
        scrollViewRef.current.scrollTo({
          x: index * 104 - Dimensions.get('window').width / 2 + 52,
          animated: true,
        });
      }
    }
  }, [currentEvolution.level]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        snapToInterval={104} // 88 item + 16 gap
      >
        {EVOLUTION_STAGES.map((stage) => {
          let status: 'locked' | 'unlocked' | 'current' = 'locked';
          if (stage.level === currentEvolution.level) status = 'current';
          else if (stage.level < currentEvolution.level) status = 'unlocked';

          return (
            <GalleryThumbnail
              key={stage.level}
              gender={gender}
              isNewlyUnlocked={newlyUnlockedLevel === stage.level}
              stage={stage}
              status={status}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    alignItems: 'center',
  },
  thumbnailContainer: {
    alignItems: 'center',
    width: 88,
  },
  thumbnailCard: {
    width: 88,
    height: 120,
    borderRadius: radius.md,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    ...elevation.sm,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  lockedImage: {
    opacity: 0.3,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockedText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 11,
    color: colors.text.muted,
  },
  glowLayer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4 + 24, // adjust for text at bottom
    borderRadius: radius.lg,
    backgroundColor: colors.purple.neon,
    zIndex: -1,
    shadowColor: colors.purple.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  stageName: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  currentStageName: {
    fontFamily: fontFamily.exo2.bold,
    color: colors.purple[300],
    textShadowColor: colors.purple.neon,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  stageLevel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
});
