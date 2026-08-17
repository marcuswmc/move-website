import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/PageHero";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { getPortfolioPage, getProjects } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPortfolioPage();

  return metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
}

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

      {/* O browser lê `?cliente=` para o logo do carrossel poder cair aqui já filtrado.
          O Suspense é o que mantém a página estática: os parâmetros só resolvem no
          cliente, e a listagem completa é o que sai do prerender. */}
      <Suspense fallback={null}>
        <PortfolioBrowser projects={projects} />
      </Suspense>
    </main>
  );
}
