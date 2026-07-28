import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type ExtendedDatabase } from '../../../../types/extended-database.types';
import { type IMissionRepository } from '../../domain/repositories/IMissionRepository';
import { type MissionEntity } from '../../domain/models/MissionEntity';
import { mapError } from '../../../../lib/errors';
import { type MissionCategory, type MissionStatus } from '../../domain/enums/MissionEnums';

export class SupabaseMissionRepository implements IMissionRepository {
  private readonly supabase: SupabaseClient<ExtendedDatabase>;

  constructor(client: SupabaseClient<Database>) {
    this.supabase = client as unknown as SupabaseClient<ExtendedDatabase>;
  }

  async getMissionById(missionId: string): Promise<MissionEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        category: (data.category as MissionCategory) || 'CUSTOM',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: data.title || data.description || 'Unknown',
        ...(data.description ? { description: data.description } : {}),
        targetValue: data.required_count || 1,
        targetUnit: 'rep',
        estimatedTimeMinutes: 0,
        xpReward: data.xp_reward || 0,
        status: data.is_completed ? 'COMPLETED' : 'IN_PROGRESS',
        completionMode: 'QUANTITY',
        isEditable: true,
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch mission');
    }
  }

  async getActiveMissions(userId: string): Promise<MissionEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_completed', false);

      if (error) throw error;
      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        category: (row.category as MissionCategory) || 'CUSTOM',
        type: 'CORE',
        difficulty: 'BEGINNER',
        title: row.title || row.description || 'Unknown',
        ...(row.description ? { description: row.description } : {}),
        targetValue: row.required_count || 1,
        targetUnit: 'rep',
        estimatedTimeMinutes: 0,
        xpReward: row.xp_reward || 0,
        status: 'IN_PROGRESS',
        completionMode: 'QUANTITY',
        isEditable: true,
        createdAt: row.created_at,
        updatedAt: row.updated_at || row.created_at,
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch active missions');
    }
  }

  async getMissionsByCategory(userId: string, category: MissionCategory): Promise<MissionEntity[]> {
    return [];
  }

  async getMissionsByStatus(userId: string, status: MissionStatus): Promise<MissionEntity[]> {
    return [];
  }

  async saveMissions(missions: MissionEntity[]): Promise<void> {
    try {
      const payload = missions.map((m) => ({
        id: m.id,
        user_id: m.userId,
        category: m.category,
        title: m.title,
        description: m.description || null,
        difficulty: m.difficulty,
        mission_type: m.type,
        required_count: m.targetValue,
        current_progress: 0,
        coin_reward: 0,
        xp_reward: m.xpReward,
        rarity: 'common',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        is_claimed: false,
        is_completed: m.status === 'COMPLETED',
        created_at: m.createdAt,
      }));

      const { error } = await this.supabase.from('user_missions').upsert(payload);
      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save missions');
    }
  }

  async updateMission(mission: MissionEntity): Promise<void> {
    await this.saveMissions([mission]);
  }

  async updateMissions(missions: MissionEntity[]): Promise<void> {
    await this.saveMissions(missions);
  }
}
