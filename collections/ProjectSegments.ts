import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { anyone, authenticated } from "@/access";
import { TAG } from "@/lib/cache";
import { revalidatesCollection } from "@/lib/revalidate";

/**
 * Segmentos do portfólio — a natureza jurídica da organização atendida.
 *
 * Era um `select` de lista fechada em lib/taxonomy.ts. As `options` de um select são
 * estáticas no build, então criar um segmento novo exigia um deploy. Como collection,
 * a Move cria e renomeia sozinha; e renomear passa a valer para todos os projetos de
 * uma vez, porque o projeto guarda a referência, não o texto.
 *
 * Das três classificações, esta é a que pode virar collection sem efeito colateral:
 * ecossistema tem cor (ECOSYSTEM_SURFACE) e grafismo (ECOSYSTEM_ICON) presos ao valor,
 * e um valor fora do mapa cairia num fallback silencioso. Segmento não tem nenhum dos
 * dois — é só um rótulo de filtro.
 */
export const ProjectSegments: CollectionConfig = {
  slug: "project-segments",
  labels: { singular: "Segmento", plural: "Segmentos de projeto" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    group: "Conteúdo",
    description: "Rótulos de segmento usados na classificação dos projetos e no filtro de /portfolio.",
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "order",
  hooks: revalidatesCollection(TAG.projectSegments, TAG.projects),
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
      index: true,
      admin: {
        description: "Aparece no filtro de /portfolio exatamente como escrito aqui.",
      },
    },
    slugField({ useAsSlug: "name" }),
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
