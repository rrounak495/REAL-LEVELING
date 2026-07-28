import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '@/theme/colors';
import { useShopStore } from '@/store/shop.store';
import { useAuthStore } from '@/store/auth.store';
import { ShopItemCard } from '@/components/shop/ShopItemCard';
import { CategoryTabs } from '@/components/common/CategoryTabs';
import { FilterBar } from '@/components/common/FilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { PurchaseDialog } from '@/components/common/PurchaseDialog';
import { AvatarPreview } from '@/components/common/AvatarPreview';
import { type ShopItem } from '@/types/inventory.types';

const CATEGORIES = ['All', 'Featured', 'Armor', 'Weapons', 'Aura', 'Titles', 'Backgrounds'];

export function ShopScreen() {
  const { items, isLoading, fetchShopItems, purchaseItem } = useShopStore();
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [previewEquipment, setPreviewEquipment] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetchShopItems();
  }, [fetchShopItems]);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'Featured' && !item.isFeatured) return false;
    if (
      selectedCategory !== 'All' &&
      selectedCategory !== 'Featured' &&
      item.category !== selectedCategory
    )
      return false;

    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const handleItemPress = (item: ShopItem) => {
    // Show live preview immediately when selected
    const dbKey = `${item.category.toLowerCase()}_id`;
    setPreviewEquipment({ [dbKey]: item.id });

    // Open purchase dialog
    setSelectedItem(item);
  };

  const handlePurchase = async (item: ShopItem, currency: 'Coin' | 'Gem', price: number) => {
    if (!userId) return;

    setIsPurchasing(true);
    const success = await purchaseItem(userId, item.id, currency, price);
    setIsPurchasing(false);

    if (success) {
      setSelectedItem(null); // Close dialog on success
      // Note: We don't equip automatically here based on prompt logic unless specified,
      // but prompt says "Buy -> Equip", so we might want to equip it, but user might want to decide.
      // Usually after buy, they get an option to equip.
    }
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setPreviewEquipment({}); // Reset preview
  };

  return (
    <View style={styles.container}>
      {/* Live Avatar Preview Section */}
      <View style={styles.previewSection}>
        <AvatarPreview previewEquipment={previewEquipment} />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </View>

      {/* Grid Section */}
      {isLoading && !isPurchasing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.purple.neon} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredItems.length === 0 ? (
            <EmptyState
              message="More items coming soon!"
              title={searchQuery ? 'No matching items' : 'Shop Empty'}
            />
          ) : (
            <View style={styles.itemsGrid}>
              {filteredItems.map((item, index) => (
                <ShopItemCard key={item.id} index={index} item={item} onPress={handleItemPress} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Purchase Confirmation Popup */}
      <PurchaseDialog
        isLoading={isPurchasing}
        item={selectedItem}
        visible={!!selectedItem}
        onClose={handleCloseDialog}
        onPurchase={handlePurchase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  previewSection: {
    height: 300,
    backgroundColor: colors.bg.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.elevated,
  },
  filterSection: {
    backgroundColor: colors.bg.base,
    zIndex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
