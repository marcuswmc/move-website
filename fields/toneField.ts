import type { SelectField } from "payload";

import { SURFACE_AUTO, SURFACE_OPTIONS } from "@/lib/palette";

type ToneFieldArgs = {
  name?: string;
  label?: string;
  description?: string;
  defaultValue: string;
  options: { label: string; value: string }[];
};

/**
 * Tons são selects fechados, nunca texto livre: cada valor corresponde a uma
 * combinação de classes já escrita no componente. Um valor fora da lista
 * renderizaria um card sem estilo. A paleta segue docs/brand-guide-cores.md.
 */
const toneField = ({ name = "tone", label = "Tom", description, defaultValue, options }: ToneFieldArgs): SelectField => ({
  name,
  type: "select",
  label,
  required: true,
  defaultValue,
  options,
  admin: { position: "sidebar", ...(description ? { description } : {}) },
});

/** Tons suportados pelos cards empilhados da home (components/PortfolioStack.tsx). */
export const showcaseToneField = (): SelectField =>
  toneField({
    defaultValue: "light",
    options: [
      { label: "Açaí (roxo, texto claro)", value: "purple" },
      { label: "Branco (texto roxo)", value: "light" },
      { label: "Ipê (amarelo, texto roxo)", value: "yellow" },
    ],
  });

/**
 * Cor de fundo do card de projeto em /portfolio (components/ProjectCard.tsx).
 *
 * O card não usa mais fotografia de fundo: é um bloco de cor da paleta, e é aqui que
 * a cor se escolhe. "Automático" mantém a cor fixa do ecossistema (`ECOSYSTEM_SURFACE`
 * em lib/palette.ts) — o padrão, para uma listagem nova já sair legível por cor sem
 * ninguém decidir projeto a projeto. As demais opções sobrepõem caso a caso.
 *
 * A lista de cores vem de `SURFACE_OPTIONS`, então cada opção já traz junto a cor de
 * tipografia que o guia manda usar: não há como escolher um fundo e errar o contraste.
 */
export const projectCardColorField = (): SelectField =>
  toneField({
    name: "cardColor",
    label: "Cor do card",
    description: "Fundo do card em /portfolio. Em automático, segue a cor do ecossistema.",
    defaultValue: SURFACE_AUTO,
    options: [{ label: "Automático (cor do ecossistema)", value: SURFACE_AUTO }, ...SURFACE_OPTIONS],
  });
