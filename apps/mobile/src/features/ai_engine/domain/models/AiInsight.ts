import { type AiInsightCategory } from '../enums/AiEnums';

/**
 * src/features/ai_engine/domain/models/AiInsight.ts
 */
export interface AiInsight {
  readonly id: string;
  readonly userId: string;
  readonly category: AiInsightCategory;

  readonly content: string;
  readonly actionItem?: string; // Optional recommended action

  readonly generatedAt: string;
  readonly relevanceScore: number;
}
