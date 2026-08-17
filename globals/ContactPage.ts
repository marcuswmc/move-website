import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";
import { imageField } from "@/fields/imageField";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Página de contato",
  admin: {
    group: "Páginas",
    description: "Etapas do atendimento, princípios e as listas de contratação.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Atendimento",
          fields: [
            {
              name: "steps",
              type: "array",
              label: "Como funciona",
              admin: { description: "A numeração 01, 02… é gerada a partir da ordem desta lista." },
              fields: [
                { name: "title", type: "text", label: "Título", required: true },
                { name: "body", type: "textarea", label: "Texto", required: true },
              ],
            },
            {
              name: "areas",
              type: "array",
              label: "Áreas do formulário",
              admin: { description: 'Opções do campo "área de atuação" no formulário.' },
              fields: [{ name: "label", type: "text", label: "Área", required: true }],
            },
            {
              name: "availabilityDays",
              type: "array",
              label: "Dias para contato",
              admin: {
                description:
                  'Opções do bloco "disponibilidade" no formulário. Tire um dia da lista para deixar de oferecê-lo.',
              },
              defaultValue: [
                { label: "Segunda" },
                { label: "Terça" },
                { label: "Quarta" },
                { label: "Quinta" },
                { label: "Sexta" },
              ],
              fields: [{ name: "label", type: "text", label: "Dia", required: true }],
            },
            {
              name: "availabilityPeriods",
              type: "array",
              label: "Períodos para contato",
              admin: { description: 'Opções de período no bloco "disponibilidade" do formulário.' },
              defaultValue: [{ label: "Manhã" }, { label: "Tarde" }, { label: "Noite" }],
              fields: [{ name: "label", type: "text", label: "Período", required: true }],
            },
            imageField({ name: "heroImage", label: "Imagem da página", required: true }),
          ],
        },
        {
          label: "Princípios",
          fields: [
            {
              name: "principles",
              type: "array",
              label: "Princípios",
              fields: [
                { name: "title", type: "text", label: "Título", required: true },
                { name: "body", type: "textarea", label: "Texto", required: true },
              ],
            },
          ],
        },
        {
          label: "O que se contrata",
          fields: [
            {
              name: "contracted",
              type: "array",
              label: "O que se contrata",
              fields: [{ name: "label", type: "text", label: "Item", required: true }],
            },
            {
              name: "received",
              type: "array",
              label: "O que se recebe",
              fields: [{ name: "label", type: "text", label: "Item", required: true }],
            },
          ],
        },
      ],
    },
  ],
};
