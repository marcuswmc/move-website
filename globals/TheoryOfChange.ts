import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * A página espelha a Teoria de Mudança oficial da Move (TdM_MoveSocial_2025.pdf).
 *
 * O documento é uma cadeia causal lida de baixo para cima: as frentes de atuação
 * sustentam o que a Move faz, que chega a três públicos, que gera entregas, que
 * produzem resultados, que somados apontam para o impacto. Os campos abaixo estão
 * na mesma ordem em que a página os apresenta — editar aqui e ler lá são a mesma
 * leitura, e é isso que impede a página de sair de sincronia com o PDF.
 *
 * Cada elo tem um `intro` (chapéu, título, texto) separado da sua lista de itens:
 * a Move reescreve a abertura de uma seção com muito mais frequência do que muda
 * a estrutura da teoria em si.
 */

/** Abertura de um elo da cadeia. Repetida em cada seção, por isso vive numa função. */
const sectionIntro = (name: string, label: string, description?: string): Field => ({
  name,
  type: "group",
  label,
  admin: description ? { description } : undefined,
  fields: [
    { name: "eyebrow", type: "text", label: "Chapéu", required: true },
    { name: "title", type: "textarea", label: "Título", required: true },
    { name: "description", type: "textarea", label: "Texto de apoio" },
  ],
});

export const TheoryOfChange: GlobalConfig = {
  slug: "theory-of-change",
  label: "Teoria da Mudança",
  admin: {
    group: "Páginas",
    description: "A cadeia da teoria de mudança, elo a elo, e o PDF para download.",
  },
  access: { read: anyone, update: authenticated },
  versions: { max: 20 },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Abertura da página",
      fields: [
        { name: "eyebrow", type: "text", label: "Chapéu", required: true },
        { name: "title", type: "textarea", label: "Título", required: true },
        { name: "description", type: "textarea", label: "Texto de apoio", required: true },
      ],
    },

    // ── Elo 1 · Como atuamos ────────────────────────────────────────────────
    sectionIntro("frontsIntro", "1 · Como atuamos"),
    {
      name: "fronts",
      type: "array",
      label: "Frentes de atuação",
      admin: {
        description:
          "As quatro frentes do diagrama oficial. O desenho sobrepõe os círculos em cruz, então quatro é o número que o gráfico comporta.",
      },
      maxRows: 4,
      fields: [
        { name: "label", type: "text", label: "Frente", required: true },
        { name: "description", type: "textarea", label: "Descrição", required: true },
      ],
    },

    // ── Elo 2 · O que fazemos ───────────────────────────────────────────────
    sectionIntro(
      "activitiesIntro",
      "2 · O que fazemos",
      "Os cards desta seção vêm da coleção Serviços — edite-os por lá.",
    ),

    // ── Elo 3 · Para quem fazemos ───────────────────────────────────────────
    sectionIntro("audiencesIntro", "3 · Para quem fazemos"),
    {
      name: "audiences",
      type: "array",
      label: "Camadas de público",
      admin: {
        description:
          "Do centro para fora, como no diagrama: pessoas, organizações, campo. A ordem desta lista define os anéis.",
      },
      maxRows: 3,
      fields: [
        { name: "label", type: "text", label: "Camada", required: true },
        { name: "summary", type: "text", label: "Resumo curto", required: true },
        { name: "description", type: "textarea", label: "Descrição", required: true },
      ],
    },

    // ── Elo 4 · O que entregamos ────────────────────────────────────────────
    sectionIntro("deliverablesIntro", "4 · O que entregamos"),
    {
      name: "deliverables",
      type: "array",
      label: "Entregas",
      fields: [{ name: "label", type: "textarea", label: "Entrega", required: true }],
    },

    // ── Elo 5 · O que queremos ──────────────────────────────────────────────
    sectionIntro("outcomesIntro", "5 · O que queremos"),
    {
      name: "outcomes",
      type: "array",
      label: "Resultados esperados",
      admin: {
        description:
          "Cada resultado recebe uma cor do sistema da marca, na ordem da lista. Com sete itens, cada um fica com uma cor própria.",
      },
      fields: [{ name: "label", type: "textarea", label: "Resultado", required: true }],
    },

    // ── Elo 6 · Impacto ─────────────────────────────────────────────────────
    {
      name: "impact",
      type: "group",
      label: "6 · Impacto",
      fields: [
        { name: "eyebrow", type: "text", label: "Chapéu", required: true },
        { name: "title", type: "text", label: "Título", required: true },
        { name: "statement", type: "textarea", label: "Declaração", required: true },
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
