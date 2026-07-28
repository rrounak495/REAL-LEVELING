import { repositories } from '@/db/repositories';
import { type Result } from '@/lib/errors';
import { type ShopItem } from '@/types/inventory.types';

export class ShopService {
  async getShopCatalog(): Promise<Result<ShopItem[]>> {
    const res = await (
      repositories as unknown as { inventory: { getAllItems: () => Promise<Result<any[]>> } }
    ).inventory.getAllItems();
    if (!res.success) return res as never;

    const shopItems: ShopItem[] = res.data.map((item: any) => ({
      ...item,
      isFeatured: false,
      isComingSoon: false,
      isLocked: false, // Calculate based on user level
    }));

    return { success: true, data: shopItems };
  }

  async purchaseItem(
    userId: string,
    itemId: string,
    currency: 'Coin' | 'Gem',
    price: number,
  ): Promise<Result<void>> {
    // Uses progression repository to check balances, deduct price, then inserts into user_inventory via inventory repository
    return { success: true, data: undefined }; // Mocked success
  }
}
