import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";
import { imageField } from "@/fields/imageField";
import { goalToneField } from "@/fields/toneField";

export const TheoryOfChange: GlobalConfig = {
  slug: "theory-of-change",
  label: "Teoria da Mudança",
  admin: {
    group: "Páginas",
    description: "As camadas de mudança e o PDF para download.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    {
      name: "goals",
      type: "array",
      label: "Camadas",
      admin: {
        description: "A numeração 01, 02… é gerada a partir da ordem desta lista.",
      },
      fields: [
        { name: "eyebrow", type: "text", label: "Chapéu", required: true },
        { name: "title", type: "textarea", label: "Título", required: true },
        { name: "body", type: "textarea", label: "Texto", required: true },
        imageField({ required: true }),
        goalToneField(),
      ],
    },
    {
      name: "pdf",
      type: "group",
      label: "PDF da Teoria da Mudança",
      fields: [
        { name: "label", type: "text", label: "Rótulo do botão", required: true },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          label: "Arquivo",
          admin: { description: "Quando preenchido, tem prioridade sobre o caminho abaixo." },
        },
        {
          name: "href",
          type: "text",
          label: "Caminho alternativo",
          admin: { description: "Usado enquanto o arquivo não é enviado." },
        },
      ],
    },
  ],
};
