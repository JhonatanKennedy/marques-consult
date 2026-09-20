const NO_DATE = 'sem-data';

function toDate(iso?: string): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The identity of the day a version falls on, used to group versions and as a
 * React key — never displayed. `dayHeading` in `@/text/dates` is what the reader
 * sees for the same day.
 */
export function dayKey(iso?: string): string {
  const date = toDate(iso);
  if (!date) return NO_DATE;
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
