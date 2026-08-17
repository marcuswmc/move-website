import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { iconField } from "@/fields/iconField";

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Serviço", plural: "Serviços" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Conteúdo",
    description: 'Cards do bloco "O que entregamos", na home e na Teoria da Mudança.',
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
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      index: true,
    },
    {
      name: "body",
      type: "textarea",
      label: "Descrição",
      required: true,
    },
    iconField(),
    {
      name: "order",
      type: "number",
      label: "Ordem",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Menor número aparece primeiro. A numeração 01, 02… do card é gerada a partir daqui.",
      },
    },
  ],
};
