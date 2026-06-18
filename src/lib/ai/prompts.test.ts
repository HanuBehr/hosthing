import { describe, expect, it } from "vitest";

import { buildChatSystemPrompt, buildExperienceGuidePrompt } from "@/lib/ai/prompts";
import { experienceGuideFixture, propertyFixture } from "@/test/fixtures";

describe("buildChatSystemPrompt", () => {
  it("includes the critical property facts required by the chat", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("SeaHome_FLN001");
    expect(prompt).toContain("floripa2024");
    expect(prompt).toContain("Check-in: 15:00");
    expect(prompt).toContain("Pets: Nao permitido");
    expect(prompt).toContain("Restaurante Meu Cantinho");
  });

  it("instructs the assistant not to invent missing information", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, null);

    expect(prompt).toContain("Se faltar dado operacional do imovel");
    expect(prompt).toContain("Nunca invente");
    expect(prompt).toContain("Ainda nao ha guia de experiencias");
  });

  it("allows public local knowledge without redirecting to the host", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("informacoes publicas locais sobre a cidade");
    expect(prompt).toContain("historia, cultura, culinaria");
    expect(prompt).toContain("Nao mande o hospede falar com o anfitriao para perguntas publicas");
  });

  it("locks recommendations to the current property location", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("ESCOPO OBRIGATORIO DA PAGINA ATUAL");
    expect(prompt).toContain("Esta conversa pertence exclusivamente ao imovel FLN001");
    expect(prompt).toContain("Trindade, Florianópolis/SC");
    expect(prompt).toContain("Nunca responda como se o hospede estivesse em outro codigo, bairro, cidade ou estado");
    expect(prompt).toContain("ignore essa informacao");
  });

  it("asks for complete local answers with maps context", () => {
    const prompt = buildChatSystemPrompt(propertyFixture, experienceGuideFixture);

    expect(prompt).toContain("recomende pelo menos 3 opcoes");
    expect(prompt).toContain("nao prometa ranking absoluto");
    expect(prompt).toContain("inclua obrigatoriamente");
    expect(prompt).toContain("Google Maps");
    expect(prompt).toContain("perguntas sobre aeroporto, distancia, deslocamento ou tempo de trajeto");
    expect(prompt).toContain("a partir do endereco do imovel atual");
    expect(prompt).toContain("perguntas pequenas e praticas do hospede sobre o imovel atual");
    expect(prompt).toContain("transporte por app/taxi");
  });
});

describe("buildExperienceGuidePrompt", () => {
  it("requires recommendations near the exact property address", () => {
    const prompt = buildExperienceGuidePrompt(propertyFixture);

    expect(prompt).toContain("O imovel atual e somente este: FLN001");
    expect(prompt).toContain("Rua Lauro Linhares, 589");
    expect(prompt).toContain("Nao recomende lugares de outra cidade");
    expect(prompt).toContain("a partir do endereco do imovel atual");
  });
});
