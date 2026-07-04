/**
 * src/features/avatar/constants/layers.ts
 *
 * Complete layer definitions for the Avatar Engine.
 * Each entry defines the user-facing options for a customizable layer.
 *
 * Palette-based colors are provided so the AvatarPreview can render
 * meaningful placeholder shapes until real art assets are supplied.
 */
import type { AvatarLayerDefinition } from '../types';

export const HAIR_OPTIONS: AvatarLayerDefinition['options'] = [
  { id: 'short_straight', label: 'Straight Cut', previewColor: '#4A1A9E', compatibleModels: 'all' },
  { id: 'wild_spiky', label: 'Wild Spiky', previewColor: '#8B3CF7', compatibleModels: 'all' },
  { id: 'long_flow', label: 'Long Flow', previewColor: '#C084FC', compatibleModels: 'all' },
  { id: 'undercut', label: 'Undercut', previewColor: '#6B2FCC', compatibleModels: 'all' },
  { id: 'twin_tails', label: 'Twin Tails', previewColor: '#A855F7', compatibleModels: 'all' },
  { id: 'fade_cut', label: 'Fade', previewColor: '#2A0E60', compatibleModels: 'all' },
];

export const EYES_OPTIONS: AvatarLayerDefinition['options'] = [
  { id: 'sharp', label: 'Sharp', previewColor: '#8B3CF7', compatibleModels: 'all' },
  { id: 'calm', label: 'Calm', previewColor: '#5E78F8', compatibleModels: 'all' },
  { id: 'fierce', label: 'Fierce', previewColor: '#FF4444', compatibleModels: 'all' },
  { id: 'gentle', label: 'Gentle', previewColor: '#00FF88', compatibleModels: 'all' },
  { id: 'mysterious', label: 'Mysterious', previewColor: '#C800FF', compatibleModels: 'all' },
];

export const OUTFIT_OPTIONS: AvatarLayerDefinition['options'] = [
  {
    id: 'hunter_basic',
    label: 'Hunter Robe',
    previewColor: '#141428',
    compatibleModels: 'all',
  },
  {
    id: 'warrior_armor',
    label: 'Warrior Armor',
    previewColor: '#1A2E80',
    compatibleModels: ['warrior_male', 'warrior_female'],
  },
  {
    id: 'mage_robe',
    label: 'Mage Robe',
    previewColor: '#2A0E60',
    compatibleModels: ['mage_male', 'mage_female'],
  },
  {
    id: 'casual_dark',
    label: 'Dark Casual',
    previewColor: '#1C1C38',
    compatibleModels: 'all',
  },
];

export const AURA_OPTIONS: AvatarLayerDefinition['options'] = [
  { id: 'none', label: 'None', previewColor: 'transparent', compatibleModels: 'all' },
  {
    id: 'purple_surge',
    label: 'Purple Surge',
    previewColor: '#8B3CF7',
    compatibleModels: 'all',
  },
  { id: 'blue_flame', label: 'Blue Flame', previewColor: '#3B5BF6', compatibleModels: 'all' },
  { id: 'golden_god', label: 'Golden God', previewColor: '#FFD700', compatibleModels: 'all' },
  {
    id: 'crimson_void',
    label: 'Crimson Void',
    previewColor: '#FF2244',
    compatibleModels: 'all',
    isLocked: true,
  },
];

export const ACCESSORY_OPTIONS: AvatarLayerDefinition['options'] = [
  { id: 'none', label: 'None', previewColor: 'transparent', compatibleModels: 'all' },
  {
    id: 'eye_patch',
    label: 'Eye Patch',
    previewColor: '#0E0E1C',
    compatibleModels: 'all',
  },
  { id: 'earrings', label: 'Earrings', previewColor: '#FFD700', compatibleModels: 'all' },
  { id: 'bandana', label: 'Bandana', previewColor: '#4A1A9E', compatibleModels: 'all' },
];

/** Ordered layer definitions — drives the Avatar Customizer UI tabs */
export const AVATAR_LAYER_DEFINITIONS: AvatarLayerDefinition[] = [
  {
    key: 'base',
    label: 'Base',
    configField: 'base_model',
    colorField: null,
    options: [
      { id: 'default_male', label: 'Male', previewColor: '#0E0E1C', compatibleModels: 'all' },
      { id: 'default_female', label: 'Female', previewColor: '#141428', compatibleModels: 'all' },
      {
        id: 'default_nonbinary',
        label: 'Non-Binary',
        previewColor: '#1C1C38',
        compatibleModels: 'all',
      },
    ],
  },
  {
    key: 'hair',
    label: 'Hair',
    configField: 'hair_id',
    colorField: 'hair_color',
    options: HAIR_OPTIONS,
  },
  {
    key: 'eyes',
    label: 'Eyes',
    configField: 'eyes_id',
    colorField: 'eye_color',
    options: EYES_OPTIONS,
  },
  {
    key: 'outfit',
    label: 'Outfit',
    configField: 'outfit_id',
    colorField: null,
    options: OUTFIT_OPTIONS,
  },
  {
    key: 'aura',
    label: 'Aura',
    configField: 'aura_id',
    colorField: null,
    options: AURA_OPTIONS,
  },
  {
    key: 'accessory',
    label: 'Accessory',
    configField: 'accessory_id',
    colorField: null,
    options: ACCESSORY_OPTIONS,
  },
];

/** Color swatches available for layers that support color customization */
export const AVATAR_HAIR_COLORS = [
  { id: '#1a1a2e', label: 'Void Black' },
  { id: '#4A1A9E', label: 'Deep Purple' },
  { id: '#8B3CF7', label: 'Neon Purple' },
  { id: '#C800FF', label: 'Magenta' },
  { id: '#FF4444', label: 'Red' },
  { id: '#FFD700', label: 'Gold' },
  { id: '#00FF88', label: 'Emerald' },
  { id: '#00B4FF', label: 'Cyan' },
  { id: '#F4F4FF', label: 'White' },
] as const;

export const AVATAR_EYE_COLORS = [
  { id: '#8B3CF7', label: 'Neon Purple' },
  { id: '#C800FF', label: 'Magenta' },
  { id: '#3B5BF6', label: 'Electric Blue' },
  { id: '#00B4FF', label: 'Cyan' },
  { id: '#00FF88', label: 'Emerald' },
  { id: '#FF4444', label: 'Scarlet' },
  { id: '#FFD700', label: 'Gold' },
  { id: '#F4F4FF', label: 'Silver' },
] as const;
