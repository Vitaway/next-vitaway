export default function Loading() {
  return (
    <div className="overflow-hidden rounded-b-[22px] bg-[#F6F3EE] sm:rounded-b-[28px]" aria-busy="true" aria-label="Loading page">
      <div className="relative min-h-[220px] overflow-hidden bg-[#003E48] sm:min-h-[260px]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#003E48] via-[#0a525c] to-[#003E48]" />
        <div className="relative z-10 mx-auto max-w-[1440px] space-y-4 px-5 py-12 lg:px-12 lg:py-16">
          <div className="h-10 w-2/3 max-w-xl animate-pulse rounded-lg bg-white/15" />
          <div className="h-4 w-1/2 max-w-md animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/5 max-w-sm animate-pulse rounded bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] space-y-4 px-5 py-10 lg:px-12">
        <div className="h-5 w-40 animate-pulse rounded bg-[#003E48]/10" />
        <div className="h-24 animate-pulse rounded-[20px] bg-white" />
        <div className="h-24 animate-pulse rounded-[20px] bg-white" />
        <div className="h-24 animate-pulse rounded-[20px] bg-white" />
      </div>
    </div>
  );
}
