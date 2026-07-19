import { repositories } from '@/db/repositories';
import { UserJourneyDayRow } from '@/db/repositories/supabase/JourneyRepository';

export class JourneyProgressService {
  /**
   * Marks a specific journey day as completed.
   */
  static async completeJourneyDay(dayId: string) {
    return repositories.journey.updateJourneyDay(dayId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  }

  /**
   * Evaluates if any pending days have been missed based on the start_date and current_day.
   * Updates their status to 'missed' if applicable.
   */
  static async evaluateMissedDays(journeyId: string, startDate: string, currentSystemDate: Date) {
    const journeyDaysRes = await repositories.journey.getJourneyDays(journeyId);
    if (!journeyDaysRes.success || !journeyDaysRes.data) return;

    const days = journeyDaysRes.data;
    const start = new Date(startDate);

    // Calculate how many days have passed since start
    const diffTime = Math.abs(currentSystemDate.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Expected current day index

    for (const day of days) {
      if (day.status === 'pending' && day.day_number < diffDays) {
        await repositories.journey.updateJourneyDay(day.id, { status: 'missed' });
      }
    }
  }

  /**
   * Advances the current day of the active journey to match the calendar date.
   */
  static async syncCurrentDay(journeyId: string, startDate: string, currentSystemDate: Date) {
    const start = new Date(startDate);
    const diffTime = Math.abs(currentSystemDate.getTime() - start.getTime());
    const expectedCurrentDay = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return repositories.journey.updateJourney(journeyId, {
      current_day: expectedCurrentDay,
    });
  }
}
