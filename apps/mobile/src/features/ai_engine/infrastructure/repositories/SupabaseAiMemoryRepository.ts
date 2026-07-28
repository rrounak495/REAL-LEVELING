import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '../../../../types/database.types';
import { type IAiMemoryRepository } from '../../domain/repositories/IAiMemoryRepository';
import {
  type ConversationThread,
  type ConversationMessage,
} from '../../domain/models/ConversationMemory';
import { type AiInsight } from '../../domain/models/AiInsight';

/**
 * src/features/ai_engine/infrastructure/repositories/SupabaseAiMemoryRepository.ts
 */
export class SupabaseAiMemoryRepository implements IAiMemoryRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getThread(userId: string): Promise<ConversationThread> {
    return { threadId: userId, userId, messages: [] };
  }

  async appendMessage(userId: string, message: ConversationMessage): Promise<void> {
    // Implementation requires AI chat logs table
  }

  async saveInsight(insight: AiInsight): Promise<void> {
    // Stub
  }

  async getLatestInsights(userId: string, limit: number): Promise<AiInsight[]> {
    return [];
  }
}
