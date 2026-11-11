"use client";

import { useCallback, useEffect, useState } from "react";

/** Local reminders, like the Flutter app's Hive `Reminder` box (kept on this device only). */
export type Reminder = {
  id: string;
  type: "med" | "glucose" | "bp" | string;
  name: string;
  times: string[];
  timeEnabled: boolean[];
  active: boolean;
  recurring: boolean;
  repeat: boolean;
  repeatDays: string[];
  isNotificationEnabled: boolean;
  dateCreated: string;
};

const KEY = "vitaway.plus.reminders";
const listeners = new Set<(list: Reminder[]) => void>();

function read(): Reminder[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Reminder[]) : [];
  } catch {
    return [];
  }
}

function write(list: Reminder[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((listener) => listener(list));
}

export function useReminders() {
  const [list, setList] = useState<Reminder[]>([]);
  useEffect(() => {
    setList(read());
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  const save = useCallback((reminder: Reminder) => {
    const current = read();
    const index = current.findIndex((r) => r.id === reminder.id);
    if (index >= 0) current[index] = reminder;
    else current.push(reminder);
    write(current);
  }, []);
  const remove = useCallback((id: string) => write(read().filter((r) => r.id !== id)), []);
  return { list, save, remove };
}
