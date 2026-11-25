"use client";

import { createContext, useContext } from "react";

export type QuickLogKind = "glucose" | "bp" | "weight" | "habits" | "meal";

/** Set while a quick-log screen is shown inside the Log modal (not as a page). */
export const QuickLogContext = createContext<{ close: () => void } | null>(null);

export const useQuickLog = () => useContext(QuickLogContext);
