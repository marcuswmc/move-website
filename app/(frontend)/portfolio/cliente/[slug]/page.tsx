import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/PageHero";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { getClientSlugs, getPortfolioPage, getProjects } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 86400;

/**
 * O portfólio filtrado por cliente — o destino de cada logo do carrossel de parceiros.
 *
 * Antes isto era `/portfolio?cliente=<slug>`, e ler esse parâmetro tornava `/portfolio`
 * inteira dinâmica: cada visita, inclusive a maioria que não filtra nada, subia o
 * Payload e abria conexão com o Mongo. Como o conjunto de clientes é conhecido no
 * build, cada um pode ter a sua página pré-renderizada, e nenhuma delas custa função.
 *
 * O filtro continua aplicado no servidor, então os cards certos estão no HTML inicial
 * — sem piscar a lista inteira antes da hidratação e sem depender de JavaScript.
 */
export async function generateStaticParams() {
  const slugs = await getClientSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, page, projects] = await Promise.all([params, getPortfolioPage(), getProjects()]);
  const client = projects.find((project) => project.clientSlug === slug)?.client;

  if (!client) return { title: "Cliente não encontrado | Move Social" };

  const metadata = metadataFromSeo(page.meta, {
    title: `${client} · Portfólio | Move Social`,
    description: `Projetos da Move com ${client}.`,
  });

  return {
    ...metadata,
    alternates: { canonical: `https://move.social/portfolio/cliente/${slug}` },
  };
}

export default async function PortfolioByClientPage({ params }: Props) {
  const [{ slug }, page, projects] = await Promise.all([params, getPortfolioPage(), getProjects()]);

  // Um slug sem projeto nenhum renderizaria uma listagem vazia sob um título de
  // cliente — melhor dizer que a página não existe.
  if (!projects.some((project) => project.clientSlug === slug)) notFound();

  return (
    <main className="bg-move-offwhite">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ?? undefined}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Portfólio", href: "/portfolio" },
        ]}
      />

      <PortfolioBrowser projects={projects} initialClient={slug} />
    </main>
  );
}
