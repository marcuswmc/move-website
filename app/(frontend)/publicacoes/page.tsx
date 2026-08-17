import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { PublicationsBrowser } from "@/components/PublicationsBrowser";
import { getPublicationCategories, getPublications, getPublicationsPage } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicationsPage();

  return metadataFromSeo(page.meta, {
    title: `${page.title} | Move Social`,
    description: page.description,
  });
}

export default async function PublicationsPage() {
  const [page, publications, categories] = await Promise.all([
    getPublicationsPage(),
    getPublications(),
    getPublicationCategories(),
  ]);

  return (
    <main className="bg-move-offwhite">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ?? undefined}
        breadcrumbs={[{ label: "Início", href: "/" }]}
      />

      <PublicationsBrowser publications={publications} categories={categories} />
    </main>
  );
}
