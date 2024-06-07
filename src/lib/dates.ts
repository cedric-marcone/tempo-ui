const DayFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
});

const DateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
});

export const DAYS = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

export function previousWeekday(date: Date, dayOfWeek: keyof typeof DAYS) {
  const day = DAYS[dayOfWeek];
  const curr = date.getUTCDay();
  const offset = (curr - day + 7) % 7;
  const prev = new Date(date);
  prev.setUTCDate(date.getUTCDate() - offset);
  return prev;
}

const DAY_IN_MS = 86_400_000;
export function differenceInDays(a: Date, b: Date) {
  const diff = a.getTime() - b.getTime();
  return diff / DAY_IN_MS;
}

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function formatDay(first: Date) {
  return (n: number) => {
    const d = new Date(first);
    d.setUTCDate(first.getUTCDate() + n);
    return { weekday: DayFormat.format(d), date: DateFormat.format(d) };
  };
}

export function parseUTCTimestamp(date: string) {
  const [d, t] = date.split("T");
  const [year, month, day] = d.split("-").map(Number);
  const [hour, minute] = t.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
}

export function parseUTCDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}
