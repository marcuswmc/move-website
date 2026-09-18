import type { MetadataRoute } from "next";

const SITE_URL = "https://move.social";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/portfolio?*_ecossistema=",
        "/portfolio?*_segmento=",
        "/portfolio?*_servico=",
        "/portfolio/?*_ecossistema=",
        "/portfolio/?*_segmento=",
        "/portfolio/?*_servico=",
      ],
    }, {
      // Controles de treino separados dos agentes de pesquisa. Os crawlers de
      // pesquisa continuam sujeitos às exclusões dos filtros antigos acima.
      userAgent: ["GPTBot", "ClaudeBot", "Applebot-Extended"],
      disallow: "/",
    }],
    // O mapa é o que apresenta o conjunto real de endereços a quem só conhece a
    // lista herdada do WordPress.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
