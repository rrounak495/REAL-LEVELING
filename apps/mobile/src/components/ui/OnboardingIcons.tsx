/**
 * src/components/ui/onboarding-icons/OnboardingIcons.tsx
 *
 * Inline SVG icon components for the onboarding flow.
 * Each SVG is hand-converted from the source .svg files to react-native-svg
 * TSX components. They accept a `color` prop so selected/unselected states
 * can tint via theme colors.
 *
 * NOTE: These require react-native-svg native module. If the native module
 * is not available (old dev client), they fall back to an emoji.
 */
import React from 'react';
import { View, Text } from 'react-native';

// Try to import react-native-svg. If not available, fall back gracefully.
let Svg: any, Circle: any, Path: any, Line: any, Rect: any;
try {
  const svgModule = require('react-native-svg');
  Svg = svgModule.Svg;
  Circle = svgModule.Circle;
  Path = svgModule.Path;
  Line = svgModule.Line;
  Rect = svgModule.Rect;
} catch {
  // Native module not available — use fallback (will render emoji)
  Svg = null;
}

interface IconProps {
  color?: string;
  size?: number;
  fallback?: string;
}

function FallbackEmoji({ emoji, size }: { emoji: string; size: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
    </View>
  );
}

// ── Hunter Male ──────────────────────────────────────────────────────────────
export function HunterMaleIcon({ color = '#fff', size = 64, fallback = '♂️' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Circle cx="50" cy="28" r="14" stroke={color} strokeWidth="4" />
      <Path
        d="M20 88 C20 58 33 48 50 48 C67 48 80 58 80 88"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M62 46 L88 20" stroke={color} strokeLinecap="round" strokeWidth="4" />
      <Path d="M88 20 L94 14" stroke={color} strokeLinecap="round" strokeWidth="5" />
      <Path
        d="M78 30 L88 20 L98 30"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </Svg>
  );
}

// ── Hunter Female ────────────────────────────────────────────────────────────
export function HunterFemaleIcon({ color = '#fff', size = 64, fallback = '♀️' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Circle cx="50" cy="26" r="13" stroke={color} strokeWidth="4" />
      <Path d="M37 34 C34 44 34 50 38 56" stroke={color} strokeLinecap="round" strokeWidth="3" />
      <Path d="M63 34 C66 44 66 50 62 56" stroke={color} strokeLinecap="round" strokeWidth="3" />
      <Path
        d="M24 88 C24 58 35 46 50 46 C65 46 76 58 76 88"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M50 46 L50 70" stroke={color} strokeLinecap="round" strokeWidth="3" />
      <Path d="M14 30 C14 46 20 58 30 62" stroke={color} strokeLinecap="round" strokeWidth="3.5" />
      <Circle cx="14" cy="30" fill={color} r="3" />
    </Svg>
  );
}

// ── Goal: Muscle Gain (💪) ────────────────────────────────────────────────
export function GoalMuscleIcon({ color = '#fff', size = 32, fallback = '💪' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Path
        d="M20 70 C20 55 26 50 34 50 C34 40 42 32 52 34 C64 36 68 46 64 56 C74 54 82 60 82 70 L82 78 L20 78 Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M20 70 L12 66" stroke={color} strokeLinecap="round" strokeWidth="4" />
      <Path d="M12 66 L12 54" stroke={color} strokeLinecap="round" strokeWidth="4" />
    </Svg>
  );
}

// ── Goal: Weight Loss / Fire (🔥) ────────────────────────────────────────────
export function GoalFireIcon({ color = '#fff', size = 32, fallback = '🔥' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Path
        d="M50 10 C56 26 70 32 70 52 C70 70 58 82 44 82 C28 82 18 70 20 54 C22 62 28 66 32 64 C28 54 30 42 40 34 C40 44 44 46 48 44 C42 36 46 20 50 10 Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </Svg>
  );
}

// ── Goal: General Fitness / Zen (🧘) ─────────────────────────────────────────
export function GoalZenIcon({ color = '#fff', size = 32, fallback = '🧘' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Circle cx="50" cy="26" r="10" stroke={color} strokeWidth="4" />
      <Path d="M50 38 L50 58" stroke={color} strokeLinecap="round" strokeWidth="4" />
      <Path d="M50 44 C40 44 32 52 26 46" stroke={color} strokeLinecap="round" strokeWidth="4" />
      <Path d="M50 44 C60 44 68 52 74 46" stroke={color} strokeLinecap="round" strokeWidth="4" />
      <Path
        d="M50 58 C34 58 24 68 24 78 L76 78 C76 68 66 58 50 58 Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M18 78 C24 70 30 70 34 78" stroke={color} strokeLinecap="round" strokeWidth="3" />
      <Path d="M82 78 C76 70 70 70 66 78" stroke={color} strokeLinecap="round" strokeWidth="3" />
    </Svg>
  );
}

// ── Location: Home (🏠) ──────────────────────────────────────────────────────
export function LocationHomeIcon({ color = '#fff', size = 32, fallback = '🏠' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Path
        d="M16 48 L50 18 L84 48"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M26 40 L26 82 L74 82 L74 40" stroke={color} strokeLinejoin="round" strokeWidth="4" />
      <Rect height="24" stroke={color} strokeWidth="3.5" width="12" x="44" y="58" />
      <Rect height="10" stroke={color} strokeWidth="3" width="10" x="60" y="52" />
    </Svg>
  );
}

// ── Location: Gym (🏋️) ──────────────────────────────────────────────────────
export function LocationGymIcon({ color = '#fff', size = 32, fallback = '🏋️' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Line stroke={color} strokeLinecap="round" strokeWidth="4" x1="14" x2="86" y1="50" y2="50" />
      <Rect height="24" rx="2" stroke={color} strokeWidth="4" width="10" x="8" y="38" />
      <Rect height="24" rx="2" stroke={color} strokeWidth="4" width="10" x="82" y="38" />
      <Rect height="40" rx="2" stroke={color} strokeWidth="4" width="8" x="20" y="30" />
      <Rect height="40" rx="2" stroke={color} strokeWidth="4" width="8" x="72" y="30" />
    </Svg>
  );
}

// ── Location: Outdoor (🌍) ────────────────────────────────────────────────
export function LocationOutdoorIcon({ color = '#fff', size = 32, fallback = '🌍' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Circle cx="76" cy="24" r="9" stroke={color} strokeWidth="3.5" />
      <Path
        d="M10 82 L36 42 L52 64 L62 50 L90 82 Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path d="M44 62 L50 68" stroke={color} strokeLinecap="round" strokeWidth="3" />
    </Svg>
  );
}

// ── Bell Premium (🔔) ────────────────────────────────────────────────────────
export function BellPremiumIcon({ color = '#fff', size = 80, fallback = '🔔' }: IconProps) {
  if (!Svg) return <FallbackEmoji emoji={fallback} size={size} />;
  return (
    <Svg fill="none" height={size} viewBox="0 0 100 100" width={size}>
      <Circle cx="50" cy="50" opacity={0.25} r="46" stroke={color} strokeWidth="1.5" />
      <Circle cx="50" cy="50" opacity={0.4} r="36" stroke={color} strokeWidth="1.5" />
      <Path
        d="M50 16 C38 16 30 26 30 40 C30 54 26 60 22 66 L78 66 C74 60 70 54 70 40 C70 26 62 16 50 16 Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <Path
        d="M42 72 C42 78 46 82 50 82 C54 82 58 78 58 72"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <Circle cx="50" cy="16" fill={color} r="4" />
      <Circle cx="76" cy="24" fill={color} opacity={0.8} r="2.5" />
      <Circle cx="20" cy="30" fill={color} opacity={0.6} r="2" />
    </Svg>
  );
}
