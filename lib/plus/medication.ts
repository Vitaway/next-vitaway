/** Medication model and dose-window rules, ported from the Flutter app. */

export type MedicationSlot = { time: string; status: string; taken_at?: string | null };

export type Medication = {
  id: number;
  name: string;
  date_added: string;
  dosage: number;
  frequency: number;
  user?: number | null;
  unit: string;
  times: string[];
  instructions?: string | null;
  reminders_enabled: boolean;
  slots: MedicationSlot[];
};

export type AdherenceCell = { date: string; time: string; status: string };
export type NextDueDose = { medication_id: number; name: string; date: string; time: string; label: string };
export type MedicationAdherence = {
  days: string[];
  times: string[];
  taken: number;
  expected: number;
  percent: number;
  cells: AdherenceCell[];
  next_due: NextDueDose | null;
};

export type MedicationDayHistory = { date: string; slots: MedicationSlot[] };

export const EARLY_WINDOW_MS = 30 * 60 * 1000;
export const LATE_MISSED_WINDOW_MS = 30 * 60 * 1000;

function int(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeMedication(raw: Record<string, unknown>): Medication {
  const times = Array.isArray(raw.times) ? raw.times.map(String) : [];
  const slots = Array.isArray(raw.slots)
    ? (raw.slots as Array<Record<string, unknown>>).map((s) => ({
        time: String(s.time ?? ""),
        status: String(s.status ?? "upcoming"),
        taken_at: s.taken_at ? String(s.taken_at) : null,
      }))
    : [];
  return {
    id: int(raw.id),
    name: String(raw.name ?? ""),
    date_added: String(raw.date_added ?? "").split("T")[0],
    dosage: int(raw.dosage),
    frequency: raw.frequency === undefined || raw.frequency === null ? times.length : int(raw.frequency, times.length),
    user: raw.user === undefined ? null : int(raw.user),
    unit: raw.unit ? String(raw.unit) : "mg",
    times,
    instructions: raw.instructions ? String(raw.instructions) : null,
    reminders_enabled: raw.reminders_enabled !== false,
    slots,
  };
}

export function normalizeAdherence(raw: Record<string, unknown>): MedicationAdherence {
  const next = raw.next_due as Record<string, unknown> | null | undefined;
  return {
    days: Array.isArray(raw.days) ? raw.days.map(String) : [],
    times: Array.isArray(raw.times) ? raw.times.map(String).sort() : [],
    taken: int(raw.taken),
    expected: int(raw.expected),
    percent: int(raw.percent),
    cells: Array.isArray(raw.cells)
      ? (raw.cells as Array<Record<string, unknown>>).map((c) => ({
          date: String(c.date ?? ""),
          time: String(c.time ?? "") || String(c.period ?? ""),
          status: String(c.status ?? "empty"),
        }))
      : [],
    next_due:
      next && typeof next === "object"
        ? {
            medication_id: int(next.medication_id),
            name: String(next.name ?? ""),
            date: String(next.date ?? ""),
            time: String(next.time ?? ""),
            label: String(next.label ?? "Mark dose taken"),
          }
        : null,
  };
}

export function adherenceRowTimes(adherence: MedicationAdherence): string[] {
  if (adherence.times.length) return adherence.times;
  return Array.from(new Set(adherence.cells.map((c) => c.time).filter(Boolean))).sort();
}

export function defaultTimesForFrequency(frequency: number): string[] {
  switch (frequency) {
    case 1:
      return ["08:00"];
    case 2:
      return ["08:00", "20:00"];
    case 3:
      return ["08:00", "14:00", "20:00"];
    case 4:
      return ["08:00", "12:00", "16:00", "20:00"];
    case 5:
      return ["08:00", "11:00", "14:00", "17:00", "20:00"];
    case 6:
      return ["08:00", "10:00", "12:00", "14:00", "17:00", "20:00"];
    default: {
      if (frequency <= 0) return ["08:00"];
      const step = Math.round(Math.min(6, Math.max(1, 12 / frequency)));
      return Array.from({ length: Math.min(12, Math.max(1, frequency)) }, (_, i) => `${String(Math.min(22, Math.max(6, 8 + i * step))).padStart(2, "0")}:00`);
    }
  }
}

export function reminderTimes(med: Medication): string[] {
  return med.times.length ? med.times : defaultTimesForFrequency(med.frequency);
}

export function doseLabel(med: Medication): string {
  return `${med.dosage} ${med.unit}`;
}

export function scheduleLabel(med: Medication): string {
  const times = reminderTimes(med);
  const freq = med.frequency <= 0 ? times.length : med.frequency;
  return `${freq}x a day · ${times.join(" · ")}`;
}

export function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function slotDateTime(dateYmd: string, timeHm: string): Date | null {
  const d = dateYmd.split("-").map((v) => Number.parseInt(v, 10));
  const t = timeHm.split(":").map((v) => Number.parseInt(v, 10));
  if (d.length < 3 || t.length < 2 || [...d.slice(0, 3), ...t.slice(0, 2)].some((n) => !Number.isFinite(n))) return null;
  return new Date(d[0], d[1] - 1, d[2], t[0], t[1]);
}

export function effectiveSlotStatus(loggedStatus: string, dateYmd: string, timeHm: string, now = new Date()): string {
  const normalized = loggedStatus.toLowerCase();
  if (normalized === "taken") return "taken";
  if (normalized === "missed" || normalized === "skipped") return "missed";
  const when = slotDateTime(dateYmd, timeHm);
  if (!when) return normalized || "upcoming";
  if (now.getTime() < when.getTime() - EARLY_WINDOW_MS) return "upcoming";
  if (now.getTime() >= when.getTime() + LATE_MISSED_WINDOW_MS) return "missed";
  return "due";
}

export function canMarkDoseTaken(dateYmd: string, timeHm: string, loggedStatus = "", now = new Date()): boolean {
  if (loggedStatus.toLowerCase() === "taken") return false;
  const when = slotDateTime(dateYmd, timeHm);
  if (!when) return false;
  return now.getTime() >= when.getTime() - EARLY_WINDOW_MS;
}

export function withEffectiveTodaySlots(med: Medication, now = new Date()): Medication {
  if (!med.slots.length) return med;
  const today = ymd(now);
  return { ...med, slots: med.slots.map((s) => ({ ...s, status: effectiveSlotStatus(s.status, today, s.time, now) })) };
}

export const DOSE_COLORS: Record<string, { light: [string, string]; dark: [string, string] }> = {
  taken: { light: ["#E4F7E8", "#2F8F4E"], dark: ["#12352A", "#6FD3A6"] },
  due: { light: ["#FFE8D6", "#C45C12"], dark: ["#3A2219", "#F2A272"] },
  pending: { light: ["#FFE8D6", "#C45C12"], dark: ["#3A2219", "#F2A272"] },
  missed: { light: ["#FFF0C2", "#9A7300"], dark: ["#3D3419", "#E8C547"] },
};
