# Globals

[← Índice](README.md)

Um global é um documento **único**: existe uma Home, um conjunto de dados de
contato, uma Teoria da Mudança. Se a Move precisa criar vários daquilo, é
[collection](payload-collections.md).

## Globals existentes

| Slug | Arquivo | Grupo no admin | O que guarda |
| --- | --- | --- | --- |
| `home` | [Home.ts](../globals/Home.ts) | Páginas | Hero, selos, cards empilhados de destaque |
| `theory-of-change` | [TheoryOfChange.ts](../globals/TheoryOfChange.ts) | Páginas | Toda a copy de `/teoria-da-mudanca` |
| `publications-page` | [PublicationsPage.ts](../globals/PublicationsPage.ts) | Páginas | Abertura de `/publicacoes` |
| `portfolio-page` | [PortfolioPage.ts](../globals/PortfolioPage.ts) | Páginas | Abertura de `/portfolio` |
| `contact-page` | [ContactPage.ts](../globals/ContactPage.ts) | Páginas | Copy de `/contato` |
| `site-settings` | [SiteSettings.ts](../globals/SiteSettings.ts) | Configurações | Menu, contato, redes, números |

## Anatomia

```ts
import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "@/access";

export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  label: "Página de Portfólio",
  admin: {
    group: "Páginas",
    description: "Abertura da listagem de projetos.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    { name: "eyebrow", type: "text", label: "Chapéu", required: true, defaultValue: "Portfólio" },
    { name: "title", type: "textarea", label: "Título", required: true },
    { name: "description", type: "textarea", label: "Texto de apoio" },
  ],
};
```

Diferenças em relação a uma collection:

- `label` no singular (não há plural).
- `access` tem só **`read`** e **`update`** — não se cria nem se apaga um global.
  O padrão é `{ read: anyone, update: authenticated }`.
- `versions: { max: 20 }` — histórico de versões, **sem** o fluxo de
  rascunho/publicação. Globals não têm `_status`; o que está salvo está no ar.
- Sem `defaultSort`, sem `useAsTitle`.

## Por que existem globals "de página"

`PortfolioPage` e `PublicationsPage` guardam só três campos de texto. Existem
porque o cabeçalho da listagem precisa ser editável como o de qualquer outra
página — e porque o `seoPlugin` injeta a aba de SEO em globals, o que dá à Move
controle sobre o título e a descrição de busca dessas rotas. A **listagem** em si
continua vindo da collection.

Esse é o padrão: **global = a copy da página; collection = os itens da página.**

## Estrutura interna

Globals grandes ganham `tabs` para não virar um formulário de rolagem infinita.
`Home` separa "Hero" de "Destaques":

```ts
fields: [
  {
    type: "tabs",
    tabs: [
      {
        label: "Hero",
        fields: [
          {
            name: "hero",
            type: "group",
            label: false,                     // o título da aba já nomeia o bloco
            fields: [
              { name: "eyebrow", type: "text", label: "Chapéu", required: true },
              { name: "title", type: "textarea", label: "Título", required: true },
              { name: "body", type: "richText", label: "Texto de apoio", required: true,
                // editor restrito a parágrafo + negrito/itálico (ver globals/Home.ts)
              },
            ],
          },
          {
            name: "affiliations",
            type: "array",
            label: "Selos e afiliações",
            fields: [{ name: "label", type: "text", label: "Nome", required: true }],
          },
        ],
      },
      { label: "Destaques", fields: [ /* … */ ] },
    ],
  },
],
```

Repare em `label: false` no group: a aba já diz "Hero", repetir seria ruído.

### Arrays em globals

`home.showcase` é o caso mais rico do projeto — uma lista de cards com imagem,
tom e relacionamento:

```ts
{
  name: "showcase",
  type: "array",
  label: "Cards de destaque",
  maxRows: 6,
  admin: {
    description: "Os cards empilhados da home. A numeração 01, 02… é gerada a partir da ordem desta lista.",
  },
  fields: [
    { type: "row", fields: [
      { name: "client", type: "text", label: "Cliente", required: true },
      { name: "category", type: "text", label: "Categoria", required: true },
    ]},
    { name: "title", type: "textarea", label: "Título", required: true },
    { name: "description", type: "textarea", label: "Descrição", required: true },
    imageField({ required: true }),
    showcaseToneField(),
    { name: "relatedProject", type: "relationship", relationTo: "projects", label: "Projeto relacionado" },
  ],
}
```

A ordem do array é a ordem na tela, e a numeração vem da posição via
`displayNumber(index)`. Nunca crie um campo "número" ao lado: nada o manteria em
sincronia quando a Move arrastasse um card.

## `site-settings` — o global transversal

Guarda o que aparece em mais de uma página: menu de navegação, contato, redes
sociais e números. Vale reparar em duas decisões:

**O menu alimenta header e rodapé ao mesmo tempo**, na mesma ordem — um lugar só
para editar.

**Rede social vazia não vira link quebrado.** O global tem os campos crus, e a
camada de leitura monta a lista só com o que foi preenchido:

```ts
social: [
  { name: "Instagram" as const, href: settings.social?.instagram },
  { name: "LinkedIn" as const, href: settings.social?.linkedin },
].filter((item) => Boolean(item.href?.trim())),
```

O componente só itera. Sem link cadastrado, não existe item — logo, nunca há
ícone apontando para lugar nenhum. É o padrão a seguir para qualquer campo
opcional: **resolver a ausência na camada de leitura, não no JSX.**

## Criar um global novo

1. Arquivo em `globals/`, seguindo a anatomia acima.
2. Registrar em [`payload.config.ts`](../payload.config.ts):

```ts
import { AboutPage } from "@/globals/AboutPage";
// ...
globals: [Home, TheoryOfChange, PublicationsPage, PortfolioPage,
          ContactPage, SiteSettings, AboutPage],
```

3. Se a página tiver rota própria, acrescente o slug ao `seoPlugin`:

```ts
seoPlugin({ globals: ["home", "theory-of-change", /* … */, "about-page"], /* … */ })
```

4. `pnpm generate:types`
5. Função de leitura em `lib/content.ts`:

```ts
export const getAboutPage = cache(async () => {
  const payload = await getPayloadClient();
  const page = await payload.findGlobal({ slug: "about-page" });
  return { meta: page.meta, title: page.title, /* … */ };
});
```

6. Abrir `/admin`, preencher os campos obrigatórios e **salvar uma vez**. Um
   global nunca salvo devolve um objeto praticamente vazio; campos `required`
   não protegem contra isso na leitura, então trate os opcionais com `??`.

## Global ou collection?

| Pergunta | Global | Collection |
| --- | --- | --- |
| A Move vai criar vários? | não | sim |
| Tem URL própria por item? | não | provavelmente |
| Precisa de rascunho antes de publicar? | não (só histórico) | sim |
| É a copy de uma página específica? | sim | não |

Na dúvida, comece como global: promover a collection depois é mais fácil do que
descobrir que existem 6 documentos onde deveria haver 1.
