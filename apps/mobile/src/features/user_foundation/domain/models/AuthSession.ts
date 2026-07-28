/**
 * src/features/user_foundation/domain/models/AuthSession.ts
 */
export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly userId: string;
}

export interface SecureTokenHandler {
  saveTokens(session: AuthSession): Promise<void>;
  getTokens(): Promise<AuthSession | null>;
  clearTokens(): Promise<void>;
}
