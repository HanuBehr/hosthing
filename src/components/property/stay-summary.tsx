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
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <section className="border-b border-line pb-5">
        <SectionTitle eyebrow="Sua estadia" title="Resumo" />
        <dl className="mt-5 space-y-4 text-sm">
          <Detail
            icon={<Building2 className="h-4 w-4" aria-hidden />}
            label="Tipo"
            value={property.propertyType}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" aria-hidden />}
            label="Localização"
            value={`${property.address.city}/${property.address.state}`}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" aria-hidden />}
            label="Endereço"
            value={getFullAddress(property)}
          />
        </dl>
      </section>

      <section
        id="contato"
        className="scroll-mt-24 border-b border-line pb-5"
      >
        <SectionTitle eyebrow="Contato" title="Anfitrião" />
        <dl className="mt-5 space-y-4 text-sm">
          <Detail
            icon={<User className="h-4 w-4" aria-hidden />}
            label="Nome"
            value={property.host.name}
          />
          <Detail
            icon={<Phone className="h-4 w-4" aria-hidden />}
            label="Telefone"
            value={property.host.phone}
          />
        </dl>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-field bg-orange px-5 py-3 font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Falar com anfitrião
        </a>
      </section>

      {amenities.length > 0 ? (
        <section>
          <SectionTitle eyebrow="Comodidades" title="O que o imóvel oferece" />
          <ul className="mt-5 flex flex-wrap gap-2">
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
