import type { ReactNode } from "react";
import { Car, Clock3, DoorOpen, KeyRound, LogOut, Wifi } from "lucide-react";

import { CopyButton } from "@/components/property/copy-field";
import { formatAccessType, formatHour } from "@/lib/format";
import type { Property } from "@/lib/validators/property";

export function ArrivalEssentials({ property }: { property: Property }) {
  const { operational, rules } = property;

  const parkingValue = operational.has_parking_spot
    ? operational.parking_spot_identifier ?? "Disponível"
    : "Não disponível";

  return (
    <section
      id="acesso"
      className="scroll-mt-24 border-b border-line bg-transparent pb-8"
    >
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
          Para sua chegada
        </p>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-navy sm:text-2xl">
          O essencial para entrar e se conectar
        </h2>
        <p className="text-sm leading-6 text-muted">
          Tudo que você precisa nos primeiros minutos: horários, WiFi, acesso ao
          imóvel e estacionamento.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Tile
          icon={<Clock3 className="h-5 w-5" />}
          label="Check-in"
          value={`A partir das ${formatHour(rules.check_in_time)}`}
        />
        <Tile
          icon={<LogOut className="h-5 w-5" />}
          label="Check-out"
          value={`Até ${formatHour(rules.check_out_time)}`}
        />

        <Tile icon={<Wifi className="h-5 w-5" />} label="WiFi">
          <dl className="mt-3 space-y-2">
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-baseline gap-3">
              <dt className="text-xs font-medium text-muted">Rede</dt>
              <dd className="min-w-0 truncate text-right font-semibold text-navy" title={operational.wifi_network}>
                {operational.wifi_network}
              </dd>
            </div>
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2">
              <dt className="text-xs font-medium text-muted">Senha</dt>
              <dd className="flex min-w-0 items-center justify-end gap-2">
                <CopyButton
                  value={operational.wifi_password}
                  label="Copiar senha do WiFi"
                />
                <span
                  className="min-w-0 truncate text-right font-semibold text-navy"
                  title={operational.wifi_password}
                >
                  {operational.wifi_password}
                </span>
              </dd>
            </div>
          </dl>
        </Tile>

        <Tile icon={<Car className="h-5 w-5" />} label="Estacionamento">
          <p className="mt-2 font-semibold text-navy">{parkingValue}</p>
          {operational.parking_spot_instructions ? (
            <p className="mt-2 break-words text-sm leading-6 text-muted">
              {operational.parking_spot_instructions}
            </p>
          ) : null}
        </Tile>
      </div>

      <div className="mt-3 rounded-panel border border-line bg-surface/80 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
            <DoorOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="text-xs font-medium text-muted">Acesso ao imóvel</p>
              <p className="font-semibold text-navy">
                {formatAccessType(operational.property_access_type)}
              </p>
            </div>
            <p className="break-words text-sm leading-6 text-muted">
              {operational.property_access_instructions}
            </p>
            {operational.property_password ? (
              <div className="grid grid-cols-[auto_3.5rem_minmax(0,1fr)] items-center gap-2 rounded-field border border-line bg-surface px-3 py-2">
                <KeyRound className="h-4 w-4 shrink-0 text-coral" aria-hidden />
                <span className="text-xs font-medium text-muted">Código</span>
                <span className="flex min-w-0 items-center justify-end gap-2">
                  <CopyButton
                    value={operational.property_password}
                    label="Copiar código de acesso"
                  />
                  <span
                    className="min-w-0 truncate font-semibold text-navy"
                    title={operational.property_password}
                  >
                    {operational.property_password}
                  </span>
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
    <div className="rounded-panel border border-line bg-surface/80 p-4">
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
