# Receitas

[← Índice](README.md)

Passo a passo completo das tarefas mais comuns. Cada receita vai do CMS ao pixel.

---

## 1. "Muda esse texto / esse número / essa foto"

**Não é código.** Abra `/admin` e edite. Vale para copy, estatísticas, imagens,
ordem dos itens, links do menu, dados de contato, redes sociais.

A mudança aparece no site em até 60 segundos (`revalidate = 60`), sem deploy.

Se o campo não existir ainda, aí é código — vá para a receita 2 ou 3.

---

## 2. Adicionar um campo a algo que já existe

Exemplo: um campo "Duração" nos projetos.

**1. Declare o campo** em `collections/Projects.ts`, na aba certa:

```ts
{
  name: "duration",
  type: "text",
  label: "Duração",
  admin: { description: 'Ex.: "8 meses". Vazio não exibe a linha na ficha do projeto.' },
}
```

**2. Regenere os tipos**

```bash
pnpm generate:types
```

**3. Inclua no retorno** da função de leitura em `lib/content.ts`:

```ts
return {
  ...toProjectCard(project),
  duration: project.duration ?? null,     // decida o fallback aqui
  // …
};
```

Se outros componentes consomem o tipo exportado, atualize `type ProjectCard`.

**4. Renderize** — como o campo é opcional, o JSX só precisa de uma guarda:

```tsx
const facts = [
  { label: "Ecossistema", value: project.ecosystem },
  { label: "Duração", value: project.duration },
  // …
].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));
```

**5. Preencha no admin** e confira em `/portfolio/[slug]`.

---

## 3. Criar uma collection nova, do zero ao ar

Exemplo: **Reconhecimentos** — prêmios e certificações, com listagem na home.

### 3.1 Collection

`collections/Recognitions.ts`:

```ts
import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";

export const Recognitions: CollectionConfig = {
  slug: "recognitions",
  labels: { singular: "Reconhecimento", plural: "Reconhecimentos" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "order", "_status"],
    listSearchableFields: ["title", "issuer"],
    group: "Conteúdo",
    description: "Prêmios e certificações. Aparecem no bloco de reconhecimentos da home.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", label: "Título", required: true, index: true },
    { name: "issuer", type: "text", label: "Concedido por", required: true },
    { name: "year", type: "text", label: "Ano", required: true },
    imageField({ name: "seal", label: "Selo", description: "Opcional. PNG ou SVG com fundo transparente." }),
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

### 3.2 Registrar

Em `payload.config.ts`:

```ts
import { Recognitions } from "@/collections/Recognitions";
// ...
collections: [Projects, Services, Publications, PublicationCategories,
              TeamMembers, Partners, Recognitions, Media, Users],
```

```bash
pnpm generate:types
```

### 3.3 Leitura

Em `lib/content.ts`:

```ts
export type RecognitionCard = {
  title: string;
  issuer: string;
  year: string;
  seal: ResolvedImage | null;
};

export const getRecognitions = cache(async (): Promise<RecognitionCard[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "recognitions",
    where: PUBLISHED,
    sort: "order",
    limit: 0,
    depth: 1,             // precisa popular o upload do selo
  });

  return docs.map((recognition) => ({
    title: recognition.title,
    issuer: recognition.issuer,
    year: recognition.year,
    seal: resolveImage(recognition.seal),
  }));
});
```

### 3.4 Componente

`components/Recognitions.tsx` — apresentacional, tipo importado da camada:

```tsx
import Image from "next/image";

import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import type { RecognitionCard } from "@/lib/content";

export function Recognitions({ recognitions }: { recognitions: RecognitionCard[] }) {
  if (recognitions.length === 0) return null;

  return (
    <section className="bg-move-offwhite px-4 py-24 md:px-14">
      <div className="editorial-container">
        <Reveal>
          <SectionLabel dot="purple">Reconhecimentos</SectionLabel>
        </Reveal>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recognitions.map((item) => (
            <li key={`${item.title}-${item.year}`} className="rounded-[1.25rem] border border-move-line bg-white p-6">
              {item.seal?.src && (
                <Image src={item.seal.src} alt={item.seal.alt} width={80} height={80}
                       className="mb-4 h-16 w-auto object-contain" />
              )}
              <h3 className="text-lg font-bold text-move-purple">{item.title}</h3>
              <p className="mt-1 text-sm text-move-black/65">{item.issuer} · {item.year}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Repare no `if (recognitions.length === 0) return null` — enquanto a Move não
cadastrar nada, a seção simplesmente não existe, em vez de aparecer vazia.

### 3.5 Página

Em `app/(frontend)/page.tsx`:

```tsx
const [home, settings, services, partners, publications, team, recognitions] =
  await Promise.all([
    getHomeContent(), getSiteSettings(), getServices(), getPartners(),
    getHomePublications(), getTeam(), getRecognitions(),
  ]);

// …
<Recognitions recognitions={recognitions} />
```

### 3.6 Verificar

```bash
pnpm dev
```

`/admin` → Conteúdo → Reconhecimentos → criar um → **Publicar** (rascunho não
aparece) → conferir a home.

---

## 4. Criar uma página nova com conteúdo editável

Exemplo: `/sobre`.

**1. Global** `globals/AboutPage.ts` com a copy (ver [Globals](payload-globals.md)).

**2. Registrar** em `payload.config.ts`, no array `globals` **e** no `seoPlugin`:

```ts
seoPlugin({ globals: ["home", "theory-of-change", /* … */, "about-page"], /* … */ })
```

**3.** `pnpm generate:types`

**4. Leitura** em `lib/content.ts`:

```ts
export const getAboutPage = cache(async () => {
  const payload = await getPayloadClient();
  const page = await payload.findGlobal({ slug: "about-page" });
  return {
    meta: page.meta,
    eyebrow: page.eyebrow,
    title: page.title,
    description: page.description ?? null,
  };
});
```

**5. Rota** `app/(frontend)/sobre/page.tsx`:

```tsx
import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { getAboutPage } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
}

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <main className="bg-move-offwhite">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ?? undefined}
        breadcrumbs={[{ label: "Início", href: "/" }]}
      />
    </main>
  );
}
```

**6. Abrir `/admin` → Páginas → Sobre e salvar uma vez.** Um global nunca salvo
volta praticamente vazio.

**7. Menu**: `/admin` → Configurações do site → Menu de navegação. O menu é
conteúdo, não código — e alimenta header e rodapé de uma vez.

---

## 5. Adicionar um ecossistema

Três arquivos, sempre os três:

```ts
// 1. lib/taxonomy.ts — a opção
export const ECOSYSTEMS = [ /* … */, "Trabalho e Renda" ] as const;

// 2. lib/palette.ts — a cor (escolha uma superfície ainda não usada)
export const ECOSYSTEM_SURFACE: Record<string, SurfaceName> = {
  /* … */
  "Trabalho e Renda": "sand",
};

// 3. lib/filterIcons.ts — o grafismo
export const ECOSYSTEM_ICON: Record<string, string> = {
  /* … */
  "Trabalho e Renda": ICON("Group 16"),
};
```

```bash
pnpm generate:types
```

Faltando o 2 ou o 3, o ecossistema funciona mas cai no fallback (Açaí + grafismo
neutro) e perde a identidade visual que faz a listagem ser navegável.

> Se as superfícies acabarem, repita uma cor **conscientemente** — não invente um
> token fora do guia.

---

## 6. Adicionar um grafismo da marca

1. Coloque o SVG em `public/brand/icons/` (monocromático, mesmo padrão dos
   existentes).
2. Acrescente o nome ao array `BRAND_ICONS` em `fields/iconField.ts`.
3. `pnpm generate:types`.

O valor gravado é o caminho completo (`/brand/icons/Group 17.svg`).

---

## 7. Publicação com arquivo para download

Fluxo só de conteúdo, sem código:

1. `/admin` → Conteúdo → Publicações → Criar
2. **Tipo** (sidebar) = "Publicação para download" — isso revela o campo Arquivo
3. Título, sinopse, capa, texto de apresentação
4. **Arquivo**: PDF, DOCX, XLSX, PPTX, CSV, TXT ou ZIP
5. Texto do botão (opcional; vazio usa "Baixar publicação")
6. Data, autoria, categorias
7. **Publicar**

A publicação ganha página própria em `/publicacoes/[slug]` mesmo sendo download
ou link externo — a página carrega o texto que apresenta o material, e a ação
final mora nela. **Cards nunca apontam direto para fora.**

---

## 8. Ligar um projeto ao logo do cliente

1. `/admin` → Parceiros e clientes → criar o parceiro com **Nome** e **Logo**
2. Abrir o projeto → campo **Cliente (logo)** → selecionar o parceiro
3. Publicar os dois

A ligação é feita **no projeto**. Em Parceiros, o bloco "Projetos no portfólio" é
um `join` — só leitura, para não existirem dois lugares onde a mesma ligação pode
ser escrita e discordar.

O logo do carrossel da home leva sempre a `/portfolio?cliente=…`, mesmo quando há
um projeto só: quem clica quer ver o que a Move fez com aquela organização, e
cair direto num caso esconderia que possam existir outros.

---

## 9. Mudar a cor de um componente

**Nunca** escolha fundo e texto separadamente. Use `SURFACES`:

```tsx
import { surfaceByName } from "@/lib/palette";

const surface = surfaceByName(category.color);

<span className={`rounded-full px-3 py-1 text-xs font-bold ${surface.chip}`}>
  {category.name}
</span>
```

Se a cor precisa ser escolhida no CMS, o campo é um `select` cujas opções saem do
próprio `SURFACES` — como faz `PublicationCategories`:

```ts
options: Object.entries(SURFACES).map(([value, surface]) => ({
  label: surface.label,
  value,
})),
```

Assim é impossível cadastrar uma cor que não existe no guia.

---

## 10. Recarregar o conteúdo do zero

```bash
pnpm seed
```

> ⚠️ **Destrutivo.** Apaga as collections que ele popula e recria tudo a partir
> de `data/site.ts`. Sobrescreve qualquer edição feita no admin — e como dev e
> produção compartilham o banco, rodar em dev apaga o conteúdo publicado.

Existe para a carga inicial. Se precisar rodar depois disso, aponte o `.env`
local para outro banco antes (basta trocar o nome do banco na `DATABASE_URL`).

`pnpm seed:theory` recarrega só o global da Teoria da Mudança — mesmo cuidado, em
escopo menor.
