/**
 * src/features/streak_engine/domain/enums/StreakEnums.ts
 */

export type StreakStatus = 'ACTIVE' | 'AT_RISK' | 'LOST' | 'FROZEN';

export type MomentumTier = 'COLD' | 'WARMING_UP' | 'ON_FIRE' | 'UNSTOPPABLE';

export type RecoveryType = 'GRACE_PERIOD' | 'COMEBACK_BONUS' | 'STREAK_FREEZE';
