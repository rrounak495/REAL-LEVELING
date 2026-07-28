import { type ConversationThread, type ConversationMessage } from '../models/ConversationMemory';
import { type AiInsight } from '../models/AiInsight';

/**
 * src/features/ai_engine/domain/repositories/IAiMemoryRepository.ts
 */
export interface IAiMemoryRepository {
  getThread(userId: string): Promise<ConversationThread>;
  appendMessage(userId: string, message: ConversationMessage): Promise<void>;

  saveInsight(insight: AiInsight): Promise<void>;
  getLatestInsights(userId: string, limit: number): Promise<AiInsight[]>;
}
