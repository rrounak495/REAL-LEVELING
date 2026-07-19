import { repositories } from '@/db/repositories';
import { type Result } from '@/lib/errors';
import { type PersonalRecordRow } from '@/types/system.types';

export class PersonalRecordService {
  static async checkAndUpdateRecord(
    userId: string,
    activityType: string,
    newValue: number,
    metadata: any = {},
  ): Promise<Result<{ isNewRecord: boolean; record: PersonalRecordRow }>> {
    // First, fetch existing records
    const res = await repositories.system.getPersonalRecords(userId);
    if (!res.success) return res as any;

    const existingRecord = res.data.find((r) => r.activity_type === activityType);

    if (!existingRecord || newValue > existingRecord.record_value) {
      // It's a new record! Update it.
      const updateRes = await repositories.system.updatePersonalRecord(
        userId,
        activityType,
        newValue,
        metadata,
      );
      if (updateRes.success) {
        return { success: true, data: { isNewRecord: true, record: updateRes.data } };
      }
      return updateRes as any;
    }

    // Not a new record
    return { success: true, data: { isNewRecord: false, record: existingRecord } };
  }
}
