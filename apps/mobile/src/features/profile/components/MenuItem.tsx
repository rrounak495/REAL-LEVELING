import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, fontFamily } from '@theme';

export interface MenuItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  subtitle: string;
  showDivider?: boolean;
  onPress?: () => void;
}

export function MenuItem({ icon, iconBgColor, title, subtitle, showDivider = true, onPress }: MenuItemProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={20} color="#6B7280" />
      </Pressable>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 15,
    color: '#F9FAFB',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 72, // 16 (padding) + 40 (icon) + 16 (margin)
    marginRight: 16,
  },
});

