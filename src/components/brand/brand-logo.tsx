import { clsx } from "clsx";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 text-navy",
        className,
      )}
      aria-label="StayPilot AI"
    >
      <span className="grid h-9 w-9 place-items-center rounded-field bg-navy text-sm font-black tracking-[-0.08em] text-white shadow-card">
        SP
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[-0.04em]">StayPilot</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-coral">
          AI
        </span>
      </span>
    </div>
  );
}
