import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * A copy da abertura de /publicacoes. Mesma lógica de PortfolioPage: o cabeçalho e
 * o SEO da listagem ficam editáveis; os itens vêm da collection Publications.
 */
export const PublicationsPage: GlobalConfig = {
  slug: "publications-page",
  label: "Página de Publicações",
  admin: {
    group: "Páginas",
    description: "Abertura da listagem de publicações.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    { name: "eyebrow", type: "text", label: "Chapéu", required: true, defaultValue: "Publicações" },
    { name: "title", type: "textarea", label: "Título", required: true },
    { name: "description", type: "textarea", label: "Texto de apoio" },
  ],
};
