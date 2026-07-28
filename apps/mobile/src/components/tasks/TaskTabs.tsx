/**
 * TaskTabs.tsx — Premium Segmented Tab Control
 *
 * Sprint 1: UI Foundation
 * Three-tab segmented control: Compulsory | My Tasks | Completed
 * Active tab uses purple gradient fill. Inactive tabs are transparent with muted text.
 */
import React, { memo, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, radius } from '@theme';

export type TaskTabKey = 'mytasks' | 'completed';

interface TaskTabsProps {
  activeTab: TaskTabKey;
  onTabChange: (tab: TaskTabKey) => void;
}

const TABS: { key: TaskTabKey; label: string }[] = [
  { key: 'mytasks', label: 'My tasks' },
  { key: 'completed', label: 'Completed' },
];

export const TaskTabs = memo(function TaskTabs({ activeTab, onTabChange }: TaskTabsProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorPosition = useSharedValue(0);

  const activeIndex = TABS.findIndex((t) => t.key === activeTab);
  const tabWidth = containerWidth / TABS.length;

  useEffect(() => {
    if (tabWidth > 0) {
      indicatorPosition.value = withSpring(activeIndex * tabWidth, {
        damping: 20,
        stiffness: 150,
      });
    }
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: tabWidth,
    };
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (tabKey: TaskTabKey) => {
    if (activeTab !== tabKey) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTabChange(tabKey);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Animated Sliding Indicator */}
      {containerWidth > 0 && <Animated.View style={[styles.indicator, indicatorStyle]} />}

      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={styles.tab}
            onPress={() => handlePress(tab.key)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4, // Account for container padding
    backgroundColor: colors.purple[600],
    borderRadius: radius.pill,
    shadowColor: colors.purple[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure text is above indicator
  },
  tabText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.muted,
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
