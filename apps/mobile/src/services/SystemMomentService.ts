import { repositories } from '@/db/repositories';
import { type Result } from '@/lib/errors';
import { type MomentType, type SystemMomentRow } from '@/types/system.types';

export class SystemMomentService {
  /**
   * Enqueues a high-priority cinematic moment to be shown to the user.
   * Priority: Lower number = shown first.
   */
  static async enqueueMoment(
    userId: string,
    type: MomentType,
    payload: any,
    priority: number = 10,
  ): Promise<Result<SystemMomentRow>> {
    return await repositories.system.enqueueMoment(userId, type, payload, priority);
  }

  static async getPendingMoments(userId: string): Promise<Result<SystemMomentRow[]>> {
    return await repositories.system.getMomentsQueue(userId);
  }

  static async markMomentViewed(momentId: string, userId: string): Promise<Result<void>> {
    return await repositories.system.markMomentViewed(momentId, userId);
  }
}
