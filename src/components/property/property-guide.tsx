import Image from "next/image";
import {
  Baby,
  BedDouble,
  Car,
  Clock3,
  DoorOpen,
  MapPin,
  MessageCircle,
  PawPrint,
  ShowerHead,
  Users,
  Wifi,
} from "lucide-react";

import { ChatWidget } from "@/components/chat/chat-widget";
import { ExperienceGuideSection } from "@/components/experience-guide/experience-guide-section";
import { Card, SectionTitle } from "@/components/ui/card";
import {
  formatAccessType,
  formatHour,
  formatPhoneForWhatsApp,
  formatRule,
  getEnabledAmenities,
  getFullAddress,
} from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";

export function PropertyGuide({
  property,
  guide,
}: {
  property: Property;
  guide: ExperienceGuide | null;
}) {
  const amenities = getEnabledAmenities(property);
  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(property.host.phone)}`;

  return (
    <main className="min-h-screen bg-[#f7fbfc] pb-24 text-slate-900">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src={property.images[0]}
          alt={`Foto do imóvel ${property.name}`}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/30" />
        <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col justify-end px-5 py-8 sm:px-8 lg:px-10">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              Guia do Hóspede · {property.code}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              {property.name}
            </h1>
            <p className="flex items-center gap-2 text-lg text-cyan-50">
              <MapPin className="h-5 w-5" />
              {property.address.neighborhood}, {property.address.city}/
              {property.address.state}
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroStat
              icon={<Users className="h-5 w-5" />}
              label="Capacidade"
              value={`${property.guestCapacity} hóspedes`}
            />
            <HeroStat
              icon={<BedDouble className="h-5 w-5" />}
              label="Quartos"
              value={`${property.bedroomQuantity} quartos`}
            />
            <HeroStat
              icon={<ShowerHead className="h-5 w-5" />}
              label="Banheiros"
              value={`${property.bathroomQuantity} banheiro${property.bathroomQuantity > 1 ? "s" : ""}`}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div className="space-y-6">
          <Card>
            <SectionTitle
              eyebrow="Chegada"
              title="Informações essenciais"
              description="Tudo que você precisa para entrar, conectar e começar a estadia sem atrito."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoTile
                icon={<Clock3 className="h-5 w-5" />}
                label="Check-in"
                value={`A partir das ${formatHour(property.rules.check_in_time)}`}
              />
              <InfoTile
                icon={<Clock3 className="h-5 w-5" />}
                label="Check-out"
                value={`Até ${formatHour(property.rules.check_out_time)}`}
              />
              <InfoTile
                icon={<Wifi className="h-5 w-5" />}
                label="WiFi"
                value={`${property.operational.wifi_network} · ${property.operational.wifi_password}`}
              />
              <InfoTile
                icon={<Car className="h-5 w-5" />}
                label="Estacionamento"
                value={
                  property.operational.has_parking_spot
                    ? property.operational.parking_spot_identifier ?? "Disponível"
                    : "Não disponível"
                }
              />
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Acesso" title="Como acessar o imóvel" />
            <div className="mt-5 rounded-2xl bg-cyan-50 p-5">
              <p className="flex items-center gap-2 font-semibold text-slate-950">
                <DoorOpen className="h-5 w-5 text-cyan-700" />
                {formatAccessType(property.operational.property_access_type)}
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                {property.operational.property_access_instructions}
              </p>
              {property.operational.parking_spot_instructions ? (
                <p className="mt-3 leading-7 text-slate-700">
                  <strong>Estacionamento:</strong>{" "}
                  {property.operational.parking_spot_instructions}
                </p>
              ) : null}
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Regras" title="Regras da estadia" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <RuleItem
                icon={<PawPrint className="h-5 w-5" />}
                text={formatRule(
                  property.rules.allow_pet,
                  "Pets são permitidos",
                  "Pets não são permitidos",
                )}
              />
              <RuleItem
                icon={<MessageCircle className="h-5 w-5" />}
                text={formatRule(
                  property.rules.events_permitted,
                  "Eventos são permitidos",
                  "Festas e eventos não são permitidos",
                )}
              />
              <RuleItem
                icon={<Baby className="h-5 w-5" />}
                text={formatRule(
                  property.rules.suitable_for_children,
                  "Adequado para crianças",
                  "Não indicado para crianças",
                )}
              />
              <RuleItem
                icon={<DoorOpen className="h-5 w-5" />}
                text={formatRule(
                  property.rules.smoking_permitted,
                  "Fumar é permitido",
                  "Não é permitido fumar",
                )}
              />
            </div>
          </Card>

          <ExperienceGuideSection
            propertyCode={property.code}
            initialGuide={guide}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <SectionTitle eyebrow="Imóvel" title="Detalhes" />
            <dl className="mt-5 space-y-4 text-sm">
              <Detail label="Tipo" value={property.propertyType} />
              <Detail label="Endereço" value={getFullAddress(property)} />
              <Detail label="Anfitrião" value={property.host.name} />
            </dl>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center rounded-full bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
            >
              Falar com anfitrião
            </a>
          </Card>

          <Card>
            <SectionTitle eyebrow="Conforto" title="Amenidades" />
            <div className="mt-5 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <ChatWidget propertyCode={property.code} />
    </main>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/15 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-cyan-50">{icon}{label}</div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-cyan-700">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function RuleItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
      <span className="text-cyan-700">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 leading-6 text-slate-900">{value}</dd>
    </div>
  );
}
