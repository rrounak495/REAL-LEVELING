export type DayState = 'morning' | 'afternoon' | 'evening' | 'night';

export const getDayState = (date: Date = new Date()): DayState => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export const getGreeting = (state: DayState): string => {
  switch (state) {
    case 'morning':
      return 'GOOD MORNING, HUNTER.';
    case 'afternoon':
      return 'GOOD AFTERNOON, HUNTER.';
    case 'evening':
      return 'GOOD EVENING, HUNTER.';
    case 'night':
      return 'LATE NIGHT PROTOCOL.';
  }
};
