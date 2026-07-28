import * as Crypto from 'expo-crypto';
import { type IXpAwardService, type AwardXpResult } from '../../domain/services/IXpAwardService';
import { type IXpModifierService } from '../../domain/services/IXpModifierService';
import { type IXpCalculationService } from '../../domain/services/IXpCalculationService';
import { type IXpRepository } from '../../domain/repositories/IXpRepository';
import { type ILevelRepository } from '../../../level_engine/domain/repositories/ILevelRepository';
import { type XpSource } from '../../domain/enums/XpEnums';
import { type XpTransaction } from '../../domain/models/XpTransaction';
import { AppError } from '../../../../lib/errors';

export class XpAwardService implements IXpAwardService {
  constructor(
    private readonly modifierService: IXpModifierService,
    private readonly calcService: IXpCalculationService,
    private readonly xpRepo: IXpRepository,
    private readonly levelRepo: ILevelRepository,
  ) {}

  async awardXp(
    userId: string,
    source: XpSource,
    baseAmount: number,
    referenceId?: string,
  ): Promise<AwardXpResult> {
    if (baseAmount <= 0) {
      throw new AppError('Base XP amount must be positive', 'VALIDATION_ERROR');
    }

    // 1. Gather all applicable modifiers
    const context = await this.modifierService.getActiveModifiers(userId, source);

    // 2. Calculate final XP
    const finalXp = this.calcService.calculateFinalXp(baseAmount, context);

    // 3. Create transaction
    const transaction: XpTransaction = {
      id: Crypto.randomUUID(),
      userId,
      source,
      baseAmount,
      finalAmount: finalXp,
      appliedModifiers: context.modifiers.map((m: any) => ({
        type: m.type as any, // casting since type is string in XpModifier
        multiplier: m.multiplier,
        reason: m.description || '',
      })),
      timestamp: new Date().toISOString(),
      ...(referenceId !== undefined ? { referenceId } : {}),
    };

    // 4. Save transaction (updates total XP)
    await this.xpRepo.saveTransaction(transaction);

    // 5. Check Level up
    const currentTotal = await this.xpRepo.getTotalXp(userId);
    const progress = await this.levelRepo.getUserProgress(userId);

    let leveledUp = false;
    let newLevel = progress?.currentLevel || 1;

    // Fetch next level definition
    const nextLevelDef = await this.levelRepo.getLevelDefinition(newLevel + 1);

    if (nextLevelDef && currentTotal >= nextLevelDef.xpRequired) {
      leveledUp = true;
      newLevel = nextLevelDef.levelNumber;

      if (progress) {
        await this.levelRepo.saveUserProgress({
          ...progress,
          currentLevel: newLevel,
          totalXpEarned: currentTotal,
          lastLevelUpDate: new Date().toISOString(),
        } as any);
      }
    } else if (progress) {
      // Just update XP
      await this.levelRepo.saveUserProgress({
        ...progress,
        totalXpEarned: currentTotal,
      } as any);
    }

    return {
      transaction,
      leveledUp,
      newLevel,
    };
  }
}
