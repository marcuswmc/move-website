import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Configurações do site",
  admin: {
    group: "Configurações",
    description: "Navegação, contato e números usados em mais de uma página.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    {
      name: "nav",
      type: "array",
      label: "Menu de navegação",
      maxRows: 8,
      admin: { description: "Aparece no header e no rodapé, na mesma ordem." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", label: "Rótulo", required: true },
            {
              name: "href",
              type: "text",
              label: "Destino",
              required: true,
              admin: { description: 'Rota interna ("/portfolio") ou âncora ("/#entregamos").' },
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Contato",
      fields: [
        { name: "email", type: "email", label: "E-mail", required: true },
        { name: "phone", type: "text", label: "Telefone", required: true },
        { name: "address", type: "textarea", label: "Endereço", required: true },
      ],
    },
    {
      name: "social",
      type: "group",
      label: "Redes sociais",
      admin: {
        description:
          "Aparecem como ícones no header. Um campo vazio simplesmente não renderiza o ícone — nunca vira link quebrado.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "instagram", type: "text", label: "Instagram (URL)" },
            { name: "linkedin", type: "text", label: "LinkedIn (URL)" },
          ],
        },
      ],
    },
    {
      name: "metrics",
      type: "array",
      label: "Números",
      admin: { description: "Exibidos no hero da home e na página de contato." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", label: "Valor", required: true },
            { name: "label", type: "text", label: "Legenda", required: true },
          ],
        },
      ],
    },
  ],
};
