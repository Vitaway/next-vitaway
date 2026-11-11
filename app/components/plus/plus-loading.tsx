export default function PlusLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F6F3EE] px-6 text-[#003E48]">
      <div className="fetch-loader" aria-hidden />
      <p className="mt-4 text-sm text-[#003E48]/70">{label}</p>
    </div>
  );
}
