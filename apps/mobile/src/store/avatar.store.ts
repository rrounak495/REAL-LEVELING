/**
 * src/store/avatar.store.ts
 */
import { create } from 'zustand';
import { repositories } from '@/db/repositories';
import { type AvatarEvolutionLevelRow } from '@/db/repositories/supabase/AvatarEvolutionRepository';
import { type UserAvatarUnlockRow } from '@/db/repositories/supabase/AvatarUnlockRepository';

// Using the exact paths and mismatched names discovered in the filesystem
export const AvatarAssets = {
  male: {
    1: require('../../assets/avatar-assets/male/male level 1.jpg'),
    10: require('../../assets/avatar-assets/male/male level 10.jpg'),
    25: require('../../assets/avatar-assets/male/male level 25.jpg'),
    50: require('../../assets/avatar-assets/male/male level 50.jpg'),
    75: require('../../assets/avatar-assets/male/male level 75.jpg'),
    100: require('../../assets/avatar-assets/male/male level 100.jpg'),
  },
  female: {
    1: require('../../assets/avatar-assets/female/female level 1.jpg'),
    10: require('../../assets/avatar-assets/female/female level 10.jpg'),
    25: require('../../assets/avatar-assets/female/female level 25.jpg'),
    50: require('../../assets/avatar-assets/female/female level 50.jpg'),
    75: require('../../assets/avatar-assets/female/female level 75.jpg'),
    100: require('../../assets/avatar-assets/female/female level 100.jpg'),
  },
};

type Gender = 'male' | 'female';

export interface AvatarState {
  gender: Gender;
  currentStage: AvatarEvolutionLevelRow | null;
  unlockedItems: UserAvatarUnlockRow[];
  equipment: Record<string, string | null>;
  isLoading: boolean;

  setGender: (gender: Gender) => void;
  fetchAvatarData: (userId: string, level: number) => Promise<void>;
  getAvatarImage: () => any; // Returns the React Native Image source object
  equipItem: (slotKey: string, itemId: string) => void;
  unequipItem: (slotKey: string) => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  gender: 'male', // Defaulting to male since onboarding doesn't capture it yet
  currentStage: null,
  unlockedItems: [],
  equipment: {},
  isLoading: false,

  setGender: (gender) => set({ gender }),

  fetchAvatarData: async (userId: string, level: number) => {
    set({ isLoading: true });

    // 1. Fetch current evolution stage based on level
    const stagesRes = await repositories.avatarEvolution.getEvolutionLevels();
    let currentStage = null;

    if (stagesRes.success) {
      const sorted = [...stagesRes.data].sort((a, b) => b.level - a.level);
      currentStage = sorted.find((s) => level >= s.level) || null;
    }

    // 2. Fetch user unlocks
    const unlocksRes = await repositories.avatarUnlock.getUserUnlocks(userId);
    const unlockedItems = unlocksRes.success ? unlocksRes.data : [];

    // 3. Fetch avatar config (including equipment slots)
    const configRes = await repositories.avatar.getAvatarConfig(userId);
    const cfg: any = configRes.success ? configRes.data : {};
    const userGender = cfg.base_model === 'female' ? 'female' : 'male';
    const equipment = {
      helmet_id: cfg.helmet_id || null,
      hair_id: cfg.hair_id || null,
      face_id: cfg.face_id || null,
      armor_id: cfg.armor_id || null,
      weapon_id: cfg.weapon_id || null,
      gloves_id: cfg.gloves_id || null,
      boots_id: cfg.boots_id || null,
      ring_id: cfg.ring_id || null,
      aura_id: cfg.aura_id || null,
      title_id: cfg.title_id || null,
      frame_id: cfg.frame_id || null,
      background_id: cfg.background_id || null,
      animation_id: cfg.animation_id || null,
    } as Record<string, string | null>;

    set({
      gender: userGender,
      currentStage,
      unlockedItems,
      equipment,
      isLoading: false,
    });
  },

  getAvatarImage: () => {
    const state = get();
    const stageLevel = state.currentStage?.level || 1;
    // Fallback to level 1 if something is weird
    const validLevel = [1, 10, 25, 50, 75, 100].includes(stageLevel) ? stageLevel : 1;

    // @ts-ignore
    return AvatarAssets[state.gender][validLevel];
  },

  equipItem: (slotKey: string, itemId: string) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        [slotKey]: itemId,
      },
    }));
  },

  unequipItem: (slotKey: string) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        [slotKey]: null,
      },
    }));
  },
}));
