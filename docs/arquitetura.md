# Arquitetura

[← Índice](README.md)

## O que é este projeto

Site institucional da **Move Social**, consultoria brasileira de impacto
socioambiental. Todo o conteúdo é pt-BR — o site e o painel administrativo.

**Rotas públicas**

| Rota | Fonte do conteúdo |
| --- | --- |
| `/` | global `home` + collections `services`, `partners`, `publications`, `team-members` |
| `/teoria-da-mudanca` | global `theory-of-change` + collection `services` |
| `/publicacoes` | global `publications-page` + collection `publications` |
| `/publicacoes/[slug]` | collection `publications` |
| `/portfolio` | global `portfolio-page` + collection `projects` |
| `/portfolio/[slug]` | collection `projects` |
| `/contato` | global `contact-page` + global `site-settings` |
| `/admin` | painel do Payload |
| `/api/*` | REST + GraphQL do Payload (gerado, não editar) |

## Stack

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.2.9 |
| UI | React | 19.2 |
| CMS | Payload | 3.88.0 |
| Banco | MongoDB (Atlas) via `@payloadcms/db-mongodb` | — |
| Uploads | Vercel Blob (store público) | — |
| Estilo | Tailwind CSS | 3.4 |
| Editor rich text | Lexical (`@payloadcms/richtext-lexical`) | 3.88.0 |
| SEO | `@payloadcms/plugin-seo` | 3.88.0 |
| Animação | GSAP + ScrollTrigger, Lenis, Framer Motion | — |
| Imagens | `sharp` | 0.34.2 |
| Hospedagem | Vercel | — |

## A regra central

> **Conteúdo mora no Payload. Componentes são apresentacionais. `lib/content.ts`
> é a única ponte entre os dois.**

Isso tem três consequências práticas que valem para qualquer alteração:

1. **Pedido de mudança de texto, número, imagem ou ordem = edição no `/admin`.**
   Não abra o editor de código. Se o campo não existir ainda, aí sim é código:
   você cria o campo, e a Move preenche.
2. **Nenhum componente importa `payload`, `@/lib/content` ou `payload-types`
   para buscar dados.** Componentes recebem props. Isso é o que permite trocar a
   origem do conteúdo sem reescrever a interface — foi exatamente o que aconteceu
   quando o conteúdo saiu de `data/site.ts` e foi para o CMS: `lib/content.ts`
   passou a devolver as mesmas formas, e nenhum componente precisou mudar.
3. **`data/site.ts` e `data/images.ts` não são mais lidos pelo site.** Sobrevivem
   só como entrada do `scripts/seed.ts`. Não adicione conteúdo novo ali.

## Fluxo de dados

```
MongoDB Atlas
     │
     │  payload.find() / payload.findGlobal()
     ▼
lib/content.ts ──── resolveImage() ──── lib/resolveImage.ts
     │              (upload > URL externa)
     │  React cache() — dedupe por request
     │  filtro _status: 'published'
     │  devolve objetos planos: { title, image: {src, alt}, ... }
     ▼
app/(frontend)/**/page.tsx        (Server Component, revalidate = 60)
     │
     │  props simples
     ▼
components/*.tsx                  (apresentacional; "use client" só quando precisa)
```

O caminho inverso — quem escreve — é:

```
/admin  →  Payload  →  MongoDB (documento)
                    →  Vercel Blob (arquivo do upload)
```

## Mapa de pastas

```
app/
  (frontend)/          Site público. Layout, globals.css e as páginas.
    layout.tsx         Fontes, SmoothScroll, Header, Footer. Lê site-settings.
    globals.css        Reset, .editorial-container, .editorial-prose, reduced motion
    page.tsx           Home
    portfolio/         Listagem + [slug]
    publicacoes/       Listagem + [slug]
    teoria-da-mudanca/
    contato/
  (payload)/           GERADO PELO PAYLOAD — não editar à mão
    admin/             Painel; importMap.js é regenerado por comando
    api/               REST, GraphQL e GraphQL playground
    custom.scss        Único ponto de customização visual do admin

collections/           Um arquivo por collection (Projects, Publications, …)
globals/               Um arquivo por global (Home, ContactPage, …)
fields/                Helpers de campo reutilizáveis (imageField, toneField, iconField)
access/                Funções de controle de acesso compartilhadas

lib/
  payload.ts           getPayloadClient() — instância do Payload
  content.ts           ⭐ camada de leitura do CMS (a única)
  resolveImage.ts      upload vs URL externa; displayNumber()
  seo.ts               metadataFromSeo() — grupo meta do CMS → Metadata do Next
  palette.ts           SURFACES: tabela de contraste da marca em código
  taxonomy.ts          ECOSYSTEMS e SEGMENTS (listas fechadas)
  filterIcons.ts       grafismo de cada ecossistema/filtro
  utils.ts             cn()

components/            Apresentacionais. Sem acesso a dados.
  ui/                  Primitivos (shadcn)

data/                  ⚠️ legado — só alimenta o seed, não é lido pelo site
scripts/               seed.ts, seed-theory.ts, migrate-media-to-blob.ts
docs/                  Esta documentação
public/brand/icons/    SVGs dos grafismos usados pelo iconField
media/                 gitignored; sobras da carga inicial (produção usa o Blob)

payload.config.ts      Registro de collections, globals, plugins, banco, i18n
payload-types.ts       GERADO — tipos de todos os documentos
next.config.ts         withPayload(), remotePatterns de imagem, turbopack root
tailwind.config.ts     Tokens da marca no namespace `move`
```

## `payload.config.ts` — o registro central

Tudo que existe no CMS precisa estar listado aqui. Os pontos que importam:

```ts
collections: [Projects, Services, Publications, PublicationCategories,
              TeamMembers, Partners, Media, Users],
globals: [Home, TheoryOfChange, PublicationsPage, PortfolioPage,
          ContactPage, SiteSettings],
editor: lexicalEditor(),
db: mongooseAdapter({ url: process.env.DATABASE_URL || "" }),
typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
i18n: { supportedLanguages: { pt }, fallbackLanguage: "pt" },
plugins: [ seoPlugin({...}), vercelBlobStorage({...}) ],
```

- **`i18n` em pt** — o painel inteiro em português, porque todo o conteúdo é
  pt-BR. Isso é a *interface* do admin, não localização de conteúdo (o projeto
  não usa campos `localized`).
- **`sharp: sharp as unknown as SharpDependency`** — o `.d.ts` do Payload carrega
  uma cópia própria dos tipos do sharp que não bate com o sharp 0.34 instalado.
  É divergência só de tipagem; em runtime é a função certa. Não "conserte".
- **`seoPlugin`** com `tabbedUI: true` adiciona uma aba **SEO** às collections
  `projects` e `publications` e aos globals de página. Os geradores de título e
  descrição definidos no topo do arquivo só rodam quando alguém clica em "gerar" —
  texto escrito à mão sempre vence.
- **`vercelBlobStorage`** redireciona os uploads da collection `media` para o
  Blob. Ver [Infra](infra.md#vercel-blob) — este é o ponto que mais causou
  problema no projeto.

## Convenções do repositório

- **Alias `@/`** aponta para a raiz. `@payload-config` aponta para
  `payload.config.ts`. Ambos em `tsconfig.json`.
- **Slugs de collection/global em kebab-case** (`publication-categories`,
  `theory-of-change`) — viram nome de coleção no Mongo e caminho na API.
- **Nomes de campo em inglês, labels em português.** O campo é `client`, o label
  é "Cliente". Isso mantém o código legível e o admin em pt-BR.
- **Comentários explicam o *porquê*, não o *o quê*.** O código do repositório
  segue esse padrão de forma consistente; mantenha-o ao adicionar algo.
- **Ordenação manual via campo `order`** (`number`, `defaultValue: 0`,
  `position: "sidebar"`) + `defaultSort: "order"` na collection.
- **Numeração visível (`01`, `02`…) é derivada da posição** com `displayNumber()`.
  Nunca crie um campo numérico manual para isso: nada o manteria em sincronia.

## Fronteira servidor / cliente

Páginas são **Server Components** e fazem todo o acesso a dados. Componentes
marcados `"use client"` recebem os dados já prontos.

O caso mais instrutivo é `/portfolio`: a página é servidor, busca **todos** os
projetos e entrega um array simples ao `PortfolioBrowser`, que filtra em memória.
A página resolve `?cliente=` no servidor para entregar os cards corretos no HTML
inicial. Os dados públicos usam cache persistente de 60 segundos. Os demais filtros
continuam em memória e respondem sem ida ao servidor.
Reavaliar se o acervo passar de alguns milhares.

Um componente cliente **não pode** importar de `collections/` ou `lib/content.ts`
— isso arrastaria o Payload inteiro para o bundle do navegador. É por isso que
`ECOSYSTEMS` e `SEGMENTS` moram em `lib/taxonomy.ts`: as duas pontas precisam
deles.

## Próximos documentos

- Criar conteúdo novo no CMS → [Collections](payload-collections.md) e [Globals](payload-globals.md)
- Expor esse conteúdo no site → [Camada de conteúdo](camada-de-conteudo.md) e [Páginas e rotas](paginas-e-rotas.md)
- Tarefa completa, do campo ao pixel → [Receitas](receitas.md)
