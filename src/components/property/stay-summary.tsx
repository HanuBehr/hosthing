import { Building2, MapPin, MessageCircle, Phone, User } from "lucide-react";

import { SectionTitle } from "@/components/ui/card";
import {
  formatPhoneForWhatsApp,
  getEnabledAmenities,
  getFullAddress,
} from "@/lib/format";
import type { Property } from "@/lib/validators/property";

export function StaySummary({ property }: { property: Property }) {
  const amenities = getEnabledAmenities(property);
  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(property.host.phone)}`;

  return (
    <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-24 lg:self-start">
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

      <section
        id="contact"
        className="scroll-mt-24 border-b border-line pb-5"
      >
        <SectionTitle eyebrow="Contact" title="Host" />
        <dl className="mt-4 space-y-3 text-sm sm:mt-5 sm:space-y-4">
          <Detail
            icon={<User className="h-4 w-4" aria-hidden />}
            label="Name"
            value={property.host.name}
          />
          <Detail
            icon={<Phone className="h-4 w-4" aria-hidden />}
            label="Phone"
            value={property.host.phone}
          />
        </dl>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-field bg-orange px-5 py-3 font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 focus-visible:ring-offset-2 sm:mt-5"
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
