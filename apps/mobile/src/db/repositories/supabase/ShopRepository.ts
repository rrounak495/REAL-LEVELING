// src/db/repositories/supabase/ShopRepository.ts

import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/database.types';

// Types for shop items (avatar_unlocks rows with shop specific fields)
type ShopItemRow = Database['public']['Tables']['avatar_unlocks']['Row'];

/**
 * Repository dedicated to shop‑related queries.
 * Keeps the responsibilities separate from InventoryRepository for clarity.
 */
export class ShopRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  // Get all shop items (unlock_method = 'shop')
  async getAllShopItems() {
    const { data, error } = await this.supabase
      .from('avatar_unlocks')
      .select('*')
      .eq('unlock_method', 'shop');
    return { data: data as ShopItemRow[], error };
  }

  // Get featured items – for now just the first 5 shop items
  async getFeaturedItems(limit: number = 5) {
    const { data, error } = await this.supabase
      .from('avatar_unlocks')
      .select('*')
      .eq('unlock_method', 'shop')
      .order('rarity', { ascending: false })
      .limit(limit);
    return { data: data as ShopItemRow[], error };
  }

  async getCategories() {
    const { data, error } = await this.supabase
      .from('avatar_unlocks')
      .select('category')
      .eq('unlock_method', 'shop');

    // Manually get unique categories
    const categories = data ? Array.from(new Set(data.map((d: any) => d.category))) : [];
    return { data: categories as string[], error };
  }
}
