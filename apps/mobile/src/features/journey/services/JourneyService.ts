import { repositories } from '@/db/repositories';
import { JourneyGenerationService } from './JourneyGenerationService';
import { JourneyProgressService } from './JourneyProgressService';
import { JourneyRewardService } from './JourneyRewardService';

export class JourneyService {
  /**
   * Retrieves the user's active journey, syncing the current day based on calendar time.
   */
  static async getActiveJourney(userId: string) {
    const journeyRes = await repositories.journey.getActiveJourney(userId);
    if (!journeyRes.success || !journeyRes.data) return null;

    const journey = journeyRes.data;

    // Sync days if needed
    const currentDate = new Date();
    await JourneyProgressService.syncCurrentDay(
      journey.id,
      journey.start_date ?? journey.created_at,
      currentDate,
    );
    await JourneyProgressService.evaluateMissedDays(
      journey.id,
      journey.start_date ?? journey.created_at,
      currentDate,
    );

    // Fetch the updated journey and days
    const updatedJourneyRes = await repositories.journey.getActiveJourney(userId);
    const daysRes = await repositories.journey.getJourneyDays(journey.id);

    if (updatedJourneyRes.success && daysRes.success) {
      return {
        ...updatedJourneyRes.data,
        days: daysRes.data,
      };
    }
    return null;
  }

  /**
   * Starts a new journey for the user.
   */
  static async startJourney(userId: string, profile: any, goal: string, durationDays: number) {
    // Check if an active journey exists
    const active = await repositories.journey.getActiveJourney(userId);
    if (active.success && active.data) {
      // Abandon the current journey before starting a new one
      await repositories.journey.updateJourney(active.data.id, { status: 'abandoned' });
    }

    // Generate structure
    const { journey, days } = JourneyGenerationService.generateJourneyStructure(
      userId,
      profile,
      goal,
      durationDays,
    );
    journey.start_date = new Date().toISOString();

    // Persist
    const result = await repositories.journey.createJourney(journey, days);
    return result;
  }

  /**
   * Gets today's objective context for the active journey.
   */
  static async getTodaysObjective(journeyId: string, currentDayNumber: number, profile: any) {
    const daysRes = await repositories.journey.getJourneyDays(journeyId);
    if (!daysRes.success || !daysRes.data) return null;

    const todayDay = daysRes.data.find((d: any) => d.day_number === currentDayNumber);
    if (!todayDay) return null;

    // Resolve missions JIT
    const missions = JourneyGenerationService.generateDailyMissions(todayDay, profile);

    return {
      day: todayDay,
      missions,
    };
  }

  /**
   * Abandons an active journey.
   */
  static async abandonJourney(journeyId: string) {
    return repositories.journey.updateJourney(journeyId, { status: 'abandoned' });
  }
}
