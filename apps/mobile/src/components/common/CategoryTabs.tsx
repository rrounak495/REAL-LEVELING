import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelect }: CategoryTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((cat, index) => {
          const isSelected = selectedCategory === cat;
          return (
            <Animated.View key={cat} entering={FadeIn.delay(index * 50)}>
              <TouchableOpacity
                style={[styles.tab, isSelected && styles.tabSelected]}
                onPress={() => onSelect(cat)}
              >
                <Text style={[styles.text, isSelected && styles.textSelected]}>{cat}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.elevated,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabSelected: {
    backgroundColor: 'rgba(200, 0, 255, 0.1)',
    borderColor: colors.purple.neon,
  },
  text: {
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  textSelected: {
    color: colors.purple.neon,
    fontFamily: 'Inter-Bold',
  },
});
