/**
 * src/features/quests/engines/MissionGenerator.ts
 *
 * Handles the generation of Daily and Weekly fitness missions.
 */

export enum MissionCategory {
  STRENGTH = 'Strength',
  CARDIO = 'Cardio',
  MOBILITY = 'Mobility',
  NUTRITION = 'Nutrition',
  RECOVERY = 'Recovery',
  DISCIPLINE = 'Discipline',
}

export enum MissionDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXTREME = 'Extreme',
}

export enum MissionRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
}

export enum MissionType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface MissionTemplate {
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  rarity: MissionRarity;
  required_count: number;
  xp_reward: number;
  coin_reward: number;
}

// A predefined pool of Daily Missions
const DAILY_TEMPLATES: MissionTemplate[] = [
  {
    title: 'Daily Push-ups',
    description: 'Complete 20 Push-ups to build upper body strength.',
    category: MissionCategory.STRENGTH,
    difficulty: MissionDifficulty.EASY,
    rarity: MissionRarity.COMMON,
    required_count: 20,
    xp_reward: 50,
    coin_reward: 10,
  },
  {
    title: 'Daily Squats',
    description: 'Complete 30 Squats for lower body conditioning.',
    category: MissionCategory.STRENGTH,
    difficulty: MissionDifficulty.EASY,
    rarity: MissionRarity.COMMON,
    required_count: 30,
    xp_reward: 50,
    coin_reward: 10,
  },
  {
    title: 'Morning Run',
    description: 'Run for 2 KM.',
    category: MissionCategory.CARDIO,
    difficulty: MissionDifficulty.MEDIUM,
    rarity: MissionRarity.UNCOMMON,
    required_count: 2,
    xp_reward: 100,
    coin_reward: 25,
  },
  {
    title: 'Hydration Goal',
    description: 'Drink 3 Liters of water today.',
    category: MissionCategory.NUTRITION,
    difficulty: MissionDifficulty.EASY,
    rarity: MissionRarity.COMMON,
    required_count: 3,
    xp_reward: 30,
    coin_reward: 5,
  },
  {
    title: 'Deep Stretch',
    description: 'Stretch for 15 minutes.',
    category: MissionCategory.MOBILITY,
    difficulty: MissionDifficulty.EASY,
    rarity: MissionRarity.COMMON,
    required_count: 15,
    xp_reward: 40,
    coin_reward: 10,
  },
  {
    title: 'Proper Rest',
    description: 'Sleep for 7+ Hours.',
    category: MissionCategory.RECOVERY,
    difficulty: MissionDifficulty.MEDIUM,
    rarity: MissionRarity.UNCOMMON,
    required_count: 1,
    xp_reward: 80,
    coin_reward: 20,
  },
];

// A predefined pool of Weekly Missions
const WEEKLY_TEMPLATES: MissionTemplate[] = [
  {
    title: 'Weekly Warrior',
    description: 'Workout for 5 Days this week.',
    category: MissionCategory.DISCIPLINE,
    difficulty: MissionDifficulty.HARD,
    rarity: MissionRarity.RARE,
    required_count: 5,
    xp_reward: 500,
    coin_reward: 100,
  },
  {
    title: 'Marathon Prep',
    description: 'Run 15 KM total this week.',
    category: MissionCategory.CARDIO,
    difficulty: MissionDifficulty.HARD,
    rarity: MissionRarity.RARE,
    required_count: 15,
    xp_reward: 600,
    coin_reward: 120,
  },
  {
    title: 'Push-up Mastery',
    description: 'Complete 250 Push-ups this week.',
    category: MissionCategory.STRENGTH,
    difficulty: MissionDifficulty.HARD,
    rarity: MissionRarity.EPIC,
    required_count: 250,
    xp_reward: 800,
    coin_reward: 150,
  },
];

export class MissionGenerator {
  /**
   * Generates EXACTLY 4 Daily Missions ensuring category variety based on fitness goal.
   */
  static generateDailyMissions(userId: string, fitnessGoal: string = 'general_fitness'): any[] {
    // We want 1 Strength, 1 Cardio, and 2 Others
    const strengthMissions = DAILY_TEMPLATES.filter((t) => t.category === MissionCategory.STRENGTH);
    const cardioMissions = DAILY_TEMPLATES.filter((t) => t.category === MissionCategory.CARDIO);
    const otherMissions = DAILY_TEMPLATES.filter(
      (t) => t.category !== MissionCategory.STRENGTH && t.category !== MissionCategory.CARDIO,
    );

    const selected: MissionTemplate[] = [];

    // Goal-based weighting:
    // weight_loss: 2 Cardio, 1 Strength, 1 Other
    // muscle_gain: 2 Strength, 1 Cardio, 1 Other
    // general_fitness (default): 1 Strength, 1 Cardio, 2 Others

    let strengthCount = 1;
    let cardioCount = 1;
    let otherCount = 2;

    if (fitnessGoal === 'weight_loss') {
      cardioCount = 2;
      otherCount = 1;
    } else if (fitnessGoal === 'muscle_gain') {
      strengthCount = 2;
      otherCount = 1;
    }

    // Safely pick Strength
    for (let i = 0; i < strengthCount; i++) {
      if (strengthMissions.length > 0) {
        selected.push(
          strengthMissions.splice(
            Math.floor(Math.random() * strengthMissions.length),
            1,
          )[0] as MissionTemplate,
        );
      }
    }

    // Safely pick Cardio
    for (let i = 0; i < cardioCount; i++) {
      if (cardioMissions.length > 0) {
        selected.push(
          cardioMissions.splice(
            Math.floor(Math.random() * cardioMissions.length),
            1,
          )[0] as MissionTemplate,
        );
      }
    }

    // Safely pick Others
    for (let i = 0; i < otherCount; i++) {
      if (otherMissions.length > 0) {
        selected.push(
          otherMissions.splice(
            Math.floor(Math.random() * otherMissions.length),
            1,
          )[0] as MissionTemplate,
        );
      }
    }

    // Calculate expiry (next local midnight)
    const now = new Date();
    const expiresAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);

    return selected.map((template) =>
      this.mapTemplateToInsert(userId, template, MissionType.DAILY, expiresAt),
    );
  }

  /**
   * Generates EXACTLY 2 Weekly Missions.
   */
  static generateWeeklyMissions(userId: string): any[] {
    const pool = [...WEEKLY_TEMPLATES];
    const selected: MissionTemplate[] = [];

    for (let i = 0; i < 2; i++) {
      if (pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        selected.push(pool.splice(idx, 1)[0] as MissionTemplate);
      }
    }

    // Calculate expiry (next local Monday midnight)
    const now = new Date();
    const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7;
    const expiresAt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilMonday,
      0,
      0,
      0,
      0,
    );

    return selected.map((template) =>
      this.mapTemplateToInsert(userId, template, MissionType.WEEKLY, expiresAt),
    );
  }

  private static mapTemplateToInsert(
    userId: string,
    template: MissionTemplate,
    type: MissionType,
    expiresAt: Date,
  ) {
    return {
      user_id: userId,
      title: template.title,
      description: template.description,
      category: template.category,
      mission_type: type,
      difficulty: template.difficulty,
      rarity: template.rarity,
      xp_reward: template.xp_reward,
      coin_reward: template.coin_reward,
      required_count: template.required_count,
      current_progress: 0,
      is_completed: false,
      is_claimed: false,
      expires_at: expiresAt.toISOString(),
    };
  }
}
