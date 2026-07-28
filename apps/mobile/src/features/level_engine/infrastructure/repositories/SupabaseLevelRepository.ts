import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type ExtendedDatabase } from '../../../../types/extended-database.types';
import { type ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { type LevelEntity, type LevelProgress } from '../../domain/models/LevelEntity';
import { mapError } from '../../../../lib/errors';

export class SupabaseLevelRepository implements ILevelRepository {
  private readonly supabase: SupabaseClient<ExtendedDatabase>;

  constructor(client: SupabaseClient<Database>) {
    this.supabase = client as unknown as SupabaseClient<ExtendedDatabase>;
  }

  async getLevelDefinition(levelNumber: number): Promise<LevelEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('player_levels')
        .select('*')
        .eq('level', levelNumber)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        levelNumber: data.level,
        title: data.title,
        xpRequired: data.xp_required,
        ...(data.description ? { description: data.description } : {}),
        rewards: [],
        unlockRules: [],
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch level definition');
    }
  }

  async getAllLevelDefinitions(): Promise<LevelEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('player_levels')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;

      return (data || []).map((row) => ({
        levelNumber: row.level,
        title: row.title,
        xpRequired: row.xp_required,
        ...(row.description ? { description: row.description } : {}),
        rewards: [],
        unlockRules: [],
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch all level definitions');
    }
  }

  async getUserProgress(userId: string): Promise<LevelProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('level, xp')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      const xpReq = Math.pow(data.level, 1.5) * 100;

      return {
        userId,
        currentLevel: data.level,
        currentXp: data.xp,
        totalLifetimeXp: data.xp,
        xpRequiredForNext: xpReq,
        isMaxLevel: false,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch user progress');
    }
  }

  async saveUserProgress(progress: LevelProgress): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({
          level: progress.currentLevel,
          xp: progress.currentXp,
        })
        .eq('id', progress.userId);

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save user level progress');
    }
  }
}
