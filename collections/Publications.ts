import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";

/**
 * O acervo tem três naturezas, e o tipo decide qual **ação** a página oferece no
 * fim — ler ali mesmo, baixar um arquivo ou seguir para fora. O texto explicativo
 * não depende do tipo: toda publicação tem página própria e pode ter conteúdo
 * escrito, mesmo quando o material em si mora num PDF ou em outro site.
 */
export const PUBLICATION_TYPES = [
  { label: "Artigo (texto no site)", value: "article" },
  { label: "Publicação para download", value: "download" },
  { label: "Link externo", value: "external" },
] as const;

export const Publications: CollectionConfig = {
  slug: "publications",
  labels: { singular: "Publicação", plural: "Publicações" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "publishedAt", "_status"],
    listSearchableFields: ["title", "synopsis"],
    group: "Conteúdo",
    description: "Acervo de /publicacoes. Ordenado pela data de publicação, mais recente primeiro.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "-publishedAt",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Publicação",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Título",
              required: true,
              index: true,
            },
            slugField(),
            {
              name: "synopsis",
              type: "textarea",
              label: "Sinopse",
              required: true,
              maxLength: 320,
              admin: { description: "Uma a duas linhas. Aparece no card da listagem." },
            },
            imageField({ name: "cover", label: "Capa", required: true }),
            {
              name: "content",
              type: "richText",
              label: "Texto",
              admin: {
                description:
                  "O corpo da página. Num artigo é o texto completo; num download ou link externo, o texto que apresenta e contextualiza a publicação.",
              },
            },
            {
              name: "file",
              type: "upload",
              relationTo: "media",
              label: "Arquivo",
              admin: {
                description: "PDF, documento, planilha, apresentação ou pacote. A página oferece o download.",
                condition: (data) => data?.type === "download",
              },
            },
            {
              name: "externalUrl",
              type: "text",
              label: "URL externa",
              admin: {
                description: "Para onde o botão da página leva.",
                condition: (data) => data?.type === "external",
              },
            },
            {
              name: "actionLabel",
              type: "text",
              label: "Texto do botão",
              admin: {
                description:
                  'Rótulo do botão de download ou de acesso. Vazio usa o padrão do tipo — ex.: "Baixar publicação".',
                condition: (data) => data?.type !== "article",
              },
            },
          ],
        },
        {
          label: "Publicação e autoria",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "publishedAt",
                  type: "date",
                  label: "Data de publicação",
                  required: true,
                  defaultValue: () => new Date().toISOString(),
                  admin: { date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } },
                },
                {
                  name: "author",
                  type: "text",
                  label: "Autoria",
                  defaultValue: "Move Social",
                },
              ],
            },
            {
              name: "categories",
              type: "relationship",
              relationTo: "publication-categories",
              hasMany: true,
              label: "Categorias",
              admin: { description: "Alimentam o filtro da listagem." },
            },
          ],
        },
      ],
    },
    {
      name: "type",
      type: "select",
      label: "Tipo",
      required: true,
      defaultValue: "article",
      index: true,
      options: [...PUBLICATION_TYPES],
      admin: {
        position: "sidebar",
        description: "Decide quais campos aparecem acima e o que o card oferece.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacar na home",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "A home mostra as 3 publicações destacadas mais recentes; sem destaques, mostra as 3 últimas.",
      },
    },
  ],
};
