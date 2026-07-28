/**
 * store/task.store.ts — Custom Task Zustand Store
 *
 * Sprint 3: Custom Task System
 * Manages CRUD for user-created tasks with MMKV persistence.
 * Follows the same persist + createJSONStorage pattern as mission.store.ts.
 *
 * Features:
 * - Create with auto-generated ID and XP
 * - Edit title, time, repeat
 * - Delete with optimistic removal
 * - Toggle completion with timestamp
 * - Persisted via mmkvZustandStorage (survives hot reload)
 * - Error-safe with try/catch on all mutations
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvZustandStorage } from '@lib/storage';
import { useHistoryStore } from './history.store';
import { useProgressionStore } from './progression.store';
import {
  type CustomTask,
  type CreateTaskInput,
  type UpdateTaskInput,
  type TaskRepeat,
  TASK_XP_MAP,
} from '@/types/task.types';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a unique ID */
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/** Calculate XP from repeat type */
function calculateXp(repeat: TaskRepeat): number {
  return TASK_XP_MAP[repeat] ?? 20;
}

/** Get display time string from task */
export function getTaskDisplayTime(task: CustomTask): string | undefined {
  if (task.timeSlot === 'custom' && task.customTime) return task.customTime;
  if (task.timeSlot === 'morning') return 'Morning';
  if (task.timeSlot === 'afternoon') return 'Afternoon';
  if (task.timeSlot === 'evening') return 'Evening';
  return undefined;
}

/** Get display repeat string from task */
export function getTaskDisplayRepeat(task: CustomTask): string {
  switch (task.repeat) {
    case 'daily':
      return 'daily';
    case 'weekdays':
      return 'weekdays';
    case 'once':
    default:
      return 'once';
  }
}

// ── State Shape ─────────────────────────────────────────────────────────────

interface TaskState {
  /** All custom tasks */
  tasks: CustomTask[];
  /** Last local date string when daily reset was processed */
  lastResetDate: string | null;

  // ── Actions ──
  createTask: (input: CreateTaskInput) => CustomTask | null;
  updateTask: (id: string, input: UpdateTaskInput) => boolean;
  deleteTask: (id: string) => boolean; // Soft delete
  toggleComplete: (id: string) => boolean;
  processDailyReset: () => void;

  // ── Selectors (computed from tasks) ──
  getPendingTasks: () => CustomTask[];
  getCompletedTasks: () => CustomTask[];
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      lastResetDate: null,

      createTask: (input: CreateTaskInput): CustomTask | null => {
        try {
          // Validate
          const title = input.title.trim();
          if (!title) return null;

          const now = new Date().toISOString();
          const newTask: CustomTask = {
            id: generateId(),
            title,
            timeSlot: input.timeSlot,
            customTime: input.customTime,
            repeat: input.repeat,
            xp: calculateXp(input.repeat),
            completed: false,
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            tasks: [newTask, ...state.tasks],
          }));

          return newTask;
        } catch (error) {
          console.error('[TaskStore] Failed to create task:', error);
          return null;
        }
      },

      updateTask: (id: string, input: UpdateTaskInput): boolean => {
        try {
          const { tasks } = get();
          const taskIndex = tasks.findIndex((t) => t.id === id);
          if (taskIndex === -1) return false;

          const existing = tasks[taskIndex]!;
          const updatedRepeat = input.repeat ?? existing.repeat;
          const updatedTask: CustomTask = {
            ...existing,
            title: input.title?.trim() || existing.title,
            timeSlot: input.timeSlot ?? existing.timeSlot,
            customTime: input.customTime ?? existing.customTime,
            repeat: updatedRepeat,
            xp: calculateXp(updatedRepeat),
            updatedAt: new Date().toISOString(),
          };

          // Validate title not empty after trim
          if (!updatedTask.title) return false;

          const newTasks = [...tasks];
          newTasks[taskIndex] = updatedTask;
          set({ tasks: newTasks });

          return true;
        } catch (error) {
          console.error('[TaskStore] Failed to update task:', error);
          return false;
        }
      },

      deleteTask: (id: string): boolean => {
        try {
          // Soft delete internally to allow future recovery
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, isDeleted: true } : t)),
          }));
          return true;
        } catch (error) {
          console.error('[TaskStore] Failed to delete task:', error);
          return false;
        }
      },

      toggleComplete: (id: string): boolean => {
        try {
          const { tasks } = get();
          const taskIndex = tasks.findIndex((t) => t.id === id);
          if (taskIndex === -1) return false;

          const existing = tasks[taskIndex]!;
          const updatedTask: CustomTask = {
            ...existing,
            completed: !existing.completed,
            completedAt: !existing.completed ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };

          const newTasks = [...tasks];
          newTasks[taskIndex] = updatedTask;
          set({ tasks: newTasks });

          if (updatedTask.completed && updatedTask.completedAt) {
            useHistoryStore.getState().addRecord({
              taskId: id,
              completedAt: updatedTask.completedAt,
              type: 'custom',
              xpEarned: updatedTask.xp,
            });
            useProgressionStore.getState().gainXP(updatedTask.xp);
          }

          return true;
        } catch (error) {
          console.error('[TaskStore] Failed to toggle task:', error);
          return false;
        }
      },

      processDailyReset: () => {
        try {
          const { tasks, lastResetDate } = get();
          const today = new Date().toLocaleDateString(); // Local timezone date string
          if (lastResetDate === today) return;

          const currentDayOfWeek = new Date().getDay(); // 0 is Sun, 6 is Sat
          const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;

          const newTasks = tasks.map((t) => {
            if (t.repeat === 'daily') {
              return { ...t, completed: false, completedAt: undefined };
            }
            if (t.repeat === 'weekdays' && isWeekday) {
              return { ...t, completed: false, completedAt: undefined };
            }
            return t;
          });

          set({ tasks: newTasks, lastResetDate: today });
          console.log('[TaskStore] Daily reset processed.');
        } catch (error) {
          console.error('[TaskStore] Failed to process daily reset:', error);
        }
      },

      getPendingTasks: (): CustomTask[] => {
        const currentDayOfWeek = new Date().getDay();
        const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;

        return get().tasks.filter((t) => {
          if ((t as any).isDeleted) return false;
          if (t.completed) return false;
          if (t.repeat === 'weekdays' && !isWeekday) return false;
          return true;
        });
      },

      getCompletedTasks: (): CustomTask[] => {
        const todayStr = new Date().toLocaleDateString();
        return get().tasks.filter((t) => {
          if ((t as any).isDeleted) return false;
          if (!t.completed) return false;
          if (!t.completedAt) return false;

          // Completed tab shows today's completed items only
          const completedDateStr = new Date(t.completedAt).toLocaleDateString();
          return completedDateStr === todayStr;
        });
      },
    }),
    {
      name: 'custom-task-storage',
      storage: createJSONStorage(() => mmkvZustandStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate legacy tasks to ensure all required fields exist
          if (persistedState && Array.isArray(persistedState.tasks)) {
            persistedState.tasks = persistedState.tasks.map((t: any) => ({
              ...t,
              id: t.id || `task_legacy_${Math.random().toString(36).substring(2, 8)}`,
              title: t.title || 'Untitled Task',
              timeSlot: t.timeSlot || 'morning',
              repeat: t.repeat || 'once',
              xp: t.xp ?? 20,
              completed: !!t.completed,
              createdAt: t.createdAt || new Date().toISOString(),
              updatedAt: t.updatedAt || new Date().toISOString(),
            }));
          }
        }
        return persistedState as TaskState;
      },
    },
  ),
);
