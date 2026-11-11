/** Date formats matching the Flutter `intl` patterns the app uses (English names). */

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAYS_SHORT = WEEKDAYS.map((d) => d.slice(0, 3));

const p2 = (n: number) => String(n).padStart(2, "0");

/** EEE, MMM d */
export const fmtHeaderDate = (d: Date) => `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
/** HH:mm */
export const fmtHm = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}`;
/** h:mm a */
export const fmtHma = (d: Date) => `${d.getHours() % 12 || 12}:${p2(d.getMinutes())} ${d.getHours() < 12 ? "AM" : "PM"}`;
/** d MMM */
export const fmtDMMM = (d: Date) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
/** d MMM yyyy */
export const fmtDMMMY = (d: Date) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
/** d MMM, HH:mm */
export const fmtDMMMHm = (d: Date) => `${fmtDMMM(d)}, ${fmtHm(d)}`;
/** EEEE, d MMMM */
export const fmtLongDay = (d: Date) => `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
/** EEE d MMM */
export const fmtShortDay = (d: Date) => `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
/** EEEE, d MMMM yyyy */
export const fmtFullDate = (d: Date) => `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseYmd(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Chat-style time label: h:mm a / Yesterday / EEE / d MMM. */
export function fmtListTime(d: Date, now = new Date()): string {
  if (sameDay(d, now)) return fmtHma(d);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";
  const diff = (startOfDay(now).getTime() - startOfDay(d).getTime()) / 86_400_000;
  if (diff < 7) return WEEKDAYS_SHORT[d.getDay()];
  return fmtDMMM(d);
}

export function formatMoney(amount: number | string | null | undefined, currency = "RWF"): string {
  const n = Number(amount ?? 0);
  if (!Number.isFinite(n)) return `${amount ?? ""}`;
  return `${currency} ${Math.round(n).toLocaleString("en-US")}`;
}
