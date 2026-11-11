"use client";

import {
  CalendarDays,
  ClipboardList,
  MessageCircle,
  Pill,
  Utensils,
  Activity,
} from "lucide-react";
import Logo from "@/app/components/logo";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { displayAccountName } from "@/lib/plus/session";

const NAV_ITEMS = [
  { id: "today", label: "Today", icon: CalendarDays, current: true },
  { id: "readings", label: "Readings", icon: Activity, current: false },
  { id: "meals", label: "Meals", icon: Utensils, current: false },
  { id: "plan", label: "Plan", icon: ClipboardList, current: false },
  { id: "chat", label: "Chat", icon: MessageCircle, current: false },
  { id: "pillbox", label: "Pillbox", icon: Pill, current: false },
] as const;

export default function PlusShell({ children }: { children: React.ReactNode }) {
  const { session, signOut } = usePlusAuth();

  return (
    <div className="flex min-h-dvh flex-col bg-[#F6F3EE] text-[#003E48]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#003E48] pt-[env(safe-area-inset-top)] text-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Logo className="h-9 w-auto brightness-0 invert" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Vitaway Plus</p>
            <p className="truncate text-xs text-white/70">{displayAccountName(session)}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-28">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#003E48]/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
        aria-label="App"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-6 px-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={!item.current}
                  title={item.current ? item.label : `${item.label} — coming soon`}
                  aria-current={item.current ? "page" : undefined}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold ${
                    item.current ? "text-[#E85A2E]" : "text-[#003E48]/35"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
