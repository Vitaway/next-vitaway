"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { QuickLogContext, type QuickLogKind } from "@/lib/plus/quick-log-context";
import { useAppPath } from "./dock";
import { RootPortal, cx } from "../ui/vita";

import LogGlucoseScreen from "../readings/log-glucose";
import LogBpScreen from "../readings/log-bp";
import LogWeightScreen from "../readings/log-weight";
import HabitsScreen from "../readings/habits";
import { MealPhotoComposeScreen } from "../meals/meal-photos";

/** Quick-log menu paths that open as a modal on this screen instead of a new page. */
const MODAL_FOR_PATH: Record<string, QuickLogKind> = {
  "/log/glucose": "glucose",
  "/log/bp": "bp",
  "/log/weight": "weight",
  "/habits": "habits",
  "/meal-photos/new": "meal",
};

export const quickLogKindFor = (path: string): QuickLogKind | null => MODAL_FOR_PATH[path] ?? null;

const OpenContext = createContext<(kind: QuickLogKind) => void>(() => {});
export const useOpenQuickLog = () => useContext(OpenContext);

function Screen({ kind }: { kind: QuickLogKind }) {
  switch (kind) {
    case "glucose": return <LogGlucoseScreen />;
    case "bp": return <LogBpScreen />;
    case "weight": return <LogWeightScreen />;
    case "habits": return <HabitsScreen />;
    case "meal": return <MealPhotoComposeScreen />;
  }
}

/** Hosts the Log menu's screens in a modal over whatever page the member is on. */
export function QuickLogProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<QuickLogKind | null>(null);
  const path = useAppPath();
  const close = useCallback(() => setKind(null), []);
  const ctx = useMemo(() => ({ close }), [close]);

  // Navigating anywhere (e.g. "See trend" after saving) closes the modal.
  useEffect(() => setKind(null), [path]);

  useEffect(() => {
    if (!kind) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [kind, close]);

  return (
    <OpenContext.Provider value={setKind}>
      {children}
      {kind ? (
        <RootPortal>
          <div className="vita-modal-scrim" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
            <div className={cx("vita-modal", "vita-ql", )} role="dialog" aria-modal="true">
              <QuickLogContext.Provider value={ctx}>
                <Screen kind={kind} />
              </QuickLogContext.Provider>
            </div>
          </div>
        </RootPortal>
      ) : null}
    </OpenContext.Provider>
  );
}
