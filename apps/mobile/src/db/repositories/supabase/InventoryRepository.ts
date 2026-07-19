// src/db/repositories/supabase/InventoryRepository.ts

import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/database.types';
// Types for rows and inserts
type AvatarUnlockRow = Database['public']['Tables']['avatar_unlocks']['Row'];
type UserAvatarUnlockRow = Database['public']['Tables']['user_avatar_unlocks']['Row'];
type UserAvatarUnlockInsert = Database['public']['Tables']['user_avatar_unlocks']['Insert'];

/**
 * Repository handling inventory, shop items and equipment.
 * Uses the existing `avatar_unlocks` table (extended for shop items) and
 * `user_avatar_unlocks` for user owned cosmetics.
 */
export class InventoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  // ------------------------------------------------------------
  // Shop items (available for purchase)
  // ------------------------------------------------------------
  async getShopItems() {
    const { data, error } = await this.supabase
      .from('avatar_unlocks')
      .select('*')
      .eq('unlock_method', 'shop');
    return { data: data as AvatarUnlockRow[], error };
  }

  // ------------------------------------------------------------
  // User inventory (owned cosmetics)
  // ------------------------------------------------------------
  async getUserInventory(userId: string) {
    const { data, error } = await this.supabase
      .from('user_avatar_unlocks')
      .select('*, unlock!inner(*)')
      .eq('user_id', userId);
    return { data: data as UserAvatarUnlockRow[], error };
  }

  // ------------------------------------------------------------
  // Purchase flow – inserts a row into user_avatar_unlocks
  // ------------------------------------------------------------
  async purchaseItem(userId: string, unlockId: string) {
    const insert: UserAvatarUnlockInsert = {
      user_id: userId,
      unlock_id: unlockId,
    };
    const { data, error } = await this.supabase.from('user_avatar_unlocks').insert(insert);
    return { data, error };
  }

  // ------------------------------------------------------------
  // Equip item – updates avatar config slot with the unlock id
  // ------------------------------------------------------------
  async equipItem(userId: string, slot: string, unlockId: string) {
    const update = { [slot]: unlockId } as any;
    const { data, error } = await this.supabase
      .from('avatar_configs')
      .update(update)
      .eq('id', userId)
      .select();
    return { data, error };
  }

  // ------------------------------------------------------------
  // Reset inventory – removes all user ownership rows (dev only)
  // ------------------------------------------------------------
  async resetInventory(userId: string) {
    const { data, error } = await this.supabase
      .from('user_avatar_unlocks')
      .delete()
      .eq('user_id', userId);
    return { data, error };
  }
}
