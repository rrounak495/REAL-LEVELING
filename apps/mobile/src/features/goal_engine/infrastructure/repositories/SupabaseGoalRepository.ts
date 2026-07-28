import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type ExtendedDatabase } from '../../../../types/extended-database.types';
import { type IGoalRepository } from '../../domain/repositories/IGoalRepository';
import { type GoalEntity, type GoalProgress } from '../../domain/models/GoalEntity';
import { type GoalTemplate } from '../../domain/models/GoalTemplate';
import { mapError } from '../../../../lib/errors';
import {
  type GoalCategory,
  type GoalStatus,
  type GoalDuration,
} from '../../domain/enums/GoalEnums';

/**
 * src/features/goal_engine/infrastructure/repositories/SupabaseGoalRepository.ts
 */
export class SupabaseGoalRepository implements IGoalRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getActiveGoal(userId: string): Promise<GoalEntity | null> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { data, error } = await client
        .from('user_journeys')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'IN_PROGRESS')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        title: data.goal,
        category: (data.journey_type as GoalCategory) || 'CUSTOM',
        durationDays: data.duration_days as GoalDuration,
        startDate: data.start_date || data.created_at,
        status: 'ACTIVE',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch active goal');
    }
  }

  async getGoalById(goalId: string): Promise<GoalEntity | null> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { data, error } = await client
        .from('user_journeys')
        .select('*')
        .eq('id', goalId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        title: data.goal,
        category: (data.journey_type as GoalCategory) || 'CUSTOM',
        durationDays: data.duration_days as GoalDuration,
        startDate: data.start_date || data.created_at,
        status: data.status as GoalStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch goal by id');
    }
  }

  async getGoalProgress(goalId: string): Promise<GoalProgress | null> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { data, error } = await client
        .from('user_journeys')
        .select('current_day, duration_days')
        .eq('id', goalId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        goalId: goalId,
        currentDay: data.current_day,
        completedDays: Math.max(0, data.current_day - 1),
        percentComplete: Math.round((Math.max(0, data.current_day - 1) / data.duration_days) * 100),
      };
    } catch (error) {
      throw mapError(error, 'Failed to fetch goal progress');
    }
  }

  async saveGoal(goal: GoalEntity): Promise<void> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { error } = await client.from('user_journeys').upsert({
        id: goal.id,
        user_id: goal.userId,
        goal: goal.title,
        journey_type: goal.category,
        duration_days: goal.durationDays,
        current_day: 1,
        start_date: goal.startDate || new Date().toISOString(),
        status: goal.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED',
        created_at: goal.createdAt,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to save goal');
    }
  }

  async updateGoalProgress(progress: GoalProgress): Promise<void> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { error } = await client
        .from('user_journeys')
        .update({
          current_day: progress.currentDay,
          updated_at: new Date().toISOString(),
        })
        .eq('id', progress.goalId);

      if (error) throw error;
    } catch (error) {
      throw mapError(error, 'Failed to update goal progress');
    }
  }

  async getGoalHistory(userId: string): Promise<GoalEntity[]> {
    try {
      const client = this.supabase as unknown as SupabaseClient<ExtendedDatabase>;
      const { data, error } = await client
        .from('user_journeys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.goal,
        category: (row.journey_type as GoalCategory) || 'CUSTOM',
        durationDays: row.duration_days as GoalDuration,
        startDate: row.start_date || row.created_at,
        status: row.status === 'IN_PROGRESS' ? 'ACTIVE' : (row.status as GoalStatus),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      throw mapError(error, 'Failed to fetch goal history');
    }
  }

  async getTemplatesByCategory(category: string): Promise<GoalTemplate[]> {
    // Currently there's no goal_templates table in DB, so returning empty to satisfy compilation
    // Will be populated when table is created
    return [];
  }
}
