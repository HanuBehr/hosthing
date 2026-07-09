import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { formatHour } from "@/lib/format";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";
import { getExperienceGuideForProperty } from "@/server/experience-guides";
import { getPropertyByCode } from "@/server/properties";

export const runtime = "nodejs";

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

const chatRequestSchema = z.object({
  propertyCode: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

const fallbackLocalGuides: Record<
  string,
  {
    restaurants: Array<{ name: string; distance: string; description: string }>;
    attractions: Array<{ name: string; distance: string; description: string }>;
    essentials: Array<{
      name: string;
      distance: string;
      description: string;
      type: "pharmacy" | "supermarket" | "hospital" | "other";
    }>;
    airport: { name: string; distance: string; travelTime: string };
    transportTip: string;
    localContext: string;
    typicalFoodTip: string;
    seasonalTips: string;
  }
> = {
  FLN001: {
    restaurants: [
      {
        name: "Restaurante Meu Cantinho",
        distance: "aprox. 700 m",
        description: "opção casual para almoço no bairro Trindade",
      },
      {
        name: "Pizzaria Basilico",
        distance: "aprox. 1 km",
        description: "pizzaria prática para jantar perto da UFSC",
      },
      {
        name: "Sushi Yama",
        distance: "aprox. 1,4 km",
        description: "opção japonesa na região central da Trindade",
      },
      {
        name: "Café Cultura Trindade",
        distance: "aprox. 1,6 km",
        description: "café prático para brunch, lanche e trabalho remoto",
      },
    ],
    attractions: [
      {
        name: "UFSC",
        distance: "aprox. 900 m",
        description: "campus arborizado e principal ponto de referência da Trindade",
      },
      {
        name: "Shopping Villa Romana",
        distance: "aprox. 2,5 km",
        description: "shopping com lojas, cinema e opções de alimentação",
      },
      {
        name: "Lagoa da Conceição",
        distance: "aprox. 8 km",
        description: "região conhecida por bares, restaurantes e passeio à beira da lagoa",
      },
    ],
    essentials: [
      {
        name: "Imperatriz Gourmet Trindade",
        distance: "aprox. 1 km",
        description: "supermercado com itens de mercado e padaria",
        type: "supermarket",
      },
      {
        name: "Farmácia Catarinense Trindade",
        distance: "aprox. 500 m",
        description: "farmácia próxima para compras básicas",
        type: "pharmacy",
      },
      {
        name: "Hospital Universitário UFSC",
        distance: "aprox. 1,5 km",
        description: "referência hospitalar próxima ao bairro Trindade",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Florianópolis",
      distance: "aprox. 12 km",
      travelTime: "20 a 35 min de carro, dependendo do trânsito",
    },
    transportTip:
      "Na Trindade, transporte por app costuma ser prático; em horários de aula na UFSC, saia com alguns minutos de folga.",
    localContext:
      "Florianópolis combina vida universitária, praias, lagoas e cultura açoriana. A Trindade é uma região prática para quem quer ficar perto da UFSC e circular para outras áreas da ilha.",
    typicalFoodTip:
      "Na região de Florianópolis, frutos do mar, sequência de camarão, ostras e restaurantes próximos à Lagoa ou ao centro são boas pedidas; perto da Trindade, prefira opções práticas de bairro ou deslocamento curto por app.",
    seasonalTips:
      "A Trindade é prática para circular pela região da UFSC; em horários de aula, considere sair com alguns minutos de folga.",
  },
  GRM001: {
    restaurants: [
      {
        name: "Cara de Mau",
        distance: "aprox. 2 km",
        description: "restaurante temático muito conhecido em Gramado",
      },
      {
        name: "George III",
        distance: "aprox. 2 km",
        description: "cozinha contemporânea em uma casa clássica da cidade",
      },
      {
        name: "Cantina Pastasciutta",
        distance: "aprox. 2 km",
        description: "clássico de massas na região central de Gramado",
      },
      {
        name: "Malbec Restaurante",
        distance: "aprox. 2 km",
        description: "opção conhecida para carnes e jantar na área central",
      },
    ],
    attractions: [
      {
        name: "Rua Coberta",
        distance: "aprox. 2 km",
        description: "ponto central para caminhar, comer e ver o movimento",
      },
      {
        name: "Lago Negro",
        distance: "aprox. 3 km",
        description: "passeio clássico de Gramado, bom para fotos e caminhada",
      },
      {
        name: "Mini Mundo",
        distance: "aprox. 2 km",
        description: "atração tradicional para passeio leve em família",
      },
    ],
    essentials: [
      {
        name: "Nacional Gramado",
        distance: "aprox. 2 km",
        description: "supermercado prático para compras rápidas",
        type: "supermarket",
      },
      {
        name: "Panvel Centro Gramado",
        distance: "aprox. 2 km",
        description: "farmácia próxima da área mais turística",
        type: "pharmacy",
      },
      {
        name: "Hospital Arcanjo São Miguel",
        distance: "aprox. 3 km",
        description: "hospital de referência para atendimento na cidade",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Regional Hugo Cantergiani",
      distance: "aprox. 65 km",
      travelTime: "1h15 a 1h40 de carro, dependendo da estrada e do trânsito",
    },
    transportTip:
      "Em Gramado, transporte por app e táxi funcionam bem na área central, mas em alta temporada vale chamar com antecedência.",
    localContext:
      "Gramado é uma cidade turística da Serra Gaúcha, conhecida pela arquitetura de inspiração europeia, clima frio, chocolate, Natal Luz e passeios clássicos como Rua Coberta e Lago Negro.",
    typicalFoodTip:
      "Para comida típica em Gramado, considere fondue, massas, cafés coloniais e restaurantes de inspiração alemã/italiana na área central; Cara de Mau, George III e Cantina Pastasciutta são opções conhecidas da cidade.",
    seasonalTips:
      "Gramado costuma ter noites frias mesmo fora do inverno; leve uma camada extra para sair à noite.",
  },
  CMP001: {
    restaurants: [
      {
        name: "Pachamay",
        distance: "aprox. 1 km",
        description: "cozinha natural e pratos frescos perto da Praia do Campeche",
      },
      {
        name: "Zeca Bar e Restaurante",
        distance: "aprox. 3 km",
        description: "opção tradicional para frutos do mar no sul da ilha",
      },
      {
        name: "Pizzarium Pizzaria",
        distance: "aprox. 2 km",
        description: "boa opção casual para jantar no Campeche",
      },
      {
        name: "Nankin Sushi Campeche",
        distance: "aprox. 2 km",
        description: "opção japonesa casual para jantar no sul da ilha",
      },
    ],
    attractions: [
      {
        name: "Praia do Campeche",
        distance: "aprox. 1 km",
        description: "principal passeio da região, ideal para caminhada e mar",
      },
      {
        name: "Lagoa Pequena",
        distance: "aprox. 3 km",
        description: "área tranquila para contato com natureza no sul da ilha",
      },
      {
        name: "Ilha do Campeche",
        distance: "saídas próximas na temporada",
        description: "passeio de barco conhecido, sujeito a clima e disponibilidade",
      },
    ],
    essentials: [
      {
        name: "Hiper Select Campeche",
        distance: "aprox. 2 km",
        description: "supermercado conhecido no bairro",
        type: "supermarket",
      },
      {
        name: "Farmácia Panvel Campeche",
        distance: "aprox. 2 km",
        description: "farmácia útil para itens básicos da estadia",
        type: "pharmacy",
      },
      {
        name: "UPA Sul da Ilha",
        distance: "aprox. 7 km",
        description: "unidade pública de pronto atendimento no sul de Florianópolis",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Florianópolis",
      distance: "aprox. 10 km",
      travelTime: "15 a 30 min de carro, dependendo do trânsito",
    },
    transportTip:
      "No Campeche, transporte por app costuma funcionar bem, mas em dias de praia ou alta temporada pode demorar mais.",
    localContext:
      "O Campeche fica no sul de Florianópolis e é conhecido pela praia extensa, clima mais residencial e acesso a passeios como Ilha do Campeche quando as condições permitem.",
    typicalFoodTip:
      "No Campeche, boas escolhas costumam envolver frutos do mar, pizzarias e restaurantes casuais de praia; Pachamay, Zeca Bar e Pizzarium são opções práticas para a região.",
    seasonalTips:
      "Para praia, prefira chegar cedo ao Campeche e confira a condição do vento antes de sair.",
  },
  LAG001: {
    restaurants: [
      {
        name: "Books & Beers",
        distance: "aprox. 500 m",
        description: "bar e restaurante conhecido para jantar e petiscos na Lagoa",
      },
      {
        name: "Marquês da Lagoa",
        distance: "aprox. 700 m",
        description: "opção tradicional para frutos do mar e pratos brasileiros",
      },
      {
        name: "Pizzaria Nave Mãe",
        distance: "aprox. 1 km",
        description: "pizzaria casual e prática para jantar na região da Lagoa",
      },
      {
        name: "Café Cultura Lagoa",
        distance: "aprox. 800 m",
        description: "cafeteria conhecida para brunch, cafés e lanches",
      },
    ],
    attractions: [
      {
        name: "Centrinho da Lagoa",
        distance: "aprox. 500 m",
        description: "região com bares, cafés, restaurantes e movimento à noite",
      },
      {
        name: "Mirante da Lagoa da Conceição",
        distance: "aprox. 4 km",
        description: "ponto clássico para vista panorâmica da Lagoa",
      },
      {
        name: "Dunas da Joaquina",
        distance: "aprox. 5 km",
        description: "passeio aberto para fotos, caminhada e acesso à região da Joaquina",
      },
    ],
    essentials: [
      {
        name: "Supermercado Magia Lagoa",
        distance: "aprox. 900 m",
        description: "mercado prático para compras da estadia",
        type: "supermarket",
      },
      {
        name: "Farmácia Panvel Lagoa da Conceição",
        distance: "aprox. 700 m",
        description: "farmácia próxima ao centrinho da Lagoa",
        type: "pharmacy",
      },
      {
        name: "Hospital Universitário UFSC",
        distance: "aprox. 9 km",
        description: "referência hospitalar prática saindo da Lagoa pela região da Trindade",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Florianópolis",
      distance: "aprox. 18 km",
      travelTime: "30 a 50 min de carro, dependendo do trânsito e da temporada",
    },
    transportTip:
      "Na Lagoa da Conceição, caminhar pelo centrinho é prático; para praias como Joaquina, Mole e Barra da Lagoa, transporte por app costuma funcionar bem, mas pode demorar em alta temporada.",
    localContext:
      "A Lagoa da Conceição é uma das regiões mais conhecidas de Florianópolis, com vida noturna, restaurantes, cafés, esportes na água e acesso rápido às praias do leste da ilha.",
    typicalFoodTip:
      "Na Lagoa, frutos do mar, bares com petiscos e restaurantes casuais são boas escolhas; Books & Beers, Marquês da Lagoa e Pizzaria Nave Mãe são opções práticas para a região.",
    seasonalTips:
      "Na alta temporada, saia com antecedência para praias do leste; em dias de vento, a Lagoa pode ficar ótima para esportes e menos confortável para banho.",
  },
  JUR001: {
    restaurants: [
      {
        name: "Ponto Restaurante Jurerê",
        distance: "aprox. 800 m",
        description: "opção conhecida para refeições e frutos do mar perto da praia",
      },
      {
        name: "Jay Bistro",
        distance: "aprox. 1 km",
        description: "restaurante contemporâneo para jantar em Jurerê Internacional",
      },
      {
        name: "Donna Jurerê Internacional",
        distance: "aprox. 1,5 km",
        description: "opção sofisticada à beira-mar, boa para jantar ou drinks",
      },
      {
        name: "Spazzio Jurere",
        distance: "aprox. 1 km",
        description: "opção casual para refeição italiana e jantar em Jurerê",
      },
    ],
    attractions: [
      {
        name: "Praia de Jurerê Internacional",
        distance: "aprox. 600 m",
        description: "praia urbana com mar calmo, beach clubs e boa estrutura",
      },
      {
        name: "Open Shopping Jurerê",
        distance: "aprox. 700 m",
        description: "área aberta com lojas, cafés, restaurantes e eventos sazonais",
      },
      {
        name: "Fortaleza de São José da Ponta Grossa",
        distance: "aprox. 6 km",
        description: "passeio histórico com vista para o norte da ilha",
      },
    ],
    essentials: [
      {
        name: "Imperatriz Jurerê Internacional",
        distance: "aprox. 1 km",
        description: "supermercado completo para compras da estadia",
        type: "supermarket",
      },
      {
        name: "Panvel Jurerê Internacional",
        distance: "aprox. 900 m",
        description: "farmácia próxima ao Open Shopping e à região central de Jurerê",
        type: "pharmacy",
      },
      {
        name: "UPA Norte da Ilha",
        distance: "aprox. 10 km",
        description: "unidade de pronto atendimento para urgências no norte da ilha",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Florianópolis",
      distance: "aprox. 38 km",
      travelTime: "45 a 75 min de carro, dependendo do trânsito e da temporada",
    },
    transportTip:
      "Em Jurerê Internacional, caminhar funciona bem para praia, Open Shopping e restaurantes próximos; para centro, aeroporto e outras praias, use carro ou app com folga em alta temporada.",
    localContext:
      "Jurerê Internacional fica no norte de Florianópolis e é conhecido por praia com boa estrutura, ruas planejadas, beach clubs, restaurantes e perfil mais sofisticado.",
    typicalFoodTip:
      "Em Jurerê, frutos do mar, restaurantes à beira-mar e opções contemporâneas são boas escolhas; Ponto, Jay Bistro e Donna são referências úteis para a região.",
    seasonalTips:
      "No verão, reserve restaurantes e planeje deslocamentos com antecedência; fora da temporada, a região costuma ficar mais tranquila.",
  },
  STO001: {
    restaurants: [
      {
        name: "Ostradamus",
        distance: "aprox. 2 km",
        description: "referência de ostras e frutos do mar em Santo Antônio de Lisboa",
      },
      {
        name: "Marisqueira Sintra",
        distance: "aprox. 1,5 km",
        description: "restaurante português e de frutos do mar na orla do bairro",
      },
      {
        name: "FairyLand Café",
        distance: "aprox. 1 km",
        description: "café agradável para passeio leve no bairro histórico",
      },
      {
        name: "Restaurante Rosso",
        distance: "aprox. 4 km",
        description: "opção conhecida em Sambaqui para frutos do mar e vista da baía",
      },
    ],
    attractions: [
      {
        name: "Centro Histórico de Santo Antônio de Lisboa",
        distance: "aprox. 1 km",
        description: "casario açoriano, orla, lojas e restaurantes para caminhar",
      },
      {
        name: "Igreja Nossa Senhora das Necessidades",
        distance: "aprox. 1 km",
        description: "ponto histórico clássico do bairro",
      },
      {
        name: "Praia de Sambaqui",
        distance: "aprox. 4 km",
        description: "orla tranquila com pôr do sol e restaurantes de frutos do mar",
      },
    ],
    essentials: [
      {
        name: "Supermercado Santo Antônio",
        distance: "aprox. 1 km",
        description: "mercado de bairro para compras rápidas",
        type: "supermarket",
      },
      {
        name: "Farmácia Santo Antônio de Lisboa",
        distance: "aprox. 1 km",
        description: "farmácia prática para itens básicos",
        type: "pharmacy",
      },
      {
        name: "UPA Norte da Ilha",
        distance: "aprox. 12 km",
        description: "unidade de pronto atendimento para urgências no norte de Florianópolis",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Florianópolis",
      distance: "aprox. 28 km",
      travelTime: "35 a 60 min de carro, dependendo do trânsito",
    },
    transportTip:
      "Em Santo Antônio de Lisboa, carro ou transporte por app é mais prático para circular; a orla histórica é boa para caminhar depois de chegar.",
    localContext:
      "Santo Antônio de Lisboa é um bairro histórico de Florianópolis, conhecido pela herança açoriana, casario antigo, restaurantes de frutos do mar e pôr do sol na baía norte.",
    typicalFoodTip:
      "A região é ótima para ostras e frutos do mar; Ostradamus e Marisqueira Sintra são referências, e cafés locais funcionam bem para passeio no fim da tarde.",
    seasonalTips:
      "Para aproveitar o pôr do sol em Santo Antônio de Lisboa, chegue antes do horário de pico e confira reserva em restaurantes nos fins de semana.",
  },
  BNU001: {
    restaurants: [
      {
        name: "Moinho do Vale",
        distance: "aprox. 3 km",
        description: "restaurante conhecido à beira do rio Itajaí-Açu",
      },
      {
        name: "Thapyoka Restaurante",
        distance: "aprox. 4 km",
        description: "cozinha regional em área histórica de Blumenau",
      },
      {
        name: "Bier Vila",
        distance: "aprox. 1 km",
        description: "opção prática perto da Vila Germânica para comida e chope",
      },
      {
        name: "Eisenbahn Bierhaus",
        distance: "aprox. 1 km",
        description: "opção temática e cervejeira na região da Vila Germânica",
      },
    ],
    attractions: [
      {
        name: "Vila Germânica",
        distance: "aprox. 4 km",
        description: "principal ponto turístico e espaço de eventos da cidade",
      },
      {
        name: "Museu da Cerveja",
        distance: "aprox. 4 km",
        description: "parada rápida para conhecer a cultura cervejeira local",
      },
      {
        name: "Parque Ramiro Ruediger",
        distance: "aprox. 2 km",
        description: "área verde boa para caminhada perto da região da Vila Germânica",
      },
    ],
    essentials: [
      {
        name: "Angeloni Blumenau",
        distance: "aprox. 3 km",
        description: "supermercado completo para abastecer a estadia",
        type: "supermarket",
      },
      {
        name: "Panvel Centro Blumenau",
        distance: "aprox. 3 km",
        description: "farmácia em região central",
        type: "pharmacy",
      },
      {
        name: "Hospital Santa Isabel",
        distance: "aprox. 4 km",
        description: "hospital de referência na região central de Blumenau",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Navegantes",
      distance: "aprox. 55 km",
      travelTime: "50 a 75 min de carro, dependendo da BR-470 e do trânsito",
    },
    transportTip:
      "Em Blumenau, transporte por app é uma boa opção; em dias de evento na Vila Germânica, planeje deslocamento com antecedência.",
    localContext:
      "Blumenau tem forte influência da imigração alemã, é conhecida pela arquitetura enxaimel, pela cultura cervejeira e pela Oktoberfest, com a Vila Germânica como principal ponto de eventos.",
    typicalFoodTip:
      "Para uma experiência alemã ou regional em Blumenau perto da Vila Germânica, considere Bier Vila pela praticidade, Thapyoka pela cozinha regional e Moinho do Vale para uma refeição mais completa; confira rota e horários antes de sair.",
    seasonalTips:
      "Em períodos de eventos na Vila Germânica, vale sair com antecedência e reservar restaurantes.",
  },
  BCA001: {
    restaurants: [
      {
        name: "Chaplin Restaurante",
        distance: "aprox. 1 km",
        description: "clássico da orla de Balneário Camboriú",
      },
      {
        name: "Guacamole Cocina Mexicana",
        distance: "aprox. 2 km",
        description: "opção descontraída e conhecida para jantar na cidade",
      },
      {
        name: "Number Seven",
        distance: "aprox. 2 km",
        description: "restaurante conhecido para jantar na região da orla",
      },
      {
        name: "Casa da Lagosta",
        distance: "aprox. 2 km",
        description: "opção tradicional para frutos do mar na Praia Central",
      },
    ],
    attractions: [
      {
        name: "Parque Unipraias",
        distance: "aprox. 4 km",
        description: "teleférico e vista panorâmica da cidade e praias",
      },
      {
        name: "Molhe da Barra Sul",
        distance: "aprox. 3 km",
        description: "bom passeio para caminhar e ver a orla",
      },
      {
        name: "Praia Central",
        distance: "aprox. 300 m a 1 km, dependendo do ponto da orla",
        description: "principal praia urbana para caminhar e aproveitar a beira-mar",
      },
    ],
    essentials: [
      {
        name: "Angeloni Balneário Camboriú",
        distance: "aprox. 2 km",
        description: "supermercado completo e central",
        type: "supermarket",
      },
      {
        name: "Panvel Atlântica",
        distance: "aprox. 1 km",
        description: "farmácia próxima da orla",
        type: "pharmacy",
      },
      {
        name: "Hospital Unimed Litoral",
        distance: "aprox. 5 km",
        description: "hospital de referência para atendimento em Balneário Camboriú",
        type: "hospital",
      },
    ],
    airport: {
      name: "Aeroporto Internacional de Navegantes",
      distance: "aprox. 35 km",
      travelTime: "35 a 55 min de carro, dependendo do trânsito",
    },
    transportTip:
      "Em Balneário Camboriú, caminhar pela região central costuma ser prático; para Barra Sul, Unipraias e aeroporto, transporte por app é conveniente.",
    localContext:
      "Balneário Camboriú é uma cidade litorânea conhecida pela Praia Central, prédios altos, vida noturna, Barra Sul e atrações como o Parque Unipraias.",
    typicalFoodTip:
      "Na Barra Sul e região central, restaurantes de frutos do mar, cozinha internacional e opções de orla funcionam bem; Chaplin, Guacamole e Number Seven são referências próximas para jantar.",
    seasonalTips:
      "Na alta temporada, planeje deslocamentos com folga e prefira caminhar pela região central quando possível.",
  },
};

export async function POST(request: Request) {
  const body = chatRequestSchema.safeParse(await request.json());

  if (!body.success) {
    return Response.json({ error: "Invalid message." }, { status: 400 });
  }

  const property = await getPropertyByCode(body.data.propertyCode);

  if (!property) {
    return Response.json({ error: "Property not found." }, { status: 404 });
  }

  const guide = await getExperienceGuideForProperty(property.id).catch(() => null);

  const fallbackAnswer = buildFallbackAnswer(
    property,
    guide,
    getLastUserMessage(body.data.messages) ?? "",
  );

  if (!hasOpenAIKey()) {
    return streamPlainText(fallbackAnswer);
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: buildChatSystemPrompt(
      property,
      guide ?? getFallbackExperienceGuide(property.code),
    ),
    messages: body.data.messages,
  });

  return streamWithFallback(result.textStream, fallbackAnswer);
}

function getLastUserMessage(messages: z.infer<typeof chatRequestSchema>["messages"]) {
  return [...messages].reverse().find((message) => message.role === "user")
    ?.content;
}

function buildFallbackAnswer(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  guide: Awaited<ReturnType<typeof getExperienceGuideForProperty>>,
  message: string,
) {
  const normalized = normalizeMessage(message);
  const fallbackGuide = fallbackLocalGuides[property.code];

  if (normalized.includes("guide") || normalized.includes("guia")) {
    return buildLocalGuideOverview(property, guide, fallbackGuide);
  }

  if (normalized.includes("wifi") || normalized.includes("wi-fi") || normalized.includes("senha")) {
    return `The WiFi network is ${property.operational.wifi_network} and the password is ${property.operational.wifi_password}.`;
  }

  if (normalized.includes("cachorro") || normalized.includes("pet") || normalized.includes("animal")) {
    return property.rules.allow_pet
      ? "Yes, this property allows pets."
      : "Unfortunately, this property does not allow pets.";
  }

  if (normalized.includes("check-in") || normalized.includes("checkin") || normalized.includes("entrar")) {
    return `Check-in starts at ${formatHour(property.rules.check_in_time)}. ${property.operational.property_access_instructions}`;
  }

  if (isHistoryIntent(normalized)) {
    if (fallbackGuide?.localContext) {
      return `${fallbackGuide.localContext} This answer is scoped to ${property.name}, in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}.`;
    }

    return `I do not have a reliable local history summary for ${property.address.city}/${property.address.state}, but I can help with practical stay information for this property.`;
  }

  if (isTypicalFoodIntent(normalized)) {
    if (fallbackGuide?.typicalFoodTip) {
      return `${fallbackGuide.typicalFoodTip} Suggested places with map links: ${formatPlaces(fallbackGuide.restaurants, property)}.`;
    }

    return `I do not have a reliable regional-food recommendation for ${property.address.city}/${property.address.state}. I can help with nearby restaurants, markets, pharmacies, access, and house rules.`;
  }

  if (isLocationIntent(normalized)) {
    return buildLocalGuideOverview(property, guide, fallbackGuide);
  }

  if (isTransportIntent(normalized)) {
    if (fallbackGuide?.transportTip) {
      return `${fallbackGuide.transportTip} Use ${property.address.neighborhood}, ${property.address.city}/${property.address.state} as the starting point. Google Maps: ${buildMapsUrl(getPropertyLocationQuery(property))}.`;
    }

    return `For transport, use ${property.address.neighborhood}, ${property.address.city}/${property.address.state} as the reference point. Travel time can vary by traffic and time of day.`;
  }

  if (isAirportIntent(normalized)) {
    if (fallbackGuide?.airport) {
      return `The most practical airport for this property in ${property.address.neighborhood}, ${property.address.city}/${property.address.state} is ${fallbackGuide.airport.name}, about ${fallbackGuide.airport.distance} away; the trip usually takes ${fallbackGuide.airport.travelTime}. Check the route on Google Maps: ${buildMapsUrl(`${fallbackGuide.airport.name} to ${getPropertyLocationQuery(property)}`)}.`;
    }

    return `I do not have a reliable airport distance for this property. To avoid incorrect information, check the route from ${property.address.neighborhood}, ${property.address.city}/${property.address.state} on Google Maps.`;
  }

  if (isRestaurantIntent(normalized)) {
    if (guide?.restaurants.length) {
      return `For food near this property in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}, I would consider ${formatPlaces(guide.restaurants.slice(0, 3), property)}. These options make sense for the stay location; check hours and route before leaving.`;
    }

    if (fallbackGuide?.restaurants.length) {
      return `For food near this property in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}, I would consider ${formatPlaces(fallbackGuide.restaurants, property)}. These are nearby or practical options for the stay area; check hours and route before leaving.`;
    }

    return "I do not have restaurants saved for this property yet. I can help with WiFi, access, rules, and host contact.";
  }

  if (isEssentialIntent(normalized)) {
    if (guide?.essentials.length) {
      return `For essentials near this property, consider ${formatPlaces(guide.essentials.slice(0, 3), property)}.`;
    }

    if (fallbackGuide?.essentials.length) {
      return `For essentials near this property, consider ${formatPlaces(fallbackGuide.essentials, property)}.`;
    }

    return "I do not have markets or pharmacies saved for this property yet. For urgent issues, contact the host.";
  }

  if (isAttractionIntent(normalized)) {
    if (guide?.attractions.length) {
      return `Good nearby options around ${property.address.neighborhood}, ${property.address.city}/${property.address.state}: ${formatPlaces(guide.attractions.slice(0, 3), property)}.`;
    }

    if (fallbackGuide?.attractions.length) {
      return `Good nearby options around ${property.address.neighborhood}, ${property.address.city}/${property.address.state}: ${formatPlaces(fallbackGuide.attractions, property)}.`;
    }

    return "I do not have attractions saved for this property yet. I can help with WiFi, access, rules, and host contact.";
  }

  if (isSeasonalIntent(normalized)) {
    if (guide?.seasonal_tips) {
      return guide.seasonal_tips;
    }

    if (fallbackGuide?.seasonalTips) {
      return fallbackGuide.seasonalTips;
    }

    return "I do not have a seasonal tip saved for this property yet.";
  }

  if (isPublicLocalIntent(normalized)) {
    return buildLocalPublicAnswer(property, fallbackGuide);
  }

  if (normalized.includes("phone") || normalized.includes("host") || normalized.includes("contact") || normalized.includes("telefone") || normalized.includes("anfitri") || normalized.includes("contato")) {
    return `The host is ${property.host.name}. The phone number is ${property.host.phone}.`;
  }

  return "I can help with WiFi, property access, house rules, host contact, restaurants, attractions, and nearby services.";
}

function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isRestaurantIntent(message: string) {
  return ["restaurant", "food", "eat", "dinner", "lunch", "restaurante", "comer", "jantar", "almocar", "almoco", "comida"].some(
    (term) => message.includes(term),
  );
}

function isAttractionIntent(message: string) {
  return ["what to do", "attraction", "tour", "tourism", "beach", "visit", "nearby", "around", "o que fazer", "passeio", "atracao", "turismo", "praia", "visitar", "perto"].some(
    (term) => message.includes(term),
  );
}

function isEssentialIntent(message: string) {
  return ["market", "supermarket", "pharmacy", "hospital", "essential", "mercado", "supermercado", "farmacia", "hospital", "essencial"].some(
    (term) => message.includes(term),
  );
}

function isHistoryIntent(message: string) {
  return ["history", "historic", "culture", "colonization", "immigration", "historia", "historico", "cultura", "colonizacao", "imigracao", "oktoberfest"].some(
    (term) => message.includes(term),
  );
}

function isTypicalFoodIntent(message: string) {
  return ["typical", "regional food", "cuisine", "brewery", "beer", "alemao", "alema", "alemaes", "tipico", "tipica", "culinaria", "comida regional", "cervejaria", "chope"].some(
    (term) => message.includes(term),
  );
}

function isLocationIntent(message: string) {
  return [
    "onde fica",
    "where is",
    "location",
    "localizacao",
    "localização",
    "bairro",
    "regiao",
    "região",
    "o que tem perto",
    "what is nearby",
    "near the apartment",
    "near the house",
    "perto do apartamento",
    "perto da casa",
    "arredores",
  ].some((term) => message.includes(term));
}

function isTransportIntent(message: string) {
  return ["uber", "taxi", "rideshare", "transport", "bus", "car", "getting around", "táxi", "transporte", "onibus", "ônibus", "carro", "deslocamento"].some(
    (term) => message.includes(term),
  );
}

function isAirportIntent(message: string) {
  return message.includes("aeroporto") || message.includes("airport");
}

function isSeasonalIntent(message: string) {
  return ["tip", "seasonal", "season", "rain", "cold", "hot", "weather", "dica", "sazonal", "temporada", "chuva", "frio", "calor"].some(
    (term) => message.includes(term),
  );
}

function isPublicLocalIntent(message: string) {
  return [
    "historia",
    "historico",
    "cultura",
    "seguro",
    "seguranca",
    "segurança",
    "noite",
    "bar",
    "cafe",
    "cafeteria",
    "museu",
    "evento",
    "crianca",
    "criança",
    "familia",
    "família",
    "compras",
    "shopping",
    "praia",
    "parque",
    "caminhar",
    "andar",
    "visitar",
    "turismo",
  ].some((term) => message.includes(term));
}

function buildLocalPublicAnswer(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  fallbackGuide: (typeof fallbackLocalGuides)[string] | undefined,
) {
  if (!fallbackGuide) {
    return `I can help with public local questions about ${property.address.neighborhood}, ${property.address.city}/${property.address.state}, plus access, WiFi, rules, and host contact for this property.`;
  }

  return [
    fallbackGuide.localContext,
    `For food nearby: ${formatPlaces(fallbackGuide.restaurants, property)}.`,
    `For attractions or orientation: ${formatPlaces(fallbackGuide.attractions, property)}.`,
    `For transport: ${fallbackGuide.transportTip}`,
    `If the question involves hours, crowding, prices, or same-day conditions, check Google Maps or the official website before leaving.`,
  ].join(" ");
}

function formatPlaces(
  places: Array<{ name: string; distance: string; description: string }>,
  property?: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
) {
  return places
    .map((place) => {
      const mapsUrl = property
        ? ` Maps: ${buildMapsUrl(`${place.name} ${property.address.city} ${property.address.state}`)}`
        : "";

      return `${place.name} (${place.distance}), ${place.description}.${mapsUrl}`;
    })
    .join("; ");
}

function getPropertyLocationQuery(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
) {
  return `${property.address.street} ${property.address.number} ${property.address.neighborhood} ${property.address.city} ${property.address.state}`;
}

function buildMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildLocalGuideOverview(
  property: Awaited<ReturnType<typeof getPropertyByCode>> extends infer T
    ? NonNullable<T>
    : never,
  guide: Awaited<ReturnType<typeof getExperienceGuideForProperty>>,
  fallbackGuide: (typeof fallbackLocalGuides)[string] | undefined,
) {
  if (guide) {
    return [
      `This property is in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}.`,
      `For food nearby: ${formatPlaces(guide.restaurants.slice(0, 3), property)}.`,
      `For things to do: ${formatPlaces(guide.attractions.slice(0, 3), property)}.`,
      `Useful services: ${formatPlaces(guide.essentials.slice(0, 3), property)}.`,
      guide.seasonal_tips,
    ].join(" ");
  }

  if (fallbackGuide) {
    return [
      `This property is in ${property.address.neighborhood}, ${property.address.city}/${property.address.state}.`,
      `For food nearby: ${formatPlaces(fallbackGuide.restaurants, property)}.`,
      `For things to do: ${formatPlaces(fallbackGuide.attractions, property)}.`,
      `Useful services: ${formatPlaces(fallbackGuide.essentials, property)}.`,
      fallbackGuide.transportTip,
      fallbackGuide.seasonalTips,
    ].join(" ");
  }

  return "I do not have local recommendations saved for this property yet. I can help with WiFi, access, rules, and host contact.";
}

function getFallbackExperienceGuide(code: string): ExperienceGuide | null {
  const fallbackGuide = fallbackLocalGuides[code];

  if (!fallbackGuide) return null;

  return {
    welcome_message:
      "These are local recommendations to support your stay at this property.",
    restaurants: fallbackGuide.restaurants,
    attractions: fallbackGuide.attractions,
    essentials: fallbackGuide.essentials,
    seasonal_tips: fallbackGuide.seasonalTips,
  };
}

function streamPlainText(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(" ");

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(`${word} `));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function streamWithFallback(
  textStream: AsyncIterable<string>,
  fallbackText: string,
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let emittedText = false;

      try {
        for await (const chunk of textStream) {
          emittedText = true;
          controller.enqueue(encoder.encode(chunk));
        }

        if (!emittedText) {
          controller.enqueue(encoder.encode(fallbackText));
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            emittedText
              ? "\n\nI could not complete the answer right now."
              : fallbackText,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
