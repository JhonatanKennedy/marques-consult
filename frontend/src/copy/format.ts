const LOCALE = 'pt-BR';

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dayNumberFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit' });

const longFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortWeekdayFormat = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
});

const shortMonthFormat = new Intl.DateTimeFormat(LOCALE, { month: 'short' });

const parse = (iso?: string): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function dayKey(iso?: string): string {
  const date = parse(iso);
  if (!date) return 'sem-data';
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function timeOf(iso?: string): string {
  const date = parse(iso);
  return date ? timeFormat.format(date) : '--:--';
}

export function fullMoment(iso?: string): string {
  const date = parse(iso);
  if (!date) return 'momento não registrado';
  return `${longFormat.format(date)} às ${timeFormat.format(date)}`;
}

const bare = (value: string) => value.replace(/\.$/, '');

const MILLISECONDS_PER_DAY = 86_400_000;

const RELATIVE_DAY_LIMIT = 7;

function relativeDay(iso?: string): string | null {
  const date = parse(iso);
  if (!date) return null;

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / MILLISECONDS_PER_DAY,
  );

  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days > 1 && days < RELATIVE_DAY_LIMIT) {
    return bare(shortWeekdayFormat.format(date));
  }
  return null;
}

export function dayHeading(iso?: string): { kicker: string; day: string } {
  const date = parse(iso);
  if (!date) return { kicker: 'sem data', day: '—' };
  return {
    kicker: relativeDay(iso) ?? bare(shortMonthFormat.format(date)),
    day: dayNumberFormat.format(date),
  };
}

export function plural(count: number, one: string, many: string): string {
  return count === 1 ? `1 ${one}` : `${count} ${many}`;
}
