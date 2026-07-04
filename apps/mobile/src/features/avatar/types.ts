/**
 * src/features/avatar/types.ts
 *
 * Domain types for the Avatar Engine.
 * AvatarConfig is the serializable representation stored in Supabase.
 * All layer IDs are string keys that map to visual assets in the constants files.
 *
 * Evolution support: A single config is valid at any level. Future sprint will
 * add unlocked tiers (e.g. Stage 1 = Lv1-9, Stage 2 = Lv10-24...) by
 * adding a `stage` field here. // Sprint 3B+
 */

/** All supported avatar base models / archetypes */
export type AvatarBaseModel =
  | 'default_male'
  | 'default_female'
  | 'default_nonbinary'
  | 'warrior_male'
  | 'warrior_female'
  | 'mage_male'
  | 'mage_female';

/** The full serializable avatar configuration — stored as JSON in Supabase */
export interface AvatarConfig {
  base_model: AvatarBaseModel;
  hair_id: string | null;
  hair_color: string | null;
  eyes_id: string | null;
  eye_color: string | null;
  outfit_id: string | null;
  aura_id: string | null;
  accessory_id: string | null;
}

/** Default config applied to new users before they customize */
export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  base_model: 'default_male',
  hair_id: 'short_straight',
  hair_color: '#1a1a2e',
  eyes_id: 'sharp',
  eye_color: '#8B3CF7',
  outfit_id: 'hunter_basic',
  aura_id: null,
  accessory_id: null,
};

/** Layer render order — bottom to top */
export const AVATAR_LAYER_ORDER = ['base', 'aura', 'outfit', 'eyes', 'hair', 'accessory'] as const;

export type AvatarLayerKey = (typeof AVATAR_LAYER_ORDER)[number];

/** A single option within a customizable layer */
export interface AvatarLayerOption {
  id: string;
  label: string;
  /** Hex color used to render the placeholder shape */
  previewColor: string;
  /** Which base models this option is compatible with */
  compatibleModels: AvatarBaseModel[] | 'all';
  /** True if option requires a level milestone to unlock // Sprint 3B+ */
  isLocked?: boolean;
}

/** Definition of a customizable avatar layer */
export interface AvatarLayerDefinition {
  key: AvatarLayerKey;
  label: string;
  configField: keyof AvatarConfig;
  colorField: keyof AvatarConfig | null;
  options: AvatarLayerOption[];
}
