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
import { MMKV, createMMKV } from 'react-native-mmkv';
import type { SupportedStorage } from '@supabase/supabase-js';
import type { StateStorage } from 'zustand/middleware';

const authStorage = createMMKV({ id: 'auth-storage' });
const stateStorage = createMMKV({ id: 'state-storage' });
export const mmkv = createMMKV({ id: 'general-storage' });

export const mmkvSupabaseStorage: SupportedStorage = {
  getItem: (key: string): string | null => {
    const value = authStorage.getString(key);
    return value ? value : null;
  },
  setItem: (key: string, value: string): void => {
    authStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    authStorage.remove(key);
  },
};

export const mmkvZustandStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const value = stateStorage.getString(key);
    return value ? value : null;
  },
  setItem: (key: string, value: string): void => {
    stateStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    stateStorage.remove(key);
  },
};
