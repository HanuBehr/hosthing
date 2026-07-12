import { Building2, CalendarDays, CheckCircle2, MapPin, MessageCircle, Phone, User, Users } from "lucide-react";

import { SectionTitle } from "@/components/ui/card";
import {
  formatPhoneForWhatsApp,
  getEnabledAmenities,
  getFullAddress,
} from "@/lib/format";
import type { Property } from "@/lib/validators/property";
import type { Reservation } from "@/lib/validators/reservation";

export function StaySummary({
  property,
  reservation,
}: {
  property: Property;
  reservation: Reservation | null;
}) {
  const amenities = getEnabledAmenities(property);
  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(property.host.phone)}`;

  return (
    <aside className="space-y-4 rounded-card border border-line bg-surface/86 p-4 shadow-card backdrop-blur sm:space-y-5 sm:p-5 lg:sticky lg:top-24 lg:self-start">
      <section className="border-b border-line pb-5">
        <SectionTitle eyebrow="Your stay" title="Summary" />
        <dl className="mt-4 space-y-3 text-sm sm:mt-5 sm:space-y-4">
          <Detail
            icon={<Building2 className="h-4 w-4" aria-hidden />}
            label="Type"
            value={property.propertyType}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" aria-hidden />}
            label="Location"
            value={`${property.address.city}/${property.address.state}`}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" aria-hidden />}
            label="Address"
            value={getFullAddress(property)}
          />
        </dl>
      </section>

      {reservation ? (
        <section className="border-b border-line pb-5">
          <SectionTitle eyebrow="Reservation" title="Booking details" />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
            <MiniStat label="Check-in" value={formatDate(reservation.checkInDate)} />
            <MiniStat label="Check-out" value={formatDate(reservation.checkOutDate)} />
          </div>
          <dl className="mt-4 space-y-3 text-sm sm:space-y-4">
            <Detail
              icon={<Building2 className="h-4 w-4" aria-hidden />}
              label="Reservation code"
              value={reservation.reservationCode}
            />
            <Detail
              icon={<User className="h-4 w-4" aria-hidden />}
              label="Guest"
              value={reservation.guestName}
            />
            <Detail
              icon={<Users className="h-4 w-4" aria-hidden />}
              label="Guests"
              value={String(reservation.guestCount)}
            />
            <Detail
              icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
              label="Status"
              value={reservation.status}
            />
            <Detail
              icon={<CalendarDays className="h-4 w-4" aria-hidden />}
              label="Cleaning fee"
              value={formatMoney(reservation.cleaningFee, reservation.currency)}
            />
          </dl>
        </section>
      ) : null}

      <section
        id="contact"
        className="scroll-mt-24 border-b border-line pb-5"
      >
        <SectionTitle eyebrow="Contact" title="Host" />
        <div className="mt-4 rounded-panel border border-line bg-fog/75 p-3 sm:mt-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
              {property.host.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-navy">{property.host.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {property.host.phone}
              </p>
            </div>
          </div>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 sm:mt-5"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Contact host
        </a>
      </section>

      {amenities.length > 0 ? (
        <section>
          <SectionTitle eyebrow="Amenities" title="What this property offers" />
          <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            {amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-navy"
              >
                {amenity}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(value);
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-field border border-line bg-fog/75 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-semibold text-navy">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted">{label}</dt>
        <dd className="mt-0.5 break-words font-semibold text-navy">{value}</dd>
      </div>
    </div>
  );
}
