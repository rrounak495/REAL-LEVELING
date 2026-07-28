import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DAYS_PER_ROW = 7;
const DOT_SIZE = 10;
const DOT_GAP = 8;

type DotState = 'completed' | 'today' | 'upcoming';

/** Returns the visual state of a single day dot. */
function getDotState(dayIndex: number, completedDays: number, currentDay: number): DotState {
  const dayNumber = dayIndex + 1;
  if (dayIndex < completedDays) return 'completed';
  if (dayNumber === currentDay) return 'today';
  return 'upcoming';
}

interface DayDotProps {
  state: DotState;
}

const DayDot = memo(function DayDot({ state }: DayDotProps) {
  return (
    <View
      style={[
        styles.dot,
        state === 'completed' && styles.dotCompleted,
        state === 'today' && styles.dotToday,
        state === 'upcoming' && styles.dotUpcoming,
      ]}
    />
  );
});

export interface GoalProgressProps {
  /** Total number of challenge days. Defaults to 21. */
  totalDays?: number;
  /** Current day number, 1-indexed. Defaults to 1. */
  currentDay?: number;
  /** Number of days the user has actually completed. Defaults to 0. */
  completedDays?: number;
  /** Overall completion percentage, 0–100. Defaults to 0. */
  percentComplete?: number;
}

export const GoalProgress = memo(function GoalProgress({
  totalDays = 21,
  currentDay = 1,
  completedDays = 0,
  percentComplete = 0,
}: GoalProgressProps) {
  // Memoize the row structure
  const rows = useMemo<number[][]>(() => {
    const result: number[][] = [];
    for (let i = 0; i < totalDays; i += DAYS_PER_ROW) {
      result.push(Array.from({ length: Math.min(DAYS_PER_ROW, totalDays - i) }, (_, j) => i + j));
    }
    return result;
  }, [totalDays]);

  const clampedDay = Math.min(Math.max(1, currentDay), totalDays);
  const clampedPercent = Math.min(100, Math.max(0, percentComplete));

  return (
    <View style={styles.container}>
      {/* Day counter + percentage row */}
      <View style={styles.metaRow}>
        <View style={styles.dayCounter}>
          <Text style={styles.dayNumber}>{clampedDay}</Text>
          <Text style={styles.dayTotal}> / {totalDays} DAYS</Text>
        </View>
        <Text style={styles.percentText}>{clampedPercent}%</Text>
      </View>

      {/* Day Dot Grid */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dotRow}>
            {row.map((dayIndex) => (
              <DayDot key={dayIndex} state={getDotState(dayIndex, completedDays, clampedDay)} />
            ))}
          </View>
        ))}
      </View>

      {/* Week labels */}
      <View style={styles.weekLabels}>
        {rows.map((row, rowIndex) => {
          const labelWidth = row.length * DOT_SIZE + (row.length - 1) * DOT_GAP;
          return (
            <Text
              key={rowIndex}
              numberOfLines={1}
              style={[styles.weekLabel, { width: labelWidth }]}
            >
              WK {rowIndex + 1}
            </Text>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    // Spacer provided by GoalContent's marginBottom
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16, // more space before the grid
  },
  dayCounter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dayNumber: {
    fontFamily: 'JetBrainsMono_700Bold', // Stat font
    fontSize: 28, // Stat.xl
    lineHeight: 32,
    color: '#F4F4FF', // text.primary
    letterSpacing: -0.5,
  },
  dayTotal: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280', // text.muted - softer than secondary
    marginLeft: 4,
    letterSpacing: 1,
  },
  percentText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#A855F7', // purple.400
  },
  grid: {
    gap: DOT_GAP,
  },
  dotRow: {
    flexDirection: 'row',
    gap: DOT_GAP,
  },
  weekLabels: {
    flexDirection: 'row',
    gap: DOT_GAP,
    marginTop: 8,
  },
  weekLabel: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#4B5280', // muted
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotCompleted: {
    backgroundColor: '#8B3CF7', // purple.500
  },
  dotToday: {
    width: DOT_SIZE + 2,
    height: DOT_SIZE + 2,
    borderRadius: (DOT_SIZE + 2) / 2,
    backgroundColor: '#C800FF', // neon purple
    elevation: 4,
    shadowColor: '#C800FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  dotUpcoming: {
    backgroundColor: '#1C1C38', // overlay
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.20)', // subtle border
  },
});
