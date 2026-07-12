import type { ReactNode } from "react";
import { Car, Clock3, DoorOpen, KeyRound, LogOut, Wifi } from "lucide-react";

import { CopyButton } from "@/components/property/copy-field";
import { formatAccessType, formatHour } from "@/lib/format";
import type { Property } from "@/lib/validators/property";

export function ArrivalEssentials({ property }: { property: Property }) {
  const { operational, rules } = property;

  const parkingValue = operational.has_parking_spot
    ? operational.parking_spot_identifier ?? "Available"
    : "Not available";

  return (
    <section
      id="access"
      className="scroll-mt-24 border-b border-line bg-transparent pb-6 sm:pb-8"
    >
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
          Arrival essentials
        </p>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-navy sm:text-2xl">
          Everything needed to arrive and connect
        </h2>
        <p className="text-sm leading-6 text-muted">
          Check-in timing, WiFi, property access, and parking details for the
          first few minutes of the stay.
        </p>
      </div>

      <div className="mt-5 grid gap-2.5 sm:mt-6 sm:gap-3 sm:grid-cols-2">
        <Tile
          icon={<Clock3 className="h-5 w-5" />}
          label="Check-in"
          value={`From ${formatHour(rules.check_in_time)}`}
        />
        <Tile
          icon={<LogOut className="h-5 w-5" />}
          label="Check-out"
          value={`Until ${formatHour(rules.check_out_time)}`}
        />

        <Tile icon={<Wifi className="h-5 w-5" />} label="WiFi">
          <div className="mt-3 rounded-field border border-line bg-fog/80 p-3">
            <p className="text-xs font-medium text-muted">Network</p>
            <p className="mt-1 truncate font-semibold text-navy" title={operational.wifi_network}>
              {operational.wifi_network}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-field border border-line bg-surface/95 px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">Password</p>
              <p className="mt-0.5 truncate font-semibold text-navy" title={operational.wifi_password}>
                {operational.wifi_password}
              </p>
            </div>
            <CopyButton
              value={operational.wifi_password}
              label="Copy WiFi password"
            />
          </div>
        </Tile>

        <Tile icon={<Car className="h-5 w-5" />} label="Parking">
          <p className="mt-2 font-semibold text-navy">{parkingValue}</p>
          {operational.parking_spot_instructions ? (
            <p className="mt-2 break-words text-sm leading-6 text-muted">
              {operational.parking_spot_instructions}
            </p>
          ) : null}
        </Tile>
      </div>

      <div className="mt-3 rounded-card border border-coral/20 bg-surface/92 p-3 shadow-card sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-field bg-coral text-white shadow-card">
            <DoorOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="text-xs font-medium text-muted">Property access</p>
              <p className="font-semibold text-navy">
                {formatAccessType(operational.property_access_type)}
              </p>
            </div>
            <p className="break-words text-sm leading-6 text-muted">
              {operational.property_access_instructions}
            </p>
            {operational.property_password ? (
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-field border border-line bg-fog/85 px-3 py-2">
                <KeyRound className="h-4 w-4 shrink-0 text-coral" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-muted">Access code</span>
                  <span
                    className="block truncate font-semibold text-navy"
                    title={operational.property_password}
                  >
                    {operational.property_password}
                  </span>
                </span>
                <span className="shrink-0">
                  <CopyButton
                    value={operational.property_password}
                    label="Copy access code"
                  />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({
  icon,
  label,
  value,
  children,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-panel border border-line bg-surface/86 p-3 shadow-card sm:p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-muted">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
          {icon}
        </span>
        {label}
      </p>
      {value ? (
        <p className="mt-2 break-words font-semibold text-navy">{value}</p>
      ) : null}
      {children}
    </div>
  );
}
