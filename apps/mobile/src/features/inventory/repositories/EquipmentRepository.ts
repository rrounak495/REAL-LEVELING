import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { type Result, DatabaseError } from '@/lib/errors';

export interface IEquipmentRepository {
  equipItem(userId: string, slotKey: string, itemId: string | null): Promise<Result<void>>;
}

export class EquipmentRepository implements IEquipmentRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async equipItem(userId: string, slotKey: string, itemId: string | null): Promise<Result<void>> {
    try {
      const dbSlotName = `${slotKey.toLowerCase()}_id`;

      const { error } = await this.supabase
        .from('avatar_configs')
        .update({ [dbSlotName]: itemId } as never)
        .eq('id', userId);

      if (error) {
        return { success: false, error: new DatabaseError(error.message, error) };
      }

      return { success: true, data: undefined };
    } catch (e) {
      return { success: false, error: new DatabaseError('Failed to equip item', e) };
    }
  }
}
