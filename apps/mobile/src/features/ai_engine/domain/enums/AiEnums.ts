/**
 * src/features/ai_engine/domain/enums/AiEnums.ts
 */

export type AiInsightCategory =
  'PERFORMANCE' | 'RECOVERY' | 'MOTIVATION' | 'RISK_DETECTION' | 'OPTIMIZATION';

export type AiProviderName = 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'LOCAL';

export type MessageRole = 'system' | 'user' | 'assistant';
