import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { type ShopItem } from '@/types/inventory.types';
import { useInventoryStore } from './inventory.store';
// Assuming auth store exists for userId/coins/gems

interface ShopState {
  items: ShopItem[];
  isLoading: boolean;
  error: string | null;

  fetchShopItems: () => Promise<void>;
  purchaseItem: (
    userId: string,
    itemId: string,
    currency: 'Coin' | 'Gem',
    price: number,
  ) => Promise<boolean>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchShopItems: async () => {
    set({ isLoading: true, error: null });
    // Assuming shop service or inventory repository provides this
    const res = await (repositories as any).inventory.getAllItems();
    if (res.success) {
      // Add Shop specific fields
      const shopItems: ShopItem[] = res.data.map((item: any) => ({
        ...item,
        isFeatured: Boolean(item.is_featured),
        isComingSoon: false,
        isLocked: false, // Could check level requirements here
      }));
      set({ items: shopItems, isLoading: false });
    } else {
      set({ error: res.error?.message || 'Failed to fetch shop items', isLoading: false });
    }
  },

  purchaseItem: async (userId: string, itemId: string, currency: 'Coin' | 'Gem', price: number) => {
    set({ isLoading: true, error: null });

    try {
      // Refresh inventory so the new item shows up
      await useInventoryStore.getState().fetchInventory(userId);
      set({ isLoading: false });
      return true;
    } catch (error) {
       set({ isLoading: false, error: 'Purchase failed' });
       return false;
    }
  },
}));
