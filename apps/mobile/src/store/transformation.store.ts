import { create } from 'zustand';
import {
  TransformationRepository,
  type TransformationProfileRow,
  type StrengthRecordRow,
  type LifeHistoryStatsRow,
} from '../features/transformation/repositories/TransformationRepository';

interface TransformationState {
  profile: TransformationProfileRow | null;
  strengthRecords: StrengthRecordRow[];
  lifeStats: LifeHistoryStatsRow | null;
  isLoading: boolean;

  fetchTransformationData: (userId: string) => Promise<void>;
  updateWeight: (userId: string, newWeight: number) => Promise<void>;
}

export const useTransformationStore = create<TransformationState>((set, get) => ({
  profile: null,
  strengthRecords: [],
  lifeStats: null,
  isLoading: false,

  fetchTransformationData: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [profile, strengthRecords, lifeStats] = await Promise.all([
        TransformationRepository.getProfile(userId),
        TransformationRepository.getStrengthRecords(userId),
        TransformationRepository.getLifeHistory(userId),
      ]);
      set({ profile, strengthRecords, lifeStats });
    } catch (error) {
      console.error('Failed to fetch transformation data', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateWeight: async (userId: string, newWeight: number) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const updatedProfile = await TransformationRepository.upsertProfile({
        ...profile,
        current_weight: newWeight,
        updated_at: new Date().toISOString(),
      });
      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Failed to update weight', error);
    }
  },
}));
