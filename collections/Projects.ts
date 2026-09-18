import type { CollectionConfig } from "payload";
import { slugField } from "payload";
import { revalidatesCollection } from "@/lib/revalidate";
import { TAG } from "@/lib/cache";

import { authenticated, publishedOrAuthenticated } from "@/access";
import { imageField } from "@/fields/imageField";
import { projectCardColorField } from "@/fields/toneField";
// As duas taxonomias fechadas moram em lib/ porque o filtro de /portfolio também as
// consome, e um componente cliente não pode importar este arquivo.
import { ECOSYSTEMS, SEGMENTS } from "@/lib/taxonomy";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Projeto", plural: "Portfólio" },
  admin: {
    useAsTitle: "client",
    defaultColumns: ["client", "ecosystems", "services", "year", "_status"],
    listSearchableFields: ["client", "service", "summary"],
    group: "Conteúdo",
    description: "Cada projeto vira um card em /portfolio e uma página própria em /portfolio/[slug].",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "order",
  hooks: {
    beforeValidate: [({ data }) => {
      if (!data) return data;
      // Keep scalar fields readable by the deployed site during rollout.
      if (Array.isArray(data.ecosystems)) data.ecosystem = data.ecosystems[0] ?? "";
      if (Array.isArray(data.services)) data.service = data.services.join("; ");
      if (Array.isArray(data.segments)) data.segment = data.segments[0] ?? null;
      return data;
    }],
    ...revalidatesCollection(TAG.projects, TAG.partners),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Projeto",
          fields: [
            {
              name: "client",
              type: "text",
              label: "Cliente",
              required: true,
              index: true,
            },
            // O slug é a URL da página do projeto: /portfolio/[slug].
            slugField({ useAsSlug: "client" }),
            /**
             * Dono da relação Cliente ↔ Projeto. Fica aqui, e não em Parceiros, porque é
             * durante a publicação do projeto que se sabe de quem ele é — e assim um mesmo
             * cliente acumula vários projetos sem ninguém manter duas listas em sincronia.
             */
            {
              name: "partner",
              type: "relationship",
              relationTo: "partners",
              label: "Cliente (logo)",
              index: true,
              admin: {
                description:
                  "Opcional. Quando preenchido, o logo cadastrado em Parceiros aparece pequeno no card e no topo da página do projeto. Sem ele, o card mostra só o nome — que continua vindo do campo Cliente acima.",
              },
            },
            {
              name: "summary",
              type: "textarea",
              label: "Resumo",
              maxLength: 240,
              admin: {
                description:
                  "Uma a duas linhas para o card da listagem e para a abertura da página do projeto. Se ficar vazio, o card usa o começo do Desafio e a abertura da página não exibe nada — nunca repete o texto do Desafio logo abaixo.",
              },
            },
            {
              name: "challenge",
              type: "textarea",
              label: "Desafio",
              required: true,
            },
            {
              name: "results",
              type: "textarea",
              label: "Resultados",
              required: true,
            },
            {
              name: "description",
              type: "richText",
              label: "Descrição completa",
              admin: {
                description:
                  "Opcional. Texto longo exibido só na página do projeto, abaixo de Desafio e Resultados.",
              },
            },
            /**
             * Opcional desde que o card virou bloco de cor: a imagem só aparece no topo
             * da página do projeto. Exigi-la travaria o cadastro de um projeto que hoje
             * não precisa de nenhuma fotografia para existir na listagem.
             */
            imageField({
              description:
                "Opcional. Aparece só no topo da página do projeto — o card em /portfolio é um bloco de cor, definido em Cor do card.",
            }),
          ],
        },
        {
          label: "Classificação",
          description: "Alimenta os filtros do topo de /portfolio.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "ecosystems",
                  type: "select",
                  hasMany: true,
                  label: "Ecossistemas",
                  options: ECOSYSTEMS.map((value) => ({ label: value, value })),
                  admin: { description: "O primeiro aparece no card e define a cor automática. Os demais aparecem como +N e também entram nos filtros." },
                },
                {
                  name: "ecosystem",
                  type: "select",
                  label: "Ecossistema",
                  required: true,
                  index: true,
                  options: ECOSYSTEMS.map((value) => ({ label: value, value })),
                  admin: { hidden: true },
                },
                {
                  name: "year",
                  type: "text",
                  label: "Ano",
                  required: true,
                  admin: { description: 'Aceita texto livre, ex.: "2024 — em andamento".' },
                },
              ],
            },
            {
              name: "services",
              type: "select",
              hasMany: true,
              label: "Serviços",
              options: ["Avaliações de Impacto e Resultados", "Diagnósticos Sociais", "Estudos e Sistematizações", "Facilitações", "Formações", "Planejamento Estratégico", "Sistemas de Monitoramento", "Teoria de Mudança"],
            },
            {
              name: "service",
              type: "text",
              label: "Serviço",
              index: true,
              admin: {
                hidden: true,
                description:
                  "Alimenta o filtro por serviço. Reaproveite exatamente o mesmo texto entre projetos do mesmo tipo, senão viram duas opções distintas no filtro.",
              },
            },
            {
              name: "segments",
              type: "select",
              hasMany: true,
              label: "Segmentos",
              options: SEGMENTS.map((value) => ({ label: value, value })),
            },
            {
              name: "segment",
              type: "select",
              label: "Segmento",
              index: true,
              options: SEGMENTS.map((value) => ({ label: value, value })),
              admin: { hidden: true },
            },
          ],
        },
      ],
    },
    projectCardColorField(),
    {
      name: "order",
      type: "number",
      label: "Ordem",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Menor número aparece primeiro.",
      },
    },
  ],
};
