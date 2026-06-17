# Seazone Guest Guide

Guia Digital do Hóspede personalizado por imóvel, criado para o teste técnico AI Builder da Seazone.

A aplicação resolve o fluxo principal descrito no desafio: o hóspede que reservou um imóvel acessa o link único daquele imóvel, consulta as informações da estadia que antes seriam impressas pelo anfitrião, recebe recomendações locais geradas por IA e tira dúvidas em um chat contextualizado.

## URL pública

Produção: https://seazone.vercel.app

Fluxo de avaliação:

- Acesse https://seazone.vercel.app
- Digite o código do imóvel: `FLN001`, `CMP001`, `BNU001`, `BCA001` ou `GRM001`
- O hóspede acessa o Guia Digital personalizado daquele imóvel
- O César fica disponível no guia para responder dúvidas contextualizadas

Links equivalentes a um QR Code no imóvel:

- https://seazone.vercel.app/FLN001
- https://seazone.vercel.app/CMP001
- https://seazone.vercel.app/BNU001
- https://seazone.vercel.app/BCA001
- https://seazone.vercel.app/GRM001

Rotas de compatibilidade para o guia:

- https://seazone.vercel.app/FLN001/guia
- https://seazone.vercel.app/CMP001/guia
- https://seazone.vercel.app/BNU001/guia
- https://seazone.vercel.app/BCA001/guia
- https://seazone.vercel.app/GRM001/guia

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- OpenAI via Vercel AI SDK
- Zod
- Vitest

## Funcionalidades

- Home com entrada de código do imóvel
- QR Code ou link do imóvel abre o guia personalizado daquela estadia
- Guia completo personalizado em `/FLN001` e `/GRM001`
- Rotas compatíveis do guia em `/FLN001/guia` e `/GRM001/guia`
- Dados do imóvel, fotos, capacidade, amenidades e endereço
- Informações de acesso, WiFi, estacionamento e contato do anfitrião
- Regras da estadia com check-in, check-out, pets, fumantes, crianças e eventos
- Página amigável para código de imóvel inexistente
- Guia de experiências gerado por IA com restaurantes, atrações, serviços essenciais e dica sazonal
- Persistência do guia gerado para evitar nova geração a cada acesso
- Feedback visual durante a geração do guia
- Assistente virtual com streaming de resposta
- Chat contextualizado com dados do imóvel e guia de experiências
- Testes de validação, formatação e construção de prompt

## Escopo do produto

Este projeto não é uma plataforma de reservas, busca de imóveis ou clone do Airbnb. O foco é o Guia Digital do Hóspede: uma página operacional para quem já reservou uma propriedade específica e precisa das informações práticas da estadia.

O que está dentro do escopo:

- Informações do imóvel reservado
- Instruções de acesso
- WiFi
- Regras da estadia
- Contato do anfitrião
- Guia de experiências contextualizado por IA
- Assistente virtual que conhece aquele imóvel
- Assistente virtual César disponível dentro do guia do imóvel

O que ficou fora do escopo por não estar no documento:

- Login
- Admin
- Busca de imóveis
- Reserva ou pagamento
- Calendário de disponibilidade
- Avaliações
- Mapa interativo

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base em `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/seazone_guest_guide"
OPENAI_API_KEY="sua-chave"
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Rode as migrations:

```bash
npm run prisma:migrate
```

Popule o banco com os imóveis do desafio:

```bash
npm run db:seed
```

Inicie o projeto:

```bash
npm run dev
```

Acesse a home e informe um dos códigos de avaliação:

- `http://localhost:3000`
- `FLN001`
- `CMP001`
- `BNU001`
- `BCA001`
- `GRM001`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run db:seed
```

## Arquitetura

```txt
src/app
  Home com entrada de código do imóvel

src/app/[code]
  Guia Digital personalizado do imóvel, acessado pelo link único do código

src/app/[code]/guia
  Rota compatível para o mesmo guia completo da estadia

src/app/api/properties/[code]/experience-guide
  Geração e persistência do guia de experiências

src/app/api/chat
  Assistente virtual com streaming

src/components
  Componentes de UI, guia, experiência e chat

src/lib
  Validações, formatação, Prisma e prompts de IA

src/server
  Funções server-side de leitura de imóveis e guias

prisma
  Schema e seed do banco
```

O schema usa uma tabela `Property` para o imóvel e uma tabela `ExperienceGuide` com `propertyId` único. Isso garante que cada imóvel tenha no máximo um guia de experiências persistido.

Campos aninhados como `address`, `rules`, `operational`, `amenities` e `host` são armazenados como `Json` no Postgres. A segurança de tipo é mantida com Zod e TypeScript. Essa decisão reduz complexidade sem prejudicar o escopo do desafio, que não pede CRUD administrativo de imóveis.

## IA

A geração do guia usa `generateObject` com schema Zod. O prompt inclui:

- Código, nome e tipo do imóvel
- Endereço completo
- Bairro, cidade e estado
- Data atual
- Regra para priorizar endereço real sobre nome do imóvel
- Regra para retornar recomendações em português brasileiro
- Regra para não inventar dados operacionais, regras, senhas, valores ou contatos

O guia só é gerado quando ainda não existe conteúdo persistido. Depois de salvo, acessos seguintes retornam o conteúdo do banco.

O chat usa `streamText` e recebe um system prompt com:

- Dados operacionais do imóvel
- Regras da estadia
- Contato do anfitrião
- Guia de experiências persistido
- Instrução explícita para não inventar informações ausentes

## Tratamento de falhas

- Código de imóvel inexistente mostra uma tela amigável.
- Se a IA falhar, o guia exibe erro e botão de retry.
- Se `OPENAI_API_KEY` não estiver configurada, a geração do Guia de Experiências retorna erro explícito e o chat usa respostas contextuais de fallback.
- O imóvel continua útil mesmo sem o guia de experiências, pois dados de acesso, WiFi, regras e contato são renderizados separadamente.

## Segurança e produto

O documento pede links por código do imóvel, como `/FLN001`. Nesta versão, esse link abre diretamente o Guia Digital do Hóspede daquele imóvel, com informações de acesso, WiFi, regras, contato, Guia de Experiências gerado por IA e chat contextual do César disponível na própria página.

A aplicação também define `robots: noindex` para evitar indexação dos guias públicos.

## Testes

```bash
npm run test
```

Cobertura principal:

- Validação do schema do guia gerado por IA
- Rejeição de guia incompleto
- Formatação de horário, regras, endereço e amenidades
- Construção do prompt do chat com dados críticos do imóvel

## Deploy

Recomendado:

- Vercel para a aplicação
- Neon ou Supabase para PostgreSQL

Variáveis necessárias no ambiente de produção:

```bash
DATABASE_URL="..."
OPENAI_API_KEY="..."
```

Após configurar o banco em produção:

```bash
npm run prisma:deploy
npm run db:seed
```
