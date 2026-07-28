import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '@/theme/colors';
import { useInventoryStore } from '@/store/inventory.store';
import { useAuthStore } from '@/store/auth.store';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { CategoryTabs } from '@/components/common/CategoryTabs';
import { FilterBar } from '@/components/common/FilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { AvatarPreview } from '@/components/common/AvatarPreview';
import { type InventoryItem } from '@/types/inventory.types';

const CATEGORIES = [
  'All',
  'Helmet',
  'Hair',
  'Face',
  'Armor',
  'Weapon',
  'Gloves',
  'Boots',
  'Ring',
  'Aura',
  'Background',
  'ProfileFrame',
  'Title',
  'Animation',
];

export function InventoryScreen() {
  const { items, isLoading, fetchInventory, equipItem } = useInventoryStore();
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (userId) {
      fetchInventory(userId);
    }
  }, [userId, fetchInventory]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemPress = (item: InventoryItem) => {
    if (userId) {
      equipItem(userId, item.category, item.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Avatar Preview Section */}
      <View style={styles.previewSection}>
        <AvatarPreview />
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.purple.neon} size="large" />
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={
            <EmptyState
              message={
                searchQuery
                  ? 'Try a different search term'
                  : "You haven't acquired any items in this category yet."
              }
              title={searchQuery ? 'No matching items' : 'Inventory Empty'}
            />
          }
          contentContainerStyle={styles.gridContent}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => <InventoryCard item={item} onPress={handleItemPress} />}
        />
      )}
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
  gridContent: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
