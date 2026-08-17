import type { SelectField } from "payload";

type ToneFieldArgs = {
  name?: string;
  label?: string;
  defaultValue: string;
  options: { label: string; value: string }[];
};

/**
 * Tons são selects fechados, nunca texto livre: cada valor corresponde a uma
 * combinação de classes já escrita no componente. Um valor fora da lista
 * renderizaria um card sem estilo. A paleta segue docs/brand-guide-cores.md.
 */
const toneField = ({ name = "tone", label = "Tom", defaultValue, options }: ToneFieldArgs): SelectField => ({
  name,
  type: "select",
  label,
  required: true,
  defaultValue,
  options,
  admin: { position: "sidebar" },
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
