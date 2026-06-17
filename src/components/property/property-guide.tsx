import type { ReactNode } from "react";
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

import { SeazoneLogo } from "@/components/brand/seazone-logo";
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
  const heroImage = property.images[0];
  const shouldSkipOptimization = heroImage.includes("upload.wikimedia.org");

  return (
    <main className="seazone-shell min-h-screen pb-24 text-slate-900">
      <section className="relative isolate overflow-hidden bg-[#06243d] text-white">
        <Image
          src={heroImage}
          alt={`Foto do imóvel ${property.name}`}
          fill
          priority
          unoptimized={shouldSkipOptimization}
          sizes="100vw"
          className="-z-20 object-cover opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06243d] via-[#06243d]/78 to-[#0067b1]/35" />

        <div className="mx-auto flex min-h-[650px] max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <SeazoneLogo />
          </header>

          <div className="flex flex-1 flex-col justify-end">
            <div className="max-w-3xl space-y-5">
              <p className="inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Guia da sua estadia · {property.code}
              </p>
              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
                {property.name}
              </h1>
              <p className="flex items-center gap-2 text-lg text-cyan-50">
                <MapPin className="h-5 w-5" />
                {property.address.neighborhood}, {property.address.city}/
                {property.address.state}
              </p>
              <p className="max-w-2xl text-base leading-7 text-cyan-50/90">
                Um guia prático para sua chegada e estadia: acesso, WiFi,
                regras, contato e experiências próximas ao imóvel reservado.
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
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-cyan-100/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 text-sm font-semibold text-slate-600 sm:px-8 lg:px-10">
          <NavPill href="#acesso">Acesso</NavPill>
          <NavPill href="#regras">Regras</NavPill>
          <NavPill href="#experiencias">Experiências</NavPill>
          <NavPill href="#contato">Contato</NavPill>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div className="space-y-6">
          <Card id="acesso" className="seazone-card-shadow scroll-mt-24">
            <SectionTitle
              eyebrow="Informações de acesso"
              title="WiFi, horários e estacionamento"
              description="Dados práticos para entrada, conexão e deslocamento durante a estadia."
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

          <Card className="seazone-card-shadow">
            <SectionTitle
              eyebrow="Informações de acesso"
              title="Instruções de acesso ao imóvel"
            />
            <div className="mt-5 rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5">
              <p className="flex items-center gap-2 font-semibold text-[#06243d]">
                <DoorOpen className="h-5 w-5 text-[#0067b1]" />
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

          <Card id="regras" className="seazone-card-shadow scroll-mt-24">
            <SectionTitle eyebrow="Regras da estadia" title="Políticas do imóvel" />
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

          <div id="experiencias" className="scroll-mt-24">
            <ExperienceGuideSection
              propertyCode={property.code}
              initialGuide={guide}
            />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="seazone-card-shadow">
            <SectionTitle eyebrow="Dados do imóvel" title="Resumo da propriedade" />
            <dl className="mt-5 space-y-4 text-sm">
              <Detail label="Tipo" value={property.propertyType} />
              <Detail
                label="Localização"
                value={`${property.address.city}/${property.address.state}`}
              />
              <Detail label="Endereço" value={getFullAddress(property)} />
            </dl>
          </Card>

          <Card id="contato" className="seazone-card-shadow scroll-mt-24">
            <SectionTitle eyebrow="Contato" title="Anfitrião" />
            <dl className="mt-5 space-y-4 text-sm">
              <Detail label="Nome" value={property.host.name} />
              <Detail label="Telefone" value={property.host.phone} />
            </dl>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center rounded-full bg-[#ff8a1c] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#f47c08]"
            >
              Falar com anfitrião
            </a>
          </Card>

          <Card className="seazone-card-shadow">
            <SectionTitle eyebrow="Dados do imóvel" title="Amenidades" />
            <div className="mt-5 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-cyan-50 px-3 py-2 text-sm font-semibold text-[#0067b1]"
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

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full px-4 py-2 transition hover:bg-cyan-50 hover:text-[#0067b1]"
    >
      {children}
    </a>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-cyan-50">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-cyan-100 bg-gradient-to-br from-white to-cyan-50/70 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#0067b1]">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-semibold text-[#06243d]">{value}</p>
    </div>
  );
}

function RuleItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-100 bg-white p-4 text-slate-700 shadow-sm">
      <span className="text-[#0067b1]">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 leading-6 text-[#06243d]">{value}</dd>
    </div>
  );
}
