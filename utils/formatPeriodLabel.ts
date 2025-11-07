import { format } from 'date-fns';

export function formatPeriodLabel(period: string) {
  const [num, year] = period.split('-');

  // Week-based (e.g., 45-2025 → Wk45-2025)
  if (period.startsWith('Wk') || Number(num) > 12) {
    return `Wk${num}-${year}`;
  }

  // Month-based (1-2025 → Jan-2025)
  const monthIndex = Number(num) - 1; // JS months are 0-based
  const monthName = format(new Date(Number(year), monthIndex, 1), 'MMM');
  return `${monthName}-${year}`;
}
