/**
 * src/lib/errors.ts
 *
 * Domain-specific typed errors and centralized error mapping.
 */
import { type PostgrestError } from '@supabase/supabase-js';

export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public originalError?: unknown,
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

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', originalError?: unknown) {
    super(message, 'AUTH_ERROR', originalError);
  }
}

export class PermissionError extends AppError {
  constructor(message = 'Unauthorized access or missing permissions', originalError?: unknown) {
    super(message, 'PERMISSION_ERROR', originalError);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed', originalError?: unknown) {
    super(message, 'NETWORK_ERROR', originalError);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', originalError?: unknown) {
    super(message, 'VALIDATION_ERROR', originalError);
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timed out', originalError?: unknown) {
    super(message, 'TIMEOUT_ERROR', originalError);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'DATABASE_ERROR', originalError);
  }
}

export class UnknownError extends AppError {
  constructor(message = 'An unknown error occurred', originalError?: unknown) {
    super(message, 'UNKNOWN_ERROR', originalError);
  }
}

/**
 * Centralized Error Mapper for Supabase and generic exceptions
 */
export function mapError(error: unknown, fallbackMessage = 'An error occurred'): AppError {
  if (error instanceof AppError) return error;

  // Supabase Postgrest Error Detection
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const pgError = error as PostgrestError;

    // Auth / RLS Errors
    if (pgError.code === '42501') {
      return new PermissionError('Row level security policy violated', pgError);
    }

    // Unique Constraint
    if (pgError.code === '23505') {
      return new ValidationError('A duplicate record already exists', pgError);
    }

    // Foreign Key Violation
    if (pgError.code === '23503') {
      return new ValidationError('Invalid reference in database', pgError);
    }

    // Offline / Connection errors (sometimes don't have code but fetch fails)
    if (pgError.message?.toLowerCase().includes('fetch')) {
      return new NetworkError('Network request failed', pgError);
    }

    return new DatabaseError(pgError.message || fallbackMessage, pgError);
  }

  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return new TimeoutError('Request timed out', error);
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new NetworkError('Network request failed', error);
    }
    return new UnknownError(error.message, error);
  }

  return new UnknownError(fallbackMessage, error);
}
