import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export function Card({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...props}
      className={clsx(
        "rounded-card border border-line bg-surface/90 p-5 shadow-card sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1.5">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-navy sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
