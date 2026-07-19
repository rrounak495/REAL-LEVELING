// src/features/inventory/services/InventoryService.ts

import { repositories } from '@/db/repositories';
import { type Result } from '@/lib/errors';
import { type InventoryItem, type CosmeticCategory } from '@/types/inventory.types';

export class InventoryService {
  async getUserInventory(userId: string): Promise<Result<InventoryItem[]>> {
    // Assuming repositories.inventory is injected in index.ts and has getUserInventory
    return await (repositories as any).inventory.getUserInventory(userId);
  }

  async equipItem(
    userId: string,
    slotKey: CosmeticCategory,
    itemId: string,
  ): Promise<Result<void>> {
    // Requires equipment repository
    return await (repositories as any).equipment.equipItem(userId, slotKey, itemId);
  }

  // Dev helpers
  async resetInventory(userId: string): Promise<Result<void>> {
    // Implementation for resetting dev inventory
    return { success: true, data: undefined };
  }
}
