import { repositories } from '@/db/repositories';
import {
  type UserJourneyInsert,
  type UserJourneyDayInsert,
} from '@/db/repositories/supabase/JourneyRepository';
import { AdaptiveDifficultyService } from '@/services/AdaptiveDifficultyService';
import { type Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export class JourneyGenerationService {
  /**
   * Generates a complete Journey structure based on user preferences.
   * This builds the structural backbone (chapters, days, bosses) and saves it to the database.
   */
  static generateJourneyStructure(
    userId: string,
    profile: any,
    goal: string,
    durationDays: number,
  ): { journey: UserJourneyInsert; days: UserJourneyDayInsert[] } {
    const classPath = this.determineClassPath(goal);

    const journey: UserJourneyInsert = {
      user_id: userId,
      goal: goal,
      journey_type: goal,
      duration_days: durationDays,
      status: 'active',
      current_day: 1,
      class_path: classPath,
    };

    const days: UserJourneyDayInsert[] = [];
    const chapterLength = 7; // A chapter is roughly a week

    for (let i = 1; i <= durationDays; i++) {
      const chapterNumber = Math.ceil(i / chapterLength);

      // Every 7th day is a milestone/boss day
      // Every 4th day is a recovery day
      let dayType = 'workout';
      let bossId = null;

      if (i % chapterLength === 0) {
        dayType = 'boss'; // Or milestone
        bossId = 'generate-uuid-placeholder'; // In real implementation, link to actual boss table
      } else if (i % 4 === 0) {
        dayType = 'recovery';
      }

      const storyText = this.generateStoryText(goal, dayType, i, chapterNumber);
      const chapterName = this.generateChapterName(chapterNumber, goal);

      days.push({
        journey_id: '', // Will be set by Repository
        day_number: i,
        chapter_number: chapterNumber,
        day_type: dayType,
        status: 'pending',
        story_text: storyText,
        mission_ids: [], // Missions are generated dynamically JIT or assigned later
        boss_id: bossId,
      });
    }

    return { journey, days };
  }

  /**
   * JIT (Just In Time) Generation for today's mission.
   * Translates the generic journey day into actual Mission records.
   */
  static generateDailyMissions(journeyDay: any, profile: any) {
    const missions = [];
    // Adaptive logic depending on training location, time, experience
    const timeAvailable = profile.available_daily_time || 30;
    const location = profile.training_location || 'home';
    const experience = profile.fitness_experience || 'beginner';

    if (journeyDay.day_type === 'workout') {
      if (location === 'home') {
        missions.push({
          title: 'Bodyweight Circuit',
          description: 'No equipment needed. Push your limits.',
          required_count: experience === 'experienced' ? 5 : 3,
          reward_xp: 150,
          reward_coins: 50,
        });
      } else {
        missions.push({
          title: 'Gym Strength Protocol',
          description: 'Hit the weights. Focus on form.',
          required_count: experience === 'experienced' ? 5 : 3,
          reward_xp: 200,
          reward_coins: 75,
        });
      }
    } else if (journeyDay.day_type === 'recovery') {
      missions.push({
        title: 'Active Recovery',
        description: 'Mobility, stretching, and hydration. Recovery is progress.',
        required_count: 1,
        reward_xp: 50,
        reward_coins: 20,
      });
    }

    return missions;
  }

  private static determineClassPath(goal: string): string {
    switch (goal) {
      case 'muscle_gain':
      case 'strength':
        return 'berserker';
      case 'weight_loss':
      case 'endurance':
        return 'assassin';
      default:
        return 'hunter';
    }
  }

  private static generateStoryText(
    goal: string,
    dayType: string,
    day: number,
    chapter: number,
  ): string {
    if (dayType === 'recovery') return "Recovery today strengthens tomorrow's progress.";
    if (dayType === 'boss') return 'A milestone trial awaits to test your growth.';

    // Mix of short motivational and directional messages
    const messages = [
      "Today's objective prepares you for the next Trial.",
      'Consistency creates strength.',
      'Every completed mission changes your future.',
      'The System monitors your progress.',
      'Your next Evolution is getting closer.',
      'A new day, a new trial.',
      'Focus on the task ahead. The Path demands discipline.',
    ];

    // Use day number to deterministically pick a message so it doesn't change randomly on refresh
    return messages[(day + chapter) % messages.length] ?? 'Consistency creates strength.';
  }

  public static generateChapterName(chapter: number, goal: string): string {
    const defaultChapters = [
      'Awakening',
      'First Trial',
      'Hunter Exam',
      'Elite Promotion',
      'Shadow Evolution',
      'Monarch Candidate',
      'The Abyss',
      'Ascension',
    ];
    const weightLossChapters = [
      'The Shedding',
      'Lightened Step',
      'Endurance Test',
      'Agility Awakening',
      'Sleek Shadow',
      'Unburdened',
    ];
    const muscleGainChapters = [
      'Foundation of Iron',
      'The Bulking',
      'Raw Power',
      'Unbreakable',
      "Titan's Grasp",
      'The Juggernaut',
    ];

    let chaptersToUse = defaultChapters;
    if (goal === 'weight_loss' || goal === 'endurance') chaptersToUse = weightLossChapters;
    if (goal === 'muscle_gain' || goal === 'strength') chaptersToUse = muscleGainChapters;

    // Fallback if chapter exceeds defined names
    if (chapter > chaptersToUse.length) return `Trial Phase ${chapter}`;
    return chaptersToUse[chapter - 1] || `Trial Phase ${chapter}`;
  }
}
