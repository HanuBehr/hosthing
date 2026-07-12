import Link from "next/link";

import { propertyCodes } from "@/lib/property-catalog";

export default function PropertyNotFound() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <section className="app-surface w-full max-w-xl rounded-card border border-line p-6 shadow-raised sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
          Code not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-navy">
          We could not find a property with this code.
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Check the property code and try again, or open one of the featured
          stays below.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-navy px-5 py-3 font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
        >
          Try another code
        </Link>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs font-medium text-muted">Featured stays:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {propertyCodes.map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                className="rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-coral hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
