/**
 * src/types/inventory.types.ts
 */

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export type UnlockMethod =
  'Level' | 'Achievement' | 'ShopPurchase' | 'Event' | 'Season' | 'BossReward';

export type CosmeticCategory =
  | 'Helmet'
  | 'Hair'
  | 'Face'
  | 'Armor'
  | 'Weapon'
  | 'Gloves'
  | 'Boots'
  | 'Ring'
  | 'Aura'
  | 'Background'
  | 'ProfileFrame'
  | 'Title'
  | 'Animation';

// For this project, every cosmetic category is an equipable slot
export type EquipmentSlotKey = CosmeticCategory;

export interface Item {
  id: string;
  name: string;
  description: string;
  lore: string;
  category: CosmeticCategory;
  rarity: Rarity;
  unlockMethod: UnlockMethod;
  requiredLevel: number;
  requiredRank: string | null;
  coinPrice: number;
  gemPrice: number;
  imagePath?: any; // require path for local assets
}

export interface InventoryItem extends Item {
  owned: boolean;
  equipped: boolean;
}

export interface ShopItem extends Item {
  isFeatured: boolean;
  isComingSoon: boolean;
  isLocked: boolean; // if unlock requirements not met
}
