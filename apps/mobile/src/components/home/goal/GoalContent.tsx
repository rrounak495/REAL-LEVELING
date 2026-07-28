import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GoalContentProps {
  /** Primary goal statement. Max 2 lines, ellipsized if longer. */
  title: string;
  /** Optional elaboration. Collapses completely when absent or empty. */
  description?: string | undefined;
}

export const GoalContent = memo(function GoalContent({ title, description }: GoalContentProps) {
  const hasDescription = Boolean(description?.trim());

  return (
    <View style={styles.container}>
      <Text
        accessible
        accessibilityRole="text"
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.title}
      >
        {title}
      </Text>

      {/* Description — rendered only when non-empty */}
      {hasDescription && (
        <Text ellipsizeMode="tail" numberOfLines={3} style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8, // space.2 - breathing room between title and description
    marginBottom: 16, // space.4 - push progress section down to establish hierarchy
  },
  title: {
    fontFamily: 'Rajdhani_700Bold', // Display type, dominant
    fontSize: 24, // smaller size for compact card
    lineHeight: 28,
    color: '#F4F4FF', // text.primary
    letterSpacing: -0.5, // tighter letter spacing for premium feel
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14, // body.md
    lineHeight: 22,
    color: '#9CA3C8', // text.secondary (better contrast than muted)
    letterSpacing: 0,
  },
});
