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
      text: formatRule(rules.allow_pet, "Pets allowed", "Pets not allowed"),
    },
    {
      icon: PartyPopper,
      allowed: rules.events_permitted,
      text: formatRule(
        rules.events_permitted,
        "Events allowed",
        "Parties and events are not allowed",
      ),
    },
    {
      icon: Users,
      allowed: rules.suitable_for_children,
      text: formatRule(
        rules.suitable_for_children,
        "Suitable for children",
        "Not recommended for children",
      ),
    },
    {
      icon: Baby,
      allowed: rules.suitable_for_babies,
      text: formatRule(
        rules.suitable_for_babies,
        "Suitable for babies",
        "Not recommended for babies",
      ),
    },
    {
      icon: Cigarette,
      allowed: rules.smoking_permitted,
      text: formatRule(
        rules.smoking_permitted,
        "Smoking allowed",
        "Smoking is not allowed",
      ),
    },
  ];

  return (
    <section
      id="rules"
      className="scroll-mt-24 border-b border-line bg-transparent pb-6 sm:pb-8"
    >
      <SectionTitle eyebrow="House rules" title="Stay policies" />
      <ul className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 sm:grid-cols-2">
        {items.map((rule) => {
          const Icon = rule.icon;
          const StatusIcon = rule.allowed ? Check : X;
          return (
            <li
              key={rule.text}
                className="flex items-center gap-3 rounded-panel border border-line bg-surface/85 p-3 sm:p-4"
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
