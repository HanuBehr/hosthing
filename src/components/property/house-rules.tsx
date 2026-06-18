import type { ComponentType } from "react";
import {
  Baby,
  Check,
  Cigarette,
  PartyPopper,
  PawPrint,
  Users,
  X,
  type LucideProps,
} from "lucide-react";

import { SectionTitle } from "@/components/ui/card";
import { formatRule } from "@/lib/format";
import type { Property } from "@/lib/validators/property";

type Rule = {
  icon: ComponentType<LucideProps>;
  allowed: boolean;
  text: string;
};

export function HouseRules({ property }: { property: Property }) {
  const { rules } = property;

  const items: Rule[] = [
    {
      icon: PawPrint,
      allowed: rules.allow_pet,
      text: formatRule(rules.allow_pet, "Pets permitidos", "Pets não permitidos"),
    },
    {
      icon: PartyPopper,
      allowed: rules.events_permitted,
      text: formatRule(
        rules.events_permitted,
        "Eventos permitidos",
        "Festas e eventos não permitidos",
      ),
    },
    {
      icon: Users,
      allowed: rules.suitable_for_children,
      text: formatRule(
        rules.suitable_for_children,
        "Adequado para crianças",
        "Não indicado para crianças",
      ),
    },
    {
      icon: Baby,
      allowed: rules.suitable_for_babies,
      text: formatRule(
        rules.suitable_for_babies,
        "Adequado para bebês",
        "Não indicado para bebês",
      ),
    },
    {
      icon: Cigarette,
      allowed: rules.smoking_permitted,
      text: formatRule(
        rules.smoking_permitted,
        "Permitido fumar",
        "Não é permitido fumar",
      ),
    },
  ];

  return (
    <section
      id="regras"
      className="scroll-mt-24 border-b border-line bg-transparent pb-8"
    >
      <SectionTitle eyebrow="Regras da estadia" title="Políticas do imóvel" />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((rule) => {
          const Icon = rule.icon;
          const StatusIcon = rule.allowed ? Check : X;
          return (
            <li
              key={rule.text}
                className="flex items-center gap-3 rounded-panel border border-line bg-surface/85 p-4"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-field ${
                  rule.allowed
                    ? "bg-positive-soft text-positive"
                    : "bg-mist text-muted"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-navy">
                {rule.text}
              </span>
              <StatusIcon
                className={`h-4 w-4 shrink-0 ${
                  rule.allowed ? "text-positive" : "text-muted"
                }`}
                aria-hidden
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
