import { create } from 'zustand';
import { type ExerciseMetadata } from '../features/workout/data/exerciseLibrary';

type SessionStatus = 'idle' | 'running' | 'resting' | 'paused' | 'completed';

export interface WorkoutLogEntry {
  exerciseId: string;
  completedReps?: number | undefined;
  completedDurationSeconds?: number | undefined;
}

interface SessionState {
  status: SessionStatus;
  missionName: string;
  exercises: ExerciseMetadata[];
  currentExerciseIndex: number;
  restTimeRemaining: number;
  workoutLog: WorkoutLogEntry[];

  startSession: (missionName: string, exercises: ExerciseMetadata[]) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeExercise: (reps?: number, duration?: number) => void;
  skipExercise: () => void;
  skipRest: () => void;
  decrementRestTimer: () => void;
  endSession: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'idle',
  missionName: '',
  exercises: [],
  currentExerciseIndex: 0,
  restTimeRemaining: 0,
  workoutLog: [],

  startSession: (missionName, exercises) => {
    set({
      status: 'running',
      missionName,
      exercises,
      currentExerciseIndex: 0,
      restTimeRemaining: 0,
      workoutLog: [],
    });
  },

  pauseSession: () => {
    const { status } = get();
    if (status === 'running' || status === 'resting') {
      set({ status: 'paused' }); // Future Improvement: Preserve previous state in a robust implementation
    }
  },

  resumeSession: () => {
    const { status, restTimeRemaining } = get();
    if (status === 'paused') {
      set({ status: restTimeRemaining > 0 ? 'resting' : 'running' });
    }
  },

  completeExercise: (reps, duration) => {
    const { exercises, currentExerciseIndex, workoutLog } = get();
    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return;

    const newLogEntry: WorkoutLogEntry = {
      exerciseId: currentExercise.id,
    };
    if (reps !== undefined || currentExercise.reps !== undefined) {
      newLogEntry.completedReps = reps ?? currentExercise.reps;
    }
    if (duration !== undefined || currentExercise.durationSeconds !== undefined) {
      newLogEntry.completedDurationSeconds = duration ?? currentExercise.durationSeconds;
    }

    const hasNext = currentExerciseIndex < exercises.length - 1;
    const restTime = currentExercise.restTimeSeconds;

    set({
      workoutLog: [...workoutLog, newLogEntry],
      status: hasNext && restTime > 0 ? 'resting' : hasNext ? 'running' : 'completed',
      restTimeRemaining: hasNext ? restTime : 0,
      currentExerciseIndex:
        hasNext && restTime === 0 ? currentExerciseIndex + 1 : currentExerciseIndex,
    });
  },

  skipExercise: () => {
    const { exercises, currentExerciseIndex } = get();
    const hasNext = currentExerciseIndex < exercises.length - 1;
    set({
      status: hasNext ? 'running' : 'completed',
      restTimeRemaining: 0,
      currentExerciseIndex: hasNext ? currentExerciseIndex + 1 : currentExerciseIndex,
    });
  },

  skipRest: () => {
    const { currentExerciseIndex, exercises } = get();
    set({
      status: 'running',
      restTimeRemaining: 0,
      currentExerciseIndex: Math.min(currentExerciseIndex + 1, exercises.length - 1),
    });
  },

  decrementRestTimer: () => {
    const { restTimeRemaining, currentExerciseIndex, exercises } = get();
    if (restTimeRemaining > 0) {
      const nextTime = restTimeRemaining - 1;
      set({
        restTimeRemaining: nextTime,
        status: nextTime === 0 ? 'running' : 'resting',
        currentExerciseIndex:
          nextTime === 0
            ? Math.min(currentExerciseIndex + 1, exercises.length - 1)
            : currentExerciseIndex,
      });
    }
  },

  endSession: () => {
    set({ status: 'completed' });
  },

  resetSession: () => {
    set({
      status: 'idle',
      missionName: '',
      exercises: [],
      currentExerciseIndex: 0,
      restTimeRemaining: 0,
      workoutLog: [],
    });
  },
}));
