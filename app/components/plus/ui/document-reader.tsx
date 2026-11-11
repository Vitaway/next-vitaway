"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DocumentDownload } from "iconsax-react";
import { AppBar, CenterSpinner, EmptyState } from "./vita";

type OpenArgs = { title: string; load: () => Promise<Blob>; filename?: string };
type ReaderValue = { open: (args: OpenArgs) => Promise<void> };

const ReaderContext = createContext<ReaderValue | null>(null);

type State = { title: string; filename: string; url: string | null; type: string; error: string | null } | null;

/** DocumentReaderPage: in-app reader for PDFs and images. */
export function DocumentReaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(null);

  const close = useCallback(() => {
    setState((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return null;
    });
  }, []);

  const open = useCallback(async ({ title, load, filename }: OpenArgs) => {
    setState({ title, filename: filename ?? title, url: null, type: "", error: null });
    try {
      const blob = await load();
      if (blob.size === 0) throw new Error("This file is empty.");
      const url = URL.createObjectURL(blob);
      setState((current) => (current ? { ...current, url, type: blob.type } : (URL.revokeObjectURL(url), null)));
    } catch (error) {
      setState((current) => (current ? { ...current, error: error instanceof Error && error.message ? error.message : "Could not open this file" } : null));
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  const value = useMemo(() => ({ open }), [open]);
  const isImage = state?.type.startsWith("image/") ?? false;

  return (
    <ReaderContext.Provider value={value}>
      {children}
      {state ? (
        <div className="vita-page" style={{ position: "fixed", inset: 0, zIndex: 80, maxWidth: 480, margin: "0 auto", background: "var(--vc-canvas)" }}>
          <AppBar
            title={state.title}
            onBack={close}
            actions={
              state.url ? (
                <a className="vita-circle-btn" href={state.url} download={state.filename} aria-label="Download" style={{ width: 40, height: 40 }}>
                  <DocumentDownload size={18} color="currentColor" />
                </a>
              ) : null
            }
          />
          <div style={{ flex: 1, position: "relative", overflow: "auto" }}>
            {state.error ? (
              <EmptyState title="Could not open this file" subtitle={state.error} />
            ) : !state.url ? (
              <CenterSpinner />
            ) : isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={state.url} alt={state.title} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            ) : (
              <iframe src={state.url} title={state.title} style={{ border: 0, width: "100%", height: "100%", display: "block", background: "#fff" }} />
            )}
          </div>
        </div>
      ) : null}
    </ReaderContext.Provider>
  );
}

export function useDocumentReader(): ReaderValue {
  const value = useContext(ReaderContext);
  if (!value) throw new Error("useDocumentReader must be used within DocumentReaderProvider");
  return value;
}

