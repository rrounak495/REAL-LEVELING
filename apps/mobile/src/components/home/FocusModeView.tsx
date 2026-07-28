import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import { type Mission as UIMission } from '@/types/mission.types';
import { Ionicons } from '@expo/vector-icons';

interface FocusModeViewProps {
  mission: UIMission;
  currentXp: number;
  onComplete: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onExit: () => void;
}

export const FocusModeView = memo(function FocusModeView({
  mission,
  currentXp,
  onComplete,
  onPause,
  onResume,
  onExit,
}: FocusModeViewProps) {
  useEffect(() => {
    const handleBackPress = () => {
      onExit();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, [onExit]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={onExit}>
        <Ionicons color="#F4F4FF" name="arrow-back" size={24} />
      </Pressable>
      <Text style={styles.focusLabel}>FOCUS MODE</Text>

      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        {mission.description && (
          <Text style={styles.missionDescription}>{mission.description}</Text>
        )}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>XP Reward: +{mission.reward.xp}</Text>
          <Text style={styles.statText}>Current XP: {currentXp}</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {mission.estimatedTimeMinutes ? `${mission.estimatedTimeMinutes}:00` : 'IN PROGRESS'}
        </Text>
        <Text style={styles.timerSubText}>Stay focused on the task.</Text>
      </View>

      {mission.status === 'paused' ? (
        <Pressable
          style={[styles.completeButton, { backgroundColor: '#FCD34D' }]}
          onPress={onResume}
        >
          <Text style={[styles.completeButtonText, { color: '#000' }]}>RESUME MISSION</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[
            styles.completeButton,
            { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#8B3CF7' },
          ]}
          onPress={onPause}
        >
          <Text style={styles.completeButtonText}>PAUSE MISSION</Text>
        </Pressable>
      )}

      <Pressable style={styles.completeButton} onPress={onComplete}>
        <Text style={styles.completeButtonText}>COMPLETE MISSION</Text>
      </Pressable>

      <Pressable style={styles.exitButton} onPress={onExit}>
        <Text style={styles.exitButtonText}>EXIT FOCUS</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 64,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusLabel: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    color: '#FCD34D',
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 32,
  },
  missionCard: {
    width: '100%',
    backgroundColor: 'rgba(20, 10, 40, 0.8)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.3)',
    marginBottom: 48,
  },
  missionTitle: {
    fontFamily: 'Exo2_600SemiBold',
    color: '#F4F4FF',
    fontSize: 24,
    marginBottom: 8,
  },
  missionDescription: {
    fontFamily: 'Inter_400Regular',
    color: '#9CA3C8',
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 60, 247, 0.1)',
  },
  statText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    color: '#8B3CF7',
    fontSize: 12,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    color: '#F4F4FF',
    fontSize: 48,
  },
  timerSubText: {
    fontFamily: 'Inter_400Regular',
    color: '#9CA3C8',
    fontSize: 14,
    marginTop: 8,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#8B3CF7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  completeButtonText: {
    fontFamily: 'Exo2_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  exitButton: {
    paddingVertical: 12,
  },
  exitButtonText: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    fontSize: 14,
  },
});
