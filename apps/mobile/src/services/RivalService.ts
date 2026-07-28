export class RivalService {
  /**
   * For the prototype, we mock the rival data.
   * In a real app, this would query the `rivals` table or dynamically
   * find someone with similar XP/Rank using the SocialRepository.
   */
  static async getRival(userId: string) {
    // Fake rival for development
    return {
      id: 'rival-123',
      username: 'ShadowMonarch',
      rank: 'A',
      level: 42,
      xpGap: -1500, // They are 1500 XP ahead
      recentlyRankedUp: false,
    };
  }
}
