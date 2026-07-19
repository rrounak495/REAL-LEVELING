import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { RivalService } from '@/services/RivalService';
// import { Target } from 'lucide-react-native'; // Native SVG crash

export function RankRival() {
  const userId = useAuthStore((s) => s.user?.id);
  const [rival, setRival] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      RivalService.getRival(userId).then(setRival);
    }
  }, [userId]);

  if (!rival) return null;

  return (
    <View className="bg-theme-bg-dark border border-theme-border/50 rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-theme-text font-rajdhani-bold text-lg">RANK RIVAL</Text>
        <Text style={{ fontSize: 20, color: '#EF4444' }}>🎯</Text>
      </View>

      <View className="flex-row items-center justify-between bg-theme-bg-darker p-3 rounded-lg border border-theme-border/30">
        <View className="flex-row items-center space-x-3">
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1F1A2A',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>
          <View>
            <Text className="text-white font-exo-bold">{rival.username}</Text>
            <Text className="text-theme-rank-a font-rajdhani-bold">{rival.rank} Rank</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-theme-text-muted font-exo-semibold text-xs mb-1">XP GAP</Text>
          <Text className={`font-exo-bold ${rival.xpGap < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {rival.xpGap > 0 ? '+' : ''}
            {rival.xpGap.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}
