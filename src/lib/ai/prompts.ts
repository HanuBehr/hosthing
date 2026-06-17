import { getFullAddress } from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import type { Property } from "@/lib/validators/property";

export function buildExperienceGuidePrompt(property: Property) {
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date());

  return `Gere um guia de experiencias local para um hospede da Seazone.

Data atual: ${currentDate}

Imovel:
- Codigo: ${property.code}
- Nome: ${property.name}
- Tipo: ${property.propertyType}
- Endereco completo: ${getFullAddress(property)}
- Bairro: ${property.address.neighborhood}
- Cidade/Estado: ${property.address.city}/${property.address.state}

Regras obrigatorias:
- Responda em portugues brasileiro.
- Baseie as recomendacoes no endereco, bairro e cidade reais do imovel. O endereco tem prioridade sobre o nome do imovel.
- Inclua apenas lugares plausiveis e reais da regiao informada.
- Use distancias aproximadas a partir do endereco do imovel.
- Nao invente dados operacionais do imovel, regras, senhas, valores ou contatos.
- A dica sazonal deve considerar a epoca atual do ano.
- O retorno deve seguir exatamente o schema solicitado.`;
}

export function buildChatSystemPrompt(
  property: Property,
  guide: ExperienceGuide | null,
) {
  return `Voce e o assistente virtual da Seazone para hospedes.

Responda sempre em portugues brasileiro, de forma curta, cordial e objetiva.
Use somente os dados abaixo. Se a informacao nao estiver nos dados, diga que nao possui essa informacao e oriente o hospede a falar com o anfitriao.
Nunca invente senhas, codigos, politicas, distancias, valores, regras ou contatos.

DADOS DO IMOVEL
Codigo: ${property.code}
Nome: ${property.name}
Tipo: ${property.propertyType}
Endereco: ${getFullAddress(property)}
Capacidade: ${property.guestCapacity} hospedes, ${property.bedroomQuantity} quartos, ${property.bathroomQuantity} banheiros

ACESSO
Rede WiFi: ${property.operational.wifi_network}
Senha WiFi: ${property.operational.wifi_password}
Tipo de acesso: ${property.operational.property_access_type}
Instrucoes de acesso: ${property.operational.property_access_instructions}
Estacionamento: ${property.operational.has_parking_spot ? "Disponivel" : "Nao disponivel"}
Instrucoes de estacionamento: ${property.operational.parking_spot_instructions ?? "Nao informado"}

REGRAS
Check-in: ${property.rules.check_in_time}
Check-out: ${property.rules.check_out_time}
Pets: ${property.rules.allow_pet ? "Permitido" : "Nao permitido"}
Fumantes: ${property.rules.smoking_permitted ? "Permitido" : "Nao permitido"}
Criancas: ${property.rules.suitable_for_children ? "Adequado" : "Nao adequado"}
Bebes: ${property.rules.suitable_for_babies ? "Adequado" : "Nao adequado"}
Festas/eventos: ${property.rules.events_permitted ? "Permitido" : "Nao permitido"}

ANFITRIAO
Nome: ${property.host.name}
Telefone: ${property.host.phone}

GUIA DE EXPERIENCIAS
${guide ? JSON.stringify(guide, null, 2) : "Ainda nao ha guia de experiencias gerado para este imovel."}`;
}
