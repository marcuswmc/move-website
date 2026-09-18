import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  ParagraphFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";
import { revalidatesGlobal } from "@/lib/revalidate";
import { TAG } from "@/lib/cache";

import { anyone, authenticated } from "@/access";
import { imageField } from "@/fields/imageField";
import { showcaseToneField } from "@/fields/toneField";
import { ensureLexical } from "@/lib/lexical";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Home",
  admin: {
    group: "Páginas",
    description: "Hero, selos e os cards empilhados de destaque.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  hooks: revalidatesGlobal(TAG.home),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              fields: [
                { name: "eyebrow", type: "text", label: "Chapéu", required: true },
                { name: "title", type: "textarea", label: "Título", required: true },
                {
                  name: "body",
                  type: "richText",
                  label: "Texto de apoio",
                  required: true,
                  admin: {
                    description:
                      "Texto curto abaixo do título. Use negrito ou itálico para destacar palavras — o editor só oferece esses dois formatos porque o hero é um parágrafo, não uma página.",
                  },
                  editor: lexicalEditor({
                    features: () => [
                      ParagraphFeature(),
                      BoldFeature(),
                      ItalicFeature(),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ],
                  }),
                  hooks: {
                    // O texto foi gravado como string enquanto o campo era `textarea`.
                    afterRead: [({ value }) => ensureLexical(value)],
                  },
                },
              ],
            },
            {
              name: "affiliations",
              type: "array",
              label: "Selos e afiliações",
              admin: { description: "Exibidos abaixo do hero." },
              fields: [{ name: "label", type: "text", label: "Nome", required: true }],
            },
          ],
        },
        {
          label: "Destaques",
          fields: [
            {
              name: "showcase",
              type: "array",
              label: "Cards de destaque",
              maxRows: 6,
              admin: {
                description:
                  "Os cards empilhados da home. A numeração 01, 02… é gerada a partir da ordem desta lista.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "client", type: "text", label: "Cliente", required: true },
                    { name: "category", type: "text", label: "Categoria", required: true },
                  ],
                },
                { name: "title", type: "textarea", label: "Título", required: true },
                { name: "description", type: "textarea", label: "Descrição", required: true },
                imageField({ required: true }),
                showcaseToneField(),
                {
                  name: "relatedProject",
                  type: "relationship",
                  relationTo: "projects",
                  label: "Projeto relacionado",
                  admin: { description: "Opcional — usado apenas como referência editorial." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
