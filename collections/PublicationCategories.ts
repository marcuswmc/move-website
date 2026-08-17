import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { anyone, authenticated } from "@/access";
import { SURFACES } from "@/lib/palette";

/**
 * Categorias das publicações. É collection, e não select fixo, porque o acervo do
 * site antigo vai chegar com uma taxonomia que ainda não conhecemos por inteiro — a
 * Move precisa conseguir criar categoria nova sem esperar um deploy.
 *
 * A cor é presa às superfícies do guia: livre para escolher, impossível de inventar.
 */
export const PublicationCategories: CollectionConfig = {
  slug: "publication-categories",
  labels: { singular: "Categoria", plural: "Categorias de publicação" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "color", "order"],
    group: "Conteúdo",
    description: "Rótulos usados para filtrar /publicacoes.",
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "order",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
      index: true,
    },
    slugField({ useAsSlug: "name" }),
    {
      name: "color",
      type: "select",
      label: "Cor",
      required: true,
      defaultValue: "purple",
      options: Object.entries(SURFACES).map(([value, surface]) => ({
        label: surface.label,
        value,
      })),
      admin: {
        position: "sidebar",
        description: "Cor do sistema. A cor do texto vem junto, pela tabela de contraste do guia.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      required: true,
      defaultValue: 0,
      admin: { position: "sidebar", description: "Menor número aparece primeiro." },
    },
  ],
};
