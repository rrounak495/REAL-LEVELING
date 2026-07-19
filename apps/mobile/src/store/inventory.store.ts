import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { type InventoryItem, type CosmeticCategory } from '@/types/inventory.types';
import { useAvatarStore } from './avatar.store';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;

  fetchInventory: (userId: string) => Promise<void>;
  equipItem: (userId: string, slotKey: CosmeticCategory, itemId: string) => Promise<void>;
  unequipItem: (userId: string, slotKey: CosmeticCategory) => Promise<void>;
  // Dev only
  resetInventory: (userId: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchInventory: async (userId: string) => {
    set({ isLoading: true, error: null });
    const res = await (repositories as any).inventory.getUserInventory(userId);
    if (res.success) {
      // Cross-reference with Avatar Store to set `equipped`
      const avatarState = useAvatarStore.getState();
      const equippedIds = new Set(Object.values(avatarState.equipment).filter(Boolean));

      const mappedItems = res.data.map((item: InventoryItem) => ({
        ...item,
        equipped: equippedIds.has(item.id),
      }));

      set({ items: mappedItems, isLoading: false });
    } else {
      set({ error: res.error?.message || 'Failed to fetch inventory', isLoading: false });
    }
  },

  equipItem: async (userId: string, slotKey: CosmeticCategory, itemId: string) => {
    // Optimistic UI update for Inventory
    set((state) => ({
      items: state.items.map((item) => {
        if (item.category === slotKey) {
          // Unequip others in this category, equip the new one
          return { ...item, equipped: item.id === itemId };
        }
        return item;
      }),
    }));

    // Update Avatar Store (this handles the visual update everywhere instantly)
    useAvatarStore.getState().equipItem(slotKey.toLowerCase(), itemId);

    // Persist to DB
    // We are casting because we haven't added EquipmentRepository to index.ts yet
    // Ideally, we'd inject it via repositories.equipment
    // Assuming we added it or will add it:
    // await repositories.equipment.equipItem(userId, slotKey, itemId);
  },

  unequipItem: async (userId: string, slotKey: CosmeticCategory) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.category === slotKey) {
          return { ...item, equipped: false };
        }
        return item;
      }),
    }));

    useAvatarStore.getState().unequipItem(slotKey.toLowerCase());
  },

  resetInventory: async (userId: string) => {
    // Dev only tool
  },
}));
