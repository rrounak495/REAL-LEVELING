import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  reminderPreferences: {
    dailyMission: boolean;
    goalReminder: boolean;
    missedMission: boolean;
  };
  language: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleNotifications: (enabled: boolean) => void;
  updateReminderPreferences: (prefs: Partial<SettingsState['reminderPreferences']>) => void;
  setLanguage: (lang: string) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'system',
  notificationsEnabled: true,
  reminderPreferences: {
    dailyMission: true,
    goalReminder: true,
    missedMission: true,
  },
  language: 'en',

  setTheme: (theme) => set({ theme }),

  toggleNotifications: (enabled) => set({ notificationsEnabled: enabled }),

  updateReminderPreferences: (prefs) =>
    set((state) => ({
      reminderPreferences: { ...state.reminderPreferences, ...prefs },
    })),

  setLanguage: (language) => set({ language }),

  logout: async () => {
    // Integration point for Auth service
    await AsyncStorage.clear();
  },

  deleteAccount: async () => {
    // Future GDPR compliance hook
    await AsyncStorage.clear();
  },

  refreshData: async () => {
    // Core synchronization point
  },
}));
