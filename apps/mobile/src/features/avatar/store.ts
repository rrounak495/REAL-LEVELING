/**
 * src/features/avatar/store.ts
 *
 * Zustand store for the avatar builder UI flow.
 * This is TRANSIENT state — only used while the user is in the avatar
 * builder. On submit, the final config is persisted to Supabase via
 * AvatarRepository. The store is then reset.
 *
 * NOT persisted to MMKV — intentionally ephemeral.
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { type AvatarConfig, DEFAULT_AVATAR_CONFIG } from './types';

interface AvatarBuilderState {
  /** Working draft of the avatar config — updated as user customizes */
  draft: AvatarConfig;
  /** Which step of the 3-step builder the user is on (0=Base, 1=Customize, 2=Preview) */
  activeStep: 0 | 1 | 2;
  /** Which layer tab is selected in the Customize step */
  activeLayerKey: string;
}

interface AvatarBuilderActions {
  setDraftField: <K extends keyof AvatarConfig>(field: K, value: AvatarConfig[K]) => void;
  setActiveStep: (step: 0 | 1 | 2) => void;
  setActiveLayerKey: (key: string) => void;
  resetDraft: () => void;
}

type AvatarBuilderStore = AvatarBuilderState & AvatarBuilderActions;

export const useAvatarBuilderStore = create<AvatarBuilderStore>()(
  immer((set) => ({
    draft: { ...DEFAULT_AVATAR_CONFIG },
    activeStep: 0,
    activeLayerKey: 'base',

    setDraftField: (field, value) => {
      set((state) => {
        (state.draft as AvatarConfig)[field] = value;
      });
    },

    setActiveStep: (step) => {
      set((state) => {
        state.activeStep = step;
      });
    },

    setActiveLayerKey: (key) => {
      set((state) => {
        state.activeLayerKey = key;
      });
    },

    resetDraft: () => {
      set((state) => {
        state.draft = { ...DEFAULT_AVATAR_CONFIG };
        state.activeStep = 0;
        state.activeLayerKey = 'base';
      });
    },
  })),
);
