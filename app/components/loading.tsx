export default function Loading() {
    return (
        <div className="flex min-h-[40vh] items-center justify-center rounded-[22px] bg-[#F6F3EE] sm:rounded-[28px]" aria-busy="true">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#003E48]/20 border-t-[#E85A2E]" />
                <p className="text-sm font-medium text-[#003E48]/60">Loading…</p>
            </div>
        </div>
    );
}
