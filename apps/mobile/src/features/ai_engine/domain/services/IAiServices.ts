import { type AiInsight } from '../models/AiInsight';
import { type AiPromptContext } from '../models/AiPromptContext';
import { type ConversationMessage } from '../models/ConversationMemory';

/**
 * src/features/ai_engine/domain/services/IAiCoachingService.ts
 */
export interface IAiCoachingService {
  /**
   * Evaluates the user's current context to generate actionable insights.
   */
  generateDailyInsights(context: AiPromptContext): Promise<AiInsight[]>;

  /**
   * Responds to a user query in real-time, considering conversation history.
   */
  chatWithSystem(
    userId: string,
    userMessage: string,
    context: AiPromptContext,
  ): Promise<ConversationMessage>;
}

/**
 * src/features/ai_engine/domain/services/IAiProviderContract.ts
 *
 * Interface abstracting the LLM provider (OpenAI, Gemini, etc.)
 */
export interface IAiProviderContract {
  generateCompletion(systemPrompt: string, messages: ConversationMessage[]): Promise<string>;
}
