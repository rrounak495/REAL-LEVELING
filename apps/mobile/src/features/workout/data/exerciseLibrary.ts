export interface ExerciseMetadata {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'mobility' | 'recovery';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  equipmentRequired: string[];
  reps?: number;
  sets?: number;
  durationSeconds?: number;
  restTimeSeconds: number;
  caloriesEstimate?: number;
  thumbnailUrl: string;
  animationUrl: string;
  instructions: string[];
  commonMistakes: string[];
  tips: string[];
  aiVerificationSupported: boolean;
}

export const EXERCISE_LIBRARY: Record<string, ExerciseMetadata> = {
  push_up_standard: {
    id: 'push_up_standard',
    name: 'Standard Push-Up',
    category: 'strength',
    difficulty: 'beginner',
    targetMuscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    equipmentRequired: ['None'],
    reps: 15,
    sets: 3,
    restTimeSeconds: 45,
    caloriesEstimate: 10,
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Push+Up',
    animationUrl: 'https://via.placeholder.com/600x400.png?text=Push+Up+Animation',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Lower your body until your chest nearly touches the floor.',
      'Keep your core tight and back straight.',
      'Push back up to the starting position.',
    ],
    commonMistakes: ['Flaring elbows out too wide', 'Sagging hips', 'Not going deep enough'],
    tips: ['Keep your neck neutral', 'Squeeze your glutes'],
    aiVerificationSupported: true,
  },
  plank_standard: {
    id: 'plank_standard',
    name: 'Forearm Plank',
    category: 'strength',
    difficulty: 'beginner',
    targetMuscleGroups: ['Core', 'Shoulders'],
    equipmentRequired: ['None'],
    durationSeconds: 60,
    sets: 3,
    restTimeSeconds: 30,
    caloriesEstimate: 5,
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Plank',
    animationUrl: 'https://via.placeholder.com/600x400.png?text=Plank+Animation',
    instructions: [
      'Rest your forearms on the floor, elbows directly underneath your shoulders.',
      'Extend your legs straight behind you, toes on the floor.',
      'Keep your body in a straight line from head to heels.',
      'Hold this position.',
    ],
    commonMistakes: ['Dropping hips toward the floor', 'Piking hips up toward the ceiling'],
    tips: ['Breathe evenly', 'Push the floor away with your forearms'],
    aiVerificationSupported: true,
  },
  stretching_routine: {
    id: 'stretching_routine',
    name: 'Full Body Mobility',
    category: 'recovery',
    difficulty: 'beginner',
    targetMuscleGroups: ['Full Body'],
    equipmentRequired: ['Mat (Optional)'],
    durationSeconds: 300,
    restTimeSeconds: 0,
    caloriesEstimate: 20,
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Mobility',
    animationUrl: 'https://via.placeholder.com/600x400.png?text=Mobility+Animation',
    instructions: [
      'Follow the on-screen mobility flows.',
      'Focus on deep, controlled breathing.',
      'Never stretch to the point of sharp pain.',
    ],
    commonMistakes: ['Holding breath', 'Bouncing during a stretch'],
    tips: ['Exhale deeply as you sink into a stretch'],
    aiVerificationSupported: false,
  },
};

/**
 * Utility to fetch a workout plan mapped to library items based on the journey day.
 */
export const getWorkoutForMission = (missionIds: string[]): ExerciseMetadata[] => {
  // In a real app, this parses missionIds and fetches the associated exercises.
  // For this prototype, we'll return a static sequence based on mission type.
  const isRecovery = missionIds.some((id) => id.includes('recovery') || id.includes('rest'));

  if (isRecovery) {
    return [EXERCISE_LIBRARY['stretching_routine']!];
  }

  // Default to a 2-exercise circuit
  return [EXERCISE_LIBRARY['push_up_standard']!, EXERCISE_LIBRARY['plank_standard']!];
};
