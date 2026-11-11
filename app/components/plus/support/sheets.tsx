"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { MobileApiError, mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { HANDLE_PATTERN, acceptGuidelines, guidelinesAccepted } from "@/lib/plus/client/chat";
import { useLegal } from "../legal/legal-dialog";
import { ActionButton, Modal } from "../ui/vita";

const CONTACT_EMAIL = "support@vitaway.org";
const CONTACT_PHONE = "+250 795 767 405";

const para = { margin: "0 0 10px", fontSize: 14, lineHeight: 1.4, color: "var(--vc-navy)" } as const;

/** Wraps chat_guidelines_sheet.dart and community_handle_sheet.dart as awaitable modals. */
export function useChatGate() {
  const t = useT();
  const { user } = useMe();
  const { openLegal } = useLegal();
  const [sheet, setSheet] = useState<null | "guidelines" | "handle">(null);
  const [handleRequired, setHandleRequired] = useState(false);
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const savedHandle = useRef<string | null>(null);
  const currentHandle = () => (savedHandle.current ?? user?.profile?.community_handle ?? "").trim();

  const finish = (ok: boolean) => {
    setSheet(null);
    resolver.current?.(ok);
    resolver.current = null;
  };

  const ensureGuidelines = (): Promise<boolean> => {
    if (guidelinesAccepted()) return Promise.resolve(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
      setSheet("guidelines");
    });
  };

  const ensureHandle = (forceSheet = false): Promise<boolean> => {
    const has = currentHandle().length > 0;
    if (has && !forceSheet) return Promise.resolve(true);
    return new Promise((resolve) => {
      resolver.current = (saved) => resolve(saved || currentHandle().length > 0);
      setHandleRequired(!has);
      setHandle(currentHandle());
      setError(null);
      setSheet("handle");
    });
  };

  const save = async () => {
    const raw = handle.trim();
    if (!HANDLE_PATTERN.test(raw)) return setError(t("community_handle_invalid"));
    const clean = (s: string) => s.replace(/[^A-Za-z0-9_]/g, "").toLowerCase();
    const first = clean(user?.first_name ?? "");
    const last = clean(user?.last_name ?? "");
    const lower = raw.toLowerCase();
    if ((first.length >= 3 && lower === first) || (last.length >= 3 && lower === last) || (first && last && (lower === `${first}${last}` || lower === `${last}${first}`))) {
      return setError(t("community_handle_lookalike"));
    }
    setSaving(true);
    setError(null);
    try {
      await mobileRequest("/update_profile/", { method: "POST", body: { community_handle: raw } });
      savedHandle.current = raw;
      invalidate("/me/");
      setSaving(false);
      finish(true);
      return;
    } catch (e) {
      let message = t("community_handle_taken");
      if (e instanceof MobileApiError && e.status) {
        const detail = e.body && typeof e.body === "object" ? (e.body as Record<string, unknown>).detail : null;
        if (detail !== null && detail !== undefined) {
          const d = String(detail).toLowerCase();
          message = d.includes("taken") ? t("community_handle_taken") : d.includes("real name") ? t("community_handle_lookalike") : d.includes("letters") ? t("community_handle_invalid") : String(detail);
        }
      } else {
        message = t("network_error");
      }
      setError(message);
    }
    setSaving(false);
  };

  const blurb = t(handleRequired ? "community_setup_body" : "community_handle_body");
  const element = (
    <>
      <Modal
        open={sheet === "guidelines"}
        title="Before you chat"
        actions={<ActionButton full label="Agree and continue" onClick={() => { acceptGuidelines(); finish(true); }} />}
      >
        <p style={para}>Messages you send can be reported. A coach can remove one that breaks these rules.</p>
        <p style={para}>You can report a message or block someone from the message menu. Blocking stops new messages both ways.</p>
        <p style={para}>In Community, people see the name you choose, not your real name.</p>
        <p style={{ ...para, fontWeight: 700, whiteSpace: "pre-line" }}>{`Questions: ${CONTACT_EMAIL}\n${CONTACT_PHONE}`}</p>
        <button
          type="button"
          onClick={() => openLegal("privacy")}
          style={{ padding: 0, border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--vc-teal-ink)" }}
        >
          Privacy policy
        </button>
      </Modal>
      <Modal open={sheet === "handle"} title={t(handleRequired ? "community_setup_title" : "community_handle")} onClose={() => finish(false)}>
        {blurb.trim() ? <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.4, fontWeight: 500, color: "var(--vc-muted)" }}>{blurb}</p> : null}
        <input
          autoFocus
          maxLength={20}
          value={handle}
          placeholder={t("community_handle_hint")}
          onChange={(e) => {
            setHandle(e.target.value.replace(/[^A-Za-z0-9_]/g, ""));
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !saving && HANDLE_PATTERN.test(handle.trim())) void save();
          }}
          style={{ width: "100%", padding: "14px 12px", borderRadius: 10, border: `1px solid ${error ? "var(--vc-danger)" : "rgba(var(--vc-navy-rgb),0.12)"}`, background: "var(--vc-surface)", fontSize: 16, color: "var(--vc-ink)", outline: "none" }}
        />
        {error ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--vc-danger)" }}>{error}</div> : null}
        <div style={{ height: 16 }} />
        <ActionButton
          full
          label={t("community_handle_save")}
          loading={saving}
          disabled={!HANDLE_PATTERN.test(handle.trim())}
          onClick={save}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
        />
      </Modal>
    </>
  );
  return { ensureGuidelines, ensureHandle, element };
}
