import React, { memo } from 'react';
import { View } from 'react-native';

export type StatKey = 'str' | 'int' | 'vit' | 'wis' | 'cha';

export interface StatProgress {
  key: StatKey;
  percent: number;
}

interface ProgressRowProps {
  stats?: StatProgress[];
}

export const ProgressRow = memo(function ProgressRow(_props: ProgressRowProps) {
  return <View />;
});
