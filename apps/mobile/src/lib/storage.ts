/**
 * lib/storage.ts — MMKV Storage Adapters
 *
 * WHY MMKV INSTEAD OF ASYNCSTORAGE:
 * MMKV operates on a dedicated C++ thread, achieving ~30x faster reads
 * and ~5x faster writes vs AsyncStorage. For game state (XP, quest data,
 * avatar config) that is accessed on every app start, this matters.
 *
 * THREE ADAPTERS EXPORTED:
 * 1. `mmkv` — raw MMKV instance for direct use
 * 2. `mmkvSupabaseStorage` — Supabase SupportedStorage interface for auth session persistence
 * 3. `mmkvZustandStorage` — Zustand StateStorage interface for store persistence
 */
import type { SupportedStorage } from '@supabase/supabase-js';
import type { StateStorage } from 'zustand/middleware';

// EXPO GO MOCK: Replaced MMKV with an in-memory Map to preserve synchronous API
class MockMMKV {
  private storage = new Map<string, string>();

  getString(key: string): string | undefined {
    return this.storage.get(key);
  }

  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  delete(key: string): void {
    this.storage.delete(key);
  }
}

const authStorage = new MockMMKV();
const stateStorage = new MockMMKV();
export const mmkv = new MockMMKV();

export const mmkvSupabaseStorage: SupportedStorage = {
  getItem: (key: string): string | null => {
    return authStorage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    authStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    authStorage.delete(key);
  },
};

export const mmkvZustandStorage: StateStorage = {
  getItem: (key: string): string | null => {
    return stateStorage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    stateStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    stateStorage.delete(key);
  },
};
