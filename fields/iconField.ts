import type { SelectField } from "payload";

/**
 * Ícones dos serviços (public/brand/services_icons). Select fechado de propósito:
 * o valor gravado é o caminho do arquivo, então texto livre aqui geraria card com
 * imagem quebrada. Para acrescentar um ícone, coloque o PNG na pasta e adicione a
 * entrada abaixo.
 *
 * Os nomes de arquivo são ASCII, sem acento nem espaço, de propósito: o macOS grava
 * acento em NFD e o Linux do build não normaliza, então "Avaliação.png" resolve em
 * dev e dá 404 em produção.
 */
export const SERVICE_ICONS = [
  { file: "planejamento", label: "Planejamento" },
  { file: "teoria-de-mudanca", label: "Teoria de mudança" },
  { file: "avaliacao", label: "Avaliação" },
  { file: "estudo", label: "Estudo" },
  { file: "facilitacoes", label: "Facilitação" },
  { file: "oficinas", label: "Formação (oficinas)" },
  { file: "publicacoes", label: "Publicação" },
  { file: "paineis-de-visualizacoes", label: "Painel de dados" },
] as const;

export const serviceIconPath = (file: (typeof SERVICE_ICONS)[number]["file"]) =>
  `/brand/services_icons/${file}.png`;

export const iconField = (name = "icon"): SelectField => ({
  name,
  type: "select",
  label: "Ícone",
  required: true,
  options: SERVICE_ICONS.map((icon) => ({
    label: icon.label,
    value: serviceIconPath(icon.file),
  })),
  admin: {
    description: "Ícone exibido no card do serviço.",
  },
});
