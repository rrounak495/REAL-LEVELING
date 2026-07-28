export class JourneyRewardService {
  /**
   * Calculates and grants completion rewards for finishing an entire journey.
   */
  static async grantJourneyCompletionReward(
    userId: string,
    journeyType: string,
    durationDays: number,
  ) {
    // Reward multiplier based on journey duration
    const multiplier = Math.max(1, durationDays / 7);

    const xpReward = Math.floor(1000 * multiplier);
    const coinsReward = Math.floor(500 * multiplier);
    const gemsReward = Math.floor(10 * multiplier);

    // In a real implementation, interface with ProgressionRepository to add XP
    // and RewardsHistoryRepository to log the completion.
    console.log(
      `[JourneyRewardService] Granted ${xpReward} XP, ${coinsReward} Coins, ${gemsReward} Gems for completing ${journeyType}`,
    );

    return {
      xp: xpReward,
      coins: coinsReward,
      gems: gemsReward,
      title: `Veteran of the ${journeyType} Journey`,
      badge: `${journeyType}_completion_badge`,
    };
  }

  /**
   * Grants mini-rewards for completing a chapter or checkpoint.
   */
  static async grantCheckpointReward(userId: string, chapterNumber: number) {
    const xpReward = 200 + chapterNumber * 50;
    const coinsReward = 100;

    console.log(`[JourneyRewardService] Granted Checkpoint Reward for Chapter ${chapterNumber}`);

    return {
      xp: xpReward,
      coins: coinsReward,
    };
  }
}
