import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';
import { type InventoryItem, type Item } from '@/types/inventory.types';

// Let's create an interface that bypasses generated types if they are not up to date yet
export interface IInventoryRepository {
  getUserInventory(userId: string): Promise<Result<InventoryItem[]>>;
  getAllItems(): Promise<Result<Item[]>>;
}

export class InventoryRepository implements IInventoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAllItems(): Promise<Result<Item[]>> {
    try {
      const { data, error } = await this.supabase.from('inventory_items' as any).select('*');

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return {
        success: true,
        data: (data as any[]).map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          lore: row.lore,
          category: row.category,
          rarity: row.rarity,
          unlockMethod: row.unlock_method,
          requiredLevel: row.required_level,
          requiredRank: row.required_rank,
          coinPrice: row.coin_price,
          gemPrice: row.gem_price,
          imagePath: row.image_path,
        })),
      };
    } catch (e) {
      return { success: false, error: new DatabaseError('Failed to fetch items', e) };
    }
  }

  async getUserInventory(userId: string): Promise<Result<InventoryItem[]>> {
    try {
      // Get all owned items mapping
      const { data: ownedData, error: ownedError } = await this.supabase
        .from('user_inventory' as any)
        .select('item_id, acquired_at')
        .eq('user_id', userId);

      if (ownedError) {
        return { success: false, error: new DatabaseError(ownedError.message, ownedError) };
      }

      const ownedIds = new Set((ownedData as any[]).map((row) => row.item_id));

      // Fetch the actual item details
      const itemsRes = await this.getAllItems();
      if (!itemsRes.success) return itemsRes;

      const inventory: InventoryItem[] = itemsRes.data
        .filter((item) => ownedIds.has(item.id))
        .map((item) => ({
          ...item,
          owned: true,
          equipped: false, // will be resolved by store matching avatar_config
        }));

      return { success: true, data: inventory };
    } catch (e) {
      return { success: false, error: new DatabaseError('Failed to fetch user inventory', e) };
    }
  }
}
