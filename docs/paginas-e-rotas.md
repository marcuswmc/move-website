# Páginas e rotas

[← Índice](README.md)

## Route groups

```
app/
  (frontend)/    site público — layout, fontes, header, rodapé, globals.css
  (payload)/     admin e API — GERADO pelo Payload, não editar
```

Os parênteses agrupam sem entrar na URL. Os dois grupos têm **layouts
independentes**: o admin não carrega as fontes, o Lenis nem o CSS do site, e o
site não carrega nada do painel.

Os arquivos de `(payload)/` trazem no topo:

```
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
```

A única exceção editável é `app/(payload)/custom.scss`, para ajustes visuais do
painel.

## Layout do site

[`app/(frontend)/layout.tsx`](../app/(frontend)/layout.tsx) é um Server Component
assíncrono. Ele carrega as fontes, monta header e rodapé e — importante — é
**onde `SmoothScroll` é montado uma única vez**:

```tsx
const { navItems, contact, social } = await getSiteSettings();

return (
  <html lang="pt-BR">
    <body className={`${raleway.variable} antialiased`} suppressHydrationWarning>
      <SmoothScroll />
      <HashScrollSync />
      <Header navItems={navItems} social={social} />
      {children}
      <Footer navItems={navItems} contact={contact} />
    </body>
  </html>
);
```

- **Fontes** entram só aqui, via `next/font/google`. Não adicione outro mecanismo
  de carregamento de fonte.
- **`lang="pt-BR"`** — o site é inteiramente em português.
- **`SmoothScroll`** é dono da única instância de Lenis. Ver
  [Componentes e design](componentes-e-design.md#animação).

## Anatomia de uma página

As páginas públicas seguem esta estrutura geral. `/portfolio` também aguarda
`searchParams` para aplicar o cliente antes de gerar o HTML; por isso é dinâmica,
com dados públicos em cache por 60 segundos:

```tsx
import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { getPortfolioPage, getProjects } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;                          // ①

export async function generateMetadata(): Promise<Metadata> {   // ②
  const page = await getPortfolioPage();
  return metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
}

export default async function PortfolioPage() {        // ③
  const [page, projects] = await Promise.all([          // ④
    getPortfolioPage(),
    getProjects(),
  ]);

  return (
    <main className="bg-move-offwhite">
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description ?? undefined} />
      {/* … */}
    </main>
  );
}
```

① **`revalidate = 60`** em todas as páginas: o HTML é regenerado no máximo a cada
60 segundos. Uma edição no admin aparece no site em até um minuto, sem deploy.

② **`generateMetadata`** sempre via `metadataFromSeo` — ver [SEO](#seo).

③ Server Component assíncrono, todo o acesso a dados aqui.

④ **`Promise.all`** para consultas independentes. Como as funções de conteúdo são
`cache()`, chamar a mesma duas vezes não custa nada — a paralelização é o que
importa.

## Rotas dinâmicas

`app/(frontend)/portfolio/[slug]/page.tsx`:

```tsx
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };     // ⚠️ params é Promise

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Projeto não encontrado | Move Social" };

  return metadataFromSeo(project.meta, {
    title: `${project.client} · Portfólio | Move Social`,
    description: project.summary,
    image: project.image.src ? project.image : null,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();
  // …
}
```

Três pontos:

- **`params` é uma `Promise`** neste Next e precisa de `await`. Vale para
  `searchParams` também.
- **`generateStaticParams`** pré-renderiza as páginas existentes no build. Um
  projeto publicado depois entra pela revalidação, sem deploy.
- **`generateMetadata` trata o caso "não existe"** antes de `notFound()`, senão o
  TypeScript reclama e a página quebra em vez de dar 404.

## SEO

O plugin injeta um grupo `meta` (título, descrição, imagem) nas collections
`projects` e `publications` e nos globals de página. A conversão para `Metadata`
do Next é sempre por [`lib/seo.ts`](../lib/seo.ts):

```ts
metadataFromSeo(meta, { title, description, image, type, publishedTime })
```

A regra: **o campo do CMS sempre vence; o fallback é o conteúdo real da página.**
Um documento publicado sem ninguém tocar na aba de SEO já sai com título,
descrição e imagem de compartilhamento corretos — e quem quiser afinar o texto
para busca tem onde fazê-lo.

`metadataFromSeo` monta `title`, `description`, Open Graph e Twitter Card de uma
vez, escolhendo `summary_large_image` quando há imagem.

> **Não escreva `export const metadata = {…}` à mão numa rota que tem registro no
> CMS.** Isso tira da Move o controle do SEO daquela página. O `metadata`
> estático do `layout.tsx` é a exceção: é o padrão do site inteiro.

## Fronteira servidor / cliente

**Página busca, componente cliente filtra.** `/portfolio` e `/publicacoes`
carregam tudo no servidor e entregam um array simples:

```tsx
<Suspense fallback={null}>
  <PortfolioBrowser projects={projects} />
</Suspense>
```

O `Suspense` está ali por um motivo específico: `PortfolioBrowser` lê
`?cliente=` da URL (para o logo do carrossel cair na listagem já filtrada), e ler
search params é o que tiraria a página do prerender. Envolvido em `Suspense`, os
parâmetros só resolvem no cliente e **a listagem completa continua sendo o que
sai do build**.

Um componente cliente **não pode** importar `lib/content.ts` nem qualquer arquivo
de `collections/` — arrastaria o Payload para o bundle do navegador. Constantes
compartilhadas entre CMS e cliente moram em `lib/` (`taxonomy.ts`, `palette.ts`,
`filterIcons.ts`).

## Rich text

```tsx
import { RichText } from "@/components/RichText";

{project.description && <RichText data={project.description} />}
```

O componente embrulha o renderizador do Lexical na classe `.editorial-prose`,
definida em `globals.css`. A tipografia é aplicada no contêiner, por seletor de
descendente — não há conversor customizado por nó. O que a Move escreve no admin
sai com a mesma medida de leitura e a mesma escala do resto do site.

## Criar uma rota nova

1. **Onde vive o conteúdo?** Copy da página → [global](payload-globals.md).
   Itens repetíveis → [collection](payload-collections.md).
2. Função de leitura em [`lib/content.ts`](camada-de-conteudo.md).
3. Se a página tem SEO próprio, registre o slug no `seoPlugin` do
   `payload.config.ts`.
4. `app/(frontend)/minha-rota/page.tsx` com `revalidate = 60`,
   `generateMetadata` via `metadataFromSeo` e o componente assíncrono.
5. Acrescente a rota ao menu em **/admin → Configurações do site → Menu de
   navegação** (não é código — o menu é conteúdo).
6. Rotas dinâmicas: `generateStaticParams` + `notFound()`.

## Checklist

- [ ] `export const revalidate = 60`
- [ ] `generateMetadata` usando `metadataFromSeo`
- [ ] Consultas independentes em `Promise.all`
- [ ] `await params` nas rotas dinâmicas
- [ ] `notFound()` quando a leitura devolve `null`
- [ ] `generateStaticParams` nas rotas `[slug]`
- [ ] `Suspense` em volta de qualquer componente que leia search params
- [ ] Nenhum texto fixo no JSX que a Move devesse poder editar
