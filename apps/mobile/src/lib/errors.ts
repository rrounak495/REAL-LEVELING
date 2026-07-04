/**
 * src/lib/errors.ts
 *
 * Domain-specific typed errors and the Result pattern for safe error handling.
 * Avoids throwing generic Error instances across boundaries.
 */

export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProfileNotFoundError extends AppError {
  constructor(userId: string) {
    super(`Profile not found for user: ${userId}`, 'PROFILE_NOT_FOUND');
  }
}

export class UserSettingsNotFoundError extends AppError {
  constructor(userId: string) {
    super(`Settings not found for user: ${userId}`, 'SETTINGS_NOT_FOUND');
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message, 'DATABASE_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access to resource') {
    super(message, 'UNAUTHORIZED');
  }
}
