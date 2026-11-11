import { DotSpinner } from "./ui/vita";

export default function PlusLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 24,
        background: "var(--vc-canvas, #FFF4EE)",
        color: "var(--vc-navy, #003E48)",
      }}
    >
      <DotSpinner />
      <p style={{ margin: 0, fontSize: 14, color: "var(--vc-muted, #5C6D66)" }}>{label}</p>
    </div>
  );
}
