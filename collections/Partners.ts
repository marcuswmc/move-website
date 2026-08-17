import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Parceiro / Cliente", plural: "Parceiros e clientes" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "_status"],
    group: "Conteúdo",
    description:
      'Logos do carrossel "Com quem trabalhamos", na home — e o logo que pode aparecer nos cards do portfólio.',
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
    // O slug identifica o cliente na URL de /portfolio?cliente=…, quando o logo do
    // carrossel leva a mais de um projeto.
    slugField({ useAsSlug: "name" }),
    imageField({
      name: "logo",
      label: "Logo",
      required: true,
      description:
        "Aparece no carrossel da home e, pequeno, no card de cada projeto ligado a este cliente. Prefira SVG ou PNG com fundo transparente.",
    }),
    /**
     * Lado inverso da relação: quem escolhe o cliente é o projeto, no campo "Cliente
     * (logo)" de cada documento do portfólio. Aqui a lista só mostra o resultado, para
     * não existirem dois lugares onde a mesma ligação pode ser escrita — e discordar.
     */
    {
      name: "projects",
      type: "join",
      collection: "projects",
      on: "partner",
      label: "Projetos no portfólio",
      admin: {
        allowCreate: false,
        defaultColumns: ["client", "ecosystem", "year", "_status"],
        description:
          "A ligação é feita no projeto, em Portfólio → Cliente (logo). Um cliente pode ter vários projetos: o logo do carrossel leva ao projeto quando há só um, e à listagem filtrada quando há mais.",
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
