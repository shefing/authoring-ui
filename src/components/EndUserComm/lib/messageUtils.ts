/**
 * Convert expiration time from various units to seconds
 * @param value - The expiration value
 * @param unit - The unit of time ('minutes', 'hours', or 'days')
 * @returns The expiration time in seconds
 */
export function convertExpirationToSeconds(
  value: number,
  unit: 'minutes' | 'hours' | 'days'
): number {
  switch (unit) {
    case 'minutes':
      return value * 60;
    case 'hours':
      return value * 3600;
    case 'days':
      return value * 86400;
    default:
      return 0;
  }
}

/**
 * Type for expiration unit
 */
export type ExpirationUnit = 'minutes' | 'hours' | 'days';
