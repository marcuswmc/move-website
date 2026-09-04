# Collections

[← Índice](README.md)

Uma collection é um tipo de documento que a Move cria quantas vezes quiser:
projetos, publicações, pessoas, parceiros. Se o conteúdo é **único na página**
(hero da home, dados de contato), não é collection — é [global](payload-globals.md).

## Collections existentes

| Slug | Arquivo | Drafts | O que é |
| --- | --- | --- | --- |
| `projects` | [Projects.ts](../collections/Projects.ts) | ✅ | Casos do portfólio. Card em `/portfolio` + página própria |
| `services` | [Services.ts](../collections/Services.ts) | ✅ | Cards de "O que entregamos" |
| `publications` | [Publications.ts](../collections/Publications.ts) | ✅ | Acervo de `/publicacoes` |
| `publication-categories` | [PublicationCategories.ts](../collections/PublicationCategories.ts) | ❌ | Rótulos de filtro das publicações |
| `team-members` | [TeamMembers.ts](../collections/TeamMembers.ts) | ✅ | Equipe e conselho |
| `partners` | [Partners.ts](../collections/Partners.ts) | ✅ | Logos de clientes e parceiros |
| `media` | [Media.ts](../collections/Media.ts) | ❌ | Uploads (imagens e documentos) |
| `users` | [Users.ts](../collections/Users.ts) | ❌ | Acesso ao admin |

## Anatomia de uma collection

```ts
import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";

export const Recognitions: CollectionConfig = {
  // 1. Identidade
  slug: "recognitions",                                  // kebab-case; vira coleção no Mongo e rota na API
  labels: { singular: "Reconhecimento", plural: "Reconhecimentos" },

  // 2. Como aparece no painel
  admin: {
    useAsTitle: "title",                                 // o que a lista mostra como nome do documento
    defaultColumns: ["title", "year", "_status"],
    listSearchableFields: ["title", "summary"],
    group: "Conteúdo",                                   // "Conteúdo" | "Páginas" | "Configurações"
    description: "Aparece no bloco de reconhecimentos da home.",
  },

  // 3. Quem pode o quê
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  // 4. Rascunho e publicação
  versions: { drafts: true, maxPerDoc: 20 },

  // 5. Ordenação padrão da listagem
  defaultSort: "order",

  // 6. Campos
  fields: [
    { name: "title", type: "text", label: "Título", required: true, index: true },
    slugField({ useAsSlug: "title" }),
    imageField({ required: true }),
    {
      name: "order",
      type: "number",
      label: "Ordem",
      required: true,
      defaultValue: 0,
      admin: { position: "sidebar", description: "Menor número aparece primeiro." },
    },
  ],
};
```

### `admin`

- **`useAsTitle`** — sem isso a listagem mostra o ID do Mongo, o que torna o
  painel inutilizável. Sempre defina.
- **`group`** — o projeto usa três grupos, e a escolha muda onde a Move procura o
  item na barra lateral:
  - `"Conteúdo"` → o que ela cria e edita rotineiramente
  - `"Páginas"` → globals de copy de uma página específica
  - `"Configurações"` → mídia, usuários, ajustes do site
- **`description`** — a frase que explica **onde no site** aquilo aparece. Todas
  as collections do projeto têm uma; é o que evita a pergunta "onde isso vai sair?".
- **`listSearchableFields`** — habilita a busca da listagem nesses campos. Vale
  em qualquer collection que passe de umas poucas dezenas de documentos.

### `access`

As funções ficam em [`access/index.ts`](../access/index.ts) e são três:

```ts
anyone                   // leitura pública
authenticated            // exige usuário logado no admin
publishedOrAuthenticated // anônimo vê só _status: 'published'; logado vê tudo
```

O padrão do projeto:

| Situação | `read` |
| --- | --- |
| Collection com `versions.drafts: true` | `publishedOrAuthenticated` |
| Collection sem drafts (media, categorias) | `anyone` |
| `users` | `authenticated` |

`create`, `update` e `delete` são sempre `authenticated`. A exceção é `users`,
cujo `create` é `anyone` — mas só até existir o primeiro usuário; depois disso o
próprio Payload bloqueia `/admin/create-first-user`.

Access control aceita retornar `true`, `false` ou uma **query de filtro** — é o
que `publishedOrAuthenticated` faz:

```ts
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};
```

### `versions` e drafts

`versions: { drafts: true, maxPerDoc: 20 }` habilita o botão **Salvar rascunho /
Publicar** e guarda as 20 últimas versões do documento. Consequências:

- Cada documento ganha um campo automático `_status` (`draft` | `published`).
- **Toda leitura pública precisa filtrar por `_status: 'published'`.** A camada
  de conteúdo faz isso com a constante `PUBLISHED` — ver
  [Camada de conteúdo](camada-de-conteudo.md).
- Um documento novo nasce como rascunho e **não aparece no site** até ser
  publicado. É intencional; é o mecanismo que permite à Move escrever com calma.

Globals usam a forma reduzida `versions: { max: 20 }` (histórico, sem rascunho).

### `slugField`

Vem do próprio Payload (`import { slugField } from "payload"`). Gera uma `row` na
sidebar com um campo `slug` texto, único e indexado, mais um checkbox oculto
`generateSlug` que o preenche a partir de outro campo:

```ts
slugField()                        // gera a partir de `title` (padrão)
slugField({ useAsSlug: "client" }) // gera a partir de `client` — usado em Projects
slugField({ useAsSlug: "name" })   // usado em Partners e PublicationCategories
```

O slug **estabiliza** depois de criado: o Payload para de regerá-lo se o usuário
o editou à mão, e não o reescreve num documento já publicado. Isso protege URLs
que já estão no ar.

> A API é marcada como `@experimental` pelo Payload. Ao subir de versão maior,
> confira o comportamento antes de assumir que continua idêntico.

### `defaultSort`

`defaultSort: "order"` (crescente) ou `"-publishedAt"` (o `-` inverte). É a ordem
da listagem no admin **e** o padrão de `payload.find()` quando não se passa
`sort` — mas a camada de conteúdo passa `sort` explicitamente de qualquer forma,
para o comportamento não depender de configuração distante.

## Relacionamentos

### `relationship` — o lado que escreve

```ts
{
  name: "partner",
  type: "relationship",
  relationTo: "partners",
  label: "Cliente (logo)",
  index: true,
  admin: { description: "Opcional. Quando preenchido, o logo aparece no card." },
}
```

Com `hasMany: true` vira lista (é o caso de `categories` em `publications`).

**Onde colocar o campo** é decisão de arquitetura, não de gosto. A relação
Cliente ↔ Projeto mora em `Projects`, e não em `Partners`, porque é durante a
publicação do projeto que se sabe de quem ele é — e assim um mesmo cliente
acumula vários projetos sem ninguém manter duas listas em sincronia.

### `join` — o lado que só lê

```ts
{
  name: "projects",
  type: "join",
  collection: "projects",
  on: "partner",              // nome do campo relationship no outro lado
  label: "Projetos no portfólio",
  admin: { allowCreate: false, defaultColumns: ["client", "ecosystem", "year"] },
}
```

Mostra, dentro do parceiro, os projetos que apontam para ele. Não é armazenado —
é uma consulta. Use `join` sempre que quiser exibir o lado inverso: assim não
existem dois lugares onde a mesma ligação pode ser escrita e discordar.

### Profundidade (`depth`) na leitura

Um `relationship` chega como **ID** ou como **documento populado**, dependendo do
`depth` da consulta. O código lida com isso defensivamente:

```ts
const partner = typeof project.partner === "object" ? project.partner : null;
```

- `depth: 0` → só IDs. Mais rápido; use quando não precisar do relacionado
  (ex.: `getProjectSlugs`).
- `depth: 1` (padrão) → popula um nível. É o que o card do projeto precisa para
  ter o logo do parceiro.

## Campos de upload

```ts
{ name: "file", type: "upload", relationTo: "media", label: "Arquivo" }
```

Aponta sempre para a collection `media`. A `media` já aceita imagens, PDF, Word,
Excel, PowerPoint, CSV, TXT e ZIP, e gera três tamanhos para imagens
(`thumbnail` 480×640, `card` 900, `hero` 1800). Para imagens **de conteúdo**,
prefira o helper `imageField()` — ver [Campos](payload-campos.md).

## Campos condicionais

```ts
{
  name: "externalUrl",
  type: "text",
  label: "URL externa",
  admin: {
    description: "Para onde o botão da página leva.",
    condition: (data) => data?.type === "external",
  },
}
```

`condition` recebe `(data, siblingData)`: `data` é o documento inteiro,
`siblingData` é o objeto do mesmo nível (dentro de um `group` ou `array`).
`Publications` usa isso para que o campo **Tipo** decida quais campos aparecem —
quem publica um link externo nunca vê o campo de upload de arquivo.

## Registrar a collection

Duas alterações em [`payload.config.ts`](../payload.config.ts):

```ts
import { Recognitions } from "@/collections/Recognitions";
// ...
collections: [Projects, Services, /* … */, Recognitions],
```

Se a collection também deve ter aba de SEO, acrescente o slug ao plugin:

```ts
seoPlugin({ collections: ["projects", "publications", "recognitions"], /* … */ })
```

Depois:

```bash
pnpm generate:types
```

Isso reescreve `payload-types.ts` e é o que faz o TypeScript enxergar
`payload.find({ collection: "recognitions" })`. **Sem esse passo, o resto não
compila.**

O MongoDB não exige migração: a coleção nasce quando o primeiro documento é
gravado.

## Hooks (ainda não usados neste projeto)

Nenhuma collection usa hooks hoje. Quando precisar, o formato é:

```ts
hooks: {
  beforeChange: [({ data }) => ({ ...data, /* … */ })],
  afterChange: [async ({ doc, operation }) => { /* … */ }],
}
```

Casos legítimos aqui seriam derivar um campo de outro na gravação ou disparar
revalidação sob demanda. **Não** use hook para o que a camada de leitura já
resolve: formatação de data, fallback de texto e escolha de imagem acontecem em
`lib/content.ts`, onde são fáceis de mudar sem tocar nos dados gravados.

## Checklist

- [ ] `slug` em kebab-case, `labels` no singular e plural em português
- [ ] `admin.useAsTitle`, `group` e `description` preenchidos
- [ ] `access` seguindo o padrão da tabela acima
- [ ] `versions: { drafts: true }` se for conteúdo editorial
- [ ] Campo `order` + `defaultSort` se a ordem na página importa
- [ ] `index: true` nos campos usados em filtro, busca ou ordenação
- [ ] Registrada em `payload.config.ts` (e no `seoPlugin`, se tiver página própria)
- [ ] `pnpm generate:types` rodado
- [ ] Função de leitura adicionada em `lib/content.ts`
