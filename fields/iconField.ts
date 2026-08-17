import type { SelectField } from "payload";

/**
 * Grafismos da marca (public/brand/icons). Select fechado de propósito: o desenho
 * dos cards depende de SVGs monocromáticos desse conjunto, então texto livre aqui
 * quebraria o layout. Para adicionar um ícone novo, coloque o arquivo na pasta e
 * acrescente a opção aqui.
 */
export const BRAND_ICONS = [
  "Group 2",
  "Group 3",
  "Group 4",
  "Group 5",
  "Group 6",
  "Group 7",
  "Group 8",
  "Group 9",
  "Group 10",
  "Group 11",
  "Group 12",
  "Group 13",
  "Group 14",
  "Group 15",
  "Group 16",
] as const;

export const iconField = (name = "icon"): SelectField => ({
  name,
  type: "select",
  label: "Grafismo",
  required: true,
  options: BRAND_ICONS.map((icon) => ({
    label: icon.replace("Group ", "Grafismo "),
    value: `/brand/icons/${icon}.svg`,
  })),
  admin: {
    description: "SVG da marca exibido no card.",
  },
});
