import { clsx } from "clsx";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 text-navy",
        className,
      )}
      aria-label="Hostwise"
    >
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-current/10 bg-surface text-sm font-semibold tracking-[-0.08em] text-current shadow-card">
        <span className="absolute inset-x-2 top-2 h-px bg-current/25" />
        <span className="absolute inset-y-2 left-1/2 w-px bg-current/18" />
        H
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[-0.045em]">Hostwise</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-orange">
          Guest guides
        </span>
      </span>
    </div>
  );
}
