/**
 * src/components/ui/ScreenContainer.tsx
 *
 * Base wrapper for all screens.
 * Handles: safe area insets, void background, status bar padding.
 * Use this as the outermost element of every screen to ensure
 * consistent edge-to-edge layout across all Android devices.
 */
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, useWindowDimensions } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@theme';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Whether to show the gradient background or solid void color */
  variant?: 'void' | 'surface';
  edges?: Edge[];
}

export function ScreenContainer({
  children,
  style,
  variant = 'void',
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const bgColor = variant === 'void' ? colors.bg.void : colors.bg.surface;

  // Provide more padding on larger devices (tablets), and standard 16/24 padding on phones.
  const horizontalPadding = width > 768 ? 48 : width > 400 ? 24 : 16;

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style="light" />
      <View style={[styles.contentContainer, { paddingHorizontal: horizontalPadding }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
