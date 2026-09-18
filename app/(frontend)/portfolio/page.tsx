import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { getPortfolioPage, getProjects } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPortfolioPage();

  const metadata = metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
  return { ...metadata, alternates: { canonical: "https://move.social/portfolio" } };
}

/**
 * Esta página não lê `searchParams`, e é de propósito: bastava lê-los para o Next
 * marcar a rota como dinâmica e renderizar a cada visitante — era a única página do
 * site que subia o Payload e abria conexão com o Mongo em toda requisição.
 *
 * A listagem por cliente vive em /portfolio/cliente/[slug], pré-renderizada uma vez
 * por cliente. O `?cliente=` antigo é redirecionado para lá em next.config.ts, na
 * camada de roteamento, sem invocar função.
 */
export default async function PortfolioPage() {
  const [page, projects] = await Promise.all([getPortfolioPage(), getProjects()]);

  return (
    <main className="bg-move-offwhite">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ?? undefined}
        breadcrumbs={[{ label: "Início", href: "/" }]}
      />

      <PortfolioBrowser projects={projects} />
    </main>
  );
}
