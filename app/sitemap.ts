import type { MetadataRoute } from "next";

import { getProjectSlugs, getPublicationSlugs } from "@/lib/content";

export const revalidate = 3600;

const SITE_URL = "https://move.social";

/**
 * Sem um mapa, um buscador só conhece os endereços que já tinha na fila — e a fila
 * herdada da migração é toda de URLs do WordPress. Publicar o conjunto real é o que
 * dá ao rastreador um motivo para trocar uma lista pela outra, e complementa os 301
 * de next.config.ts e os 410 do proxy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, publicationSlugs] = await Promise.all([getProjectSlugs(), getPublicationSlugs()]);

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/publicacoes`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/teoria-da-mudanca`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.7 },
  ];

  return [
    ...pages,
    ...projectSlugs.map((slug) => ({
      url: `${SITE_URL}/portfolio/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...publicationSlugs.map((slug) => ({
      url: `${SITE_URL}/publicacoes/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
