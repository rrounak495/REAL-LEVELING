import { repositories } from '@/db/repositories';
import { DamageCalculationService, type ActivitySubmission } from './DamageCalculationService';
import { type Result } from '@/lib/errors';
import { type BossPhaseRow } from '@/types/boss.types';
// import * as Crypto from 'expo-crypto'; // Removed to prevent native module crash in dev client

export class BossBattleService {
  /**
   * Submits a contribution to a boss battle, mapping raw fitness to damage via the calculation service,
   * enforcing anti-cheat caps, and executing an atomic transaction against the database.
   */
  async submitDamage(
    bossId: string,
    userId: string,
    submission: ActivitySubmission,
    currentDailyTotal: number,
    currentBossHp: number,
    totalBossHp: number,
    phases: BossPhaseRow[],
  ): Promise<Result<{ damageApplied: number; newHp: number; isSuspicious: boolean }>> {
    // 1. Determine active phase multiplier based on current HP
    const currentHpPct = (currentBossHp / totalBossHp) * 100;
    const activePhase = phases
      .filter((p) => currentHpPct <= p.hp_threshold_pct)
      .sort((a, b) => a.hp_threshold_pct - b.hp_threshold_pct)[0]; // Lowest threshold that we are under

    const multiplier = activePhase ? activePhase.damage_multiplier : 1.0;

    // 2. Calculate Damage via Domain Rules
    const damageResult = DamageCalculationService.calculateDamage(
      submission,
      currentDailyTotal,
      multiplier,
    );

    // 3. Create idempotency key securely
    const idempotencyStr = `${bossId}_${userId}_${submission.timestamp}_${submission.amount}`;
    // Graceful degradation: Dev client missing expo-crypto
    // Falling back to the raw string as idempotency key for now
    const idempotencyKey = idempotencyStr;

    const status = damageResult.isSuspicious ? 'flagged_suspicious' : 'valid';

    // Even if base damage is 0 (capped out), we still record it to have an audit trail of their submissions
    // But we don't apply damage if it's suspicious
    const actualDamageDealt = damageResult.isSuspicious ? 0 : damageResult.finalDamage;

    // 4. Atomic Submit to Repository
    const repoResult = await repositories.boss.submitContribution(
      bossId,
      userId,
      submission.objectiveId,
      submission.activityType,
      submission.amount,
      actualDamageDealt,
      idempotencyKey,
      status,
    );

    if (!repoResult.success) {
      return { success: false, error: repoResult.error };
    }

    // Return the results including anti-cheat flags
    return {
      success: true,
      data: {
        damageApplied: repoResult.data.damage_applied,
        newHp: repoResult.data.new_hp,
        isSuspicious: damageResult.isSuspicious,
      },
    };
  }

  /**
   * Evaluates if a boss has transitioned phases given a new HP
   */
  evaluatePhaseTransition(
    oldHp: number,
    newHp: number,
    totalHp: number,
    phases: BossPhaseRow[],
  ): BossPhaseRow | null {
    const oldPct = (oldHp / totalHp) * 100;
    const newPct = (newHp / totalHp) * 100;

    // Find the first phase boundary we crossed
    const crossedPhase = phases
      .sort((a, b) => b.hp_threshold_pct - a.hp_threshold_pct) // Highest first
      .find((p) => oldPct > p.hp_threshold_pct && newPct <= p.hp_threshold_pct);

    return crossedPhase || null;
  }
}

export const bossBattleService = new BossBattleService();
