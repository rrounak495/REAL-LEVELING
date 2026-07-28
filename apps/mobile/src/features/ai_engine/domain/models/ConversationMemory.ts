import { type MessageRole } from '../enums/AiEnums';

/**
 * src/features/ai_engine/domain/models/ConversationMemory.ts
 */
export interface ConversationMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: string;
}

export interface ConversationThread {
  readonly threadId: string;
  readonly userId: string;
  readonly messages: readonly ConversationMessage[];
}
