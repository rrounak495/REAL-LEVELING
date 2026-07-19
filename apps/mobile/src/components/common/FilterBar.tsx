import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
// import { Search, Filter } from 'lucide-react-native'; // Native SVG crash

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
}

export function FilterBar({ searchQuery, onSearchChange, onFilterPress }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={[{ fontSize: 20 }, styles.searchIcon]}>🔍</Text>
        <TextInput
          placeholder="Search items..."
          placeholderTextColor={colors.text.muted}
          style={styles.input}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      {onFilterPress && (
        <View style={styles.filterButton} onTouchEnd={onFilterPress}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    height: '100%',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
