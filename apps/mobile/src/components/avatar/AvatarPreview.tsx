/**
 * src/components/avatar/AvatarPreview.tsx
 *
 * The core Avatar Engine renderer.
 *
 * Architecture:
 * Layers are rendered as absolute-positioned Views stacked via z-index,
 * in AVATAR_LAYER_ORDER order (bottom → top). Each layer is a colored
 * shape that represents the future art asset for that slot.
 *
 * When real art assets are supplied:
 * 1. Replace each <View> with an <Image source={layerAssetMap[id]} />
 * 2. Use the same absolute-position container — zero architecture changes needed
 *
 * The aura layer renders a radial glow ring around the avatar using
 * border + shadow to simulate the neon aura effect without native modules.
 *
 * Sizes:
 *   sm  — 80×80  (leaderboard rows, friend list)
 *   md  — 140×140 (profile card)
 *   lg  — 220×220 (avatar builder preview)
 *   xl  — 300×300 (full-screen profile reveal)
 */
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '@theme';
import type { AvatarConfig } from '@/features/avatar/types';
import { AURA_OPTIONS } from '@/features/avatar/constants/layers';

type AvatarPreviewSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarPreviewProps {
  config: AvatarConfig;
  size?: AvatarPreviewSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarPreviewSize, number> = {
  sm: 80,
  md: 140,
  lg: 220,
  xl: 300,
};

export function AvatarPreview({ config, size = 'md', style }: AvatarPreviewProps) {
  const dim = SIZE_MAP[size];
  const scale = dim / 220; // normalize to lg as base

  // Resolve aura color from options
  const auraOption = AURA_OPTIONS.find((o) => o.id === config.aura_id);
  const auraColor = auraOption?.previewColor ?? 'transparent';
  const hasAura = config.aura_id && config.aura_id !== 'none' && auraColor !== 'transparent';

  return (
    <View
      accessibilityLabel="Avatar preview"
      accessibilityRole="image"
      style={[styles.container, { width: dim, height: dim }, style]}
    >
      {/* ── Layer 1: Aura ring (rendered behind body) ── */}
      {hasAura && (
        <View
          style={[
            styles.auraRing,
            {
              width: dim * 1.1,
              height: dim * 1.1,
              top: -dim * 0.05,
              left: -dim * 0.05,
              borderColor: auraColor,
              shadowColor: auraColor,
              borderRadius: dim * 0.55,
              shadowRadius: 24 * scale,
            },
          ]}
        />
      )}

      {/* ── Layer 2: Base body silhouette ── */}
      <View
        style={[
          styles.base,
          {
            width: dim * 0.45,
            height: dim * 0.65,
            top: dim * 0.18,
            left: dim * 0.275,
            borderRadius: (dim * 0.45) / 2,
            backgroundColor: colors.bg.overlay,
            borderColor: 'rgba(139, 60, 247, 0.3)',
          },
        ]}
      />
      {/* Head */}
      <View
        style={[
          styles.base,
          {
            width: dim * 0.38,
            height: dim * 0.38,
            top: dim * 0.04,
            left: dim * 0.31,
            borderRadius: dim * 0.19,
            backgroundColor: 'rgba(20,20,40,0.85)',
            borderColor: 'rgba(139, 60, 247, 0.25)',
          },
        ]}
      />

      {/* ── Layer 3: Outfit overlay ── */}
      {config.outfit_id && (
        <View
          style={[
            styles.layerView,
            {
              width: dim * 0.42,
              height: dim * 0.4,
              top: dim * 0.42,
              left: dim * 0.29,
              borderRadius: 8 * scale,
              backgroundColor: 'rgba(20,20,40,0.7)',
              borderColor: 'rgba(139, 60, 247, 0.2)',
            },
          ]}
        />
      )}

      {/* ── Layer 4: Eyes ── */}
      {config.eyes_id && (
        <>
          <View
            style={[
              styles.eyeView,
              {
                width: 10 * scale,
                height: 10 * scale,
                borderRadius: 5 * scale,
                top: dim * 0.22,
                left: dim * 0.35,
                backgroundColor: config.eye_color ?? colors.purple[500],
                shadowColor: config.eye_color ?? colors.purple[500],
              },
            ]}
          />
          <View
            style={[
              styles.eyeView,
              {
                width: 10 * scale,
                height: 10 * scale,
                borderRadius: 5 * scale,
                top: dim * 0.22,
                left: dim * 0.55,
                backgroundColor: config.eye_color ?? colors.purple[500],
                shadowColor: config.eye_color ?? colors.purple[500],
              },
            ]}
          />
        </>
      )}

      {/* ── Layer 5: Hair ── */}
      {config.hair_id && (
        <View
          style={[
            styles.layerView,
            {
              width: dim * 0.42,
              height: dim * 0.22,
              top: dim * 0.02,
              left: dim * 0.29,
              borderRadius: (dim * 0.42) / 2,
              backgroundColor: config.hair_color ?? '#4A1A9E',
              borderColor: 'rgba(200,0,255,0.2)',
            },
          ]}
        />
      )}

      {/* ── Layer 6: Accessory overlay ── */}
      {config.accessory_id && config.accessory_id !== 'none' && (
        <View
          style={[
            styles.layerView,
            {
              width: dim * 0.12,
              height: dim * 0.08,
              top: dim * 0.22,
              left: dim * 0.29,
              borderRadius: 4 * scale,
              backgroundColor: colors.gold[400],
              borderColor: colors.gold[500],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  auraRing: {
    position: 'absolute',
    borderWidth: 2,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  base: {
    position: 'absolute',
    borderWidth: 1,
  },
  layerView: {
    position: 'absolute',
    borderWidth: 1,
  },
  eyeView: {
    position: 'absolute',
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
});
