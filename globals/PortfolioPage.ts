import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * A copy da abertura de /portfolio. Existe para que o cabeçalho da listagem — e o
 * SEO da página, injetado aqui pelo plugin — sejam editáveis no admin, como o de
 * qualquer outra página do site. A listagem em si vem da collection Projects.
 */
export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  label: "Página de Portfólio",
  admin: {
    group: "Páginas",
    description: "Abertura da listagem de projetos.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    { name: "eyebrow", type: "text", label: "Chapéu", required: true, defaultValue: "Portfólio" },
    { name: "title", type: "textarea", label: "Título", required: true },
    { name: "description", type: "textarea", label: "Texto de apoio" },
  ],
};
