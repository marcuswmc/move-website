import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Pessoa", plural: "Equipe e conselho" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "specialty", "group", "_status"],
    group: "Conteúdo",
    description: "Uma pessoa por registro. O campo Grupo define em qual bloco da home ela aparece.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "order",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
      index: true,
    },
    {
      name: "specialty",
      type: "text",
      label: "Especialidade",
      required: true,
    },
    {
      name: "bio",
      type: "textarea",
      label: "Resumo",
      admin: {
        description:
          "Formação e trajetória em um parágrafo. Aparece sobre o retrato quando o mouse passa pelo card (e sempre visível no celular, que não tem hover).",
      },
    },
    imageField({ name: "photo", label: "Retrato", required: true }),
    {
      name: "group",
      type: "select",
      label: "Grupo",
      required: true,
      defaultValue: "team",
      index: true,
      options: [
        { label: "Equipe", value: "team" },
        { label: "Conselho", value: "board" },
      ],
      admin: { position: "sidebar" },
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
