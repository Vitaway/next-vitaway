/** Ports of vitaway-app Pages/healthMetrics/calculations/get*_data.dart. */
import { parseStamp, type HealthMetric } from "./health";

const ymdKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function byDay(all: HealthMetric[], type: string): Map<string, HealthMetric> {
  const map = new Map<string, HealthMetric>();
  const rows = all
    .filter((m) => m.type.toLowerCase() === type)
    .map((m) => ({ m, at: parseStamp(m.last_updated) }))
    .filter((r): r is { m: HealthMetric; at: Date } => r.at !== null)
    .sort((a, b) => a.at.getTime() - b.at.getTime());
  // Later readings win the day, like the Dart map literal over insertion order.
  for (const { m, at } of rows) map.set(ymdKey(at), m);
  return map;
}

export function hasMetricReading(m: HealthMetric): boolean {
  if (m.type === "bp") return (m.systolic ?? 0) > 0 || (m.diastolic ?? 0) > 0;
  return (Number.parseFloat(m.latest_value) || 0) > 0;
}

/** Monday-first current week, one slot per day (null = no reading). */
export function currentWeek(all: HealthMetric[], type: string, now = new Date()): Array<HealthMetric | null> {
  const map = byDay(all, type);
  const weekday = (now.getDay() + 6) % 7; // Mon=0
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - weekday);
  return Array.from({ length: 7 }, (_, i) => map.get(ymdKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))) ?? null);
}

export function currentMonth(all: HealthMetric[], type: string, now = new Date()): HealthMetric[] {
  const map = byDay(all, type);
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const out: HealthMetric[] = [];
  for (let d = 1; d <= days; d += 1) {
    const m = map.get(ymdKey(new Date(now.getFullYear(), now.getMonth(), d)));
    if (m && m.latest_value !== "") out.push(m);
  }
  return out;
}

export function currentYear(all: HealthMetric[], type: string, now = new Date()): HealthMetric[] {
  const map = byDay(all, type);
  const out: HealthMetric[] = [];
  for (let i = 0; i < 365; i += 1) {
    const m = map.get(ymdKey(new Date(now.getFullYear(), 0, 1 + i)));
    if (m && m.latest_value !== "") out.push(m);
  }
  return out;
}

export function primaryValue(m: HealthMetric): number {
  return m.type === "bp" ? m.systolic ?? 0 : Number.parseFloat(m.latest_value) || 0;
}

/** First-seen order of the latest reading per type (HealthMetricsProvider.homeMetrics). */
export function homeMetrics(all: HealthMetric[]): HealthMetric[] {
  const order: string[] = [];
  const latest = new Map<string, HealthMetric>();
  for (const m of all) {
    if (!latest.has(m.type)) order.push(m.type);
    const cur = latest.get(m.type);
    const a = parseStamp(m.last_updated)?.getTime() ?? 0;
    const b = cur ? parseStamp(cur.last_updated)?.getTime() ?? 0 : -1;
    if (!cur || a > b) latest.set(m.type, m);
  }
  return order.map((t) => latest.get(t)!).filter(Boolean);
}
