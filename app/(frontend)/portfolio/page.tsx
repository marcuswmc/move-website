import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { getPortfolioPage, getProjects } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPortfolioPage();

  const metadata = metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
  return { ...metadata, alternates: { canonical: "https://move.social/portfolio" } };
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string | string[] }>;
}) {
  const [page, projects, params] = await Promise.all([getPortfolioPage(), getProjects(), searchParams]);
  const initialClient = (Array.isArray(params.cliente) ? params.cliente[0] : params.cliente) || null;

  return (
    <main className="bg-move-offwhite">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ?? undefined}
        breadcrumbs={[{ label: "Início", href: "/" }]}
      />

      {/* Os dados públicos têm cache, mas o HTML respeita o cliente da URL desde
          a primeira resposta. A key reinicia o filtro ao navegar entre clientes. */}
      <PortfolioBrowser key={initialClient ?? "all"} projects={projects} initialClient={initialClient} />
    </main>
  );
}
