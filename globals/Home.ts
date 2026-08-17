import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";
import { imageField } from "@/fields/imageField";
import { showcaseToneField } from "@/fields/toneField";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Home",
  admin: {
    group: "Páginas",
    description: "Hero, selos e os cards empilhados de destaque.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
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
                { name: "body", type: "textarea", label: "Texto de apoio", required: true },
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
