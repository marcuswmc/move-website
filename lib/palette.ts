/**
 * A tabela de contraste do guia oficial, em código.
 *
 * O guia (docs/brand-guide-cores.md) define, para cada cor de fundo, qual cor de
 * tipografia é recomendada — e quais combinações evitar. Deixar essa regra espalhada
 * pelos componentes é como ela se perde: alguém escolhe um fundo bonito e escreve por
 * cima a cor que parecia boa na hora. Aqui cada superfície já vem com o texto que o
 * guia manda usar, então "escolher a cor" e "escolher o contraste" são a mesma decisão.
 *
 * As classes são escritas por extenso de propósito: o Tailwind não enxerga nomes de
 * classe montados em runtime, então `bg-move-${cor}` não geraria CSS.
 *
 * Luz (`move-light`) não aparece aqui: o guia a trata como acento gráfico pequeno e o
 * cliente pediu explicitamente para não usá-la como fundo de componente.
 */

export type SurfaceName = "purple" | "yellow" | "periwinkle" | "coral" | "sand" | "mint" | "green";

export type Surface = {
  /** Nome oficial da cor no guia. */
  label: string;
  /** Fundo sólido. */
  bg: string;
  /** Texto principal — o "uso recomendado" da tabela. */
  text: string;
  /** Texto secundário, no mesmo tom do principal. */
  muted: string;
  /** Borda discreta sobre o mesmo fundo. */
  border: string;
  /** Chip: fundo da cor com o texto correspondente, para tags e pílulas. */
  chip: string;
};

/** Superfícies cujo texto recomendado é Branco / Off White. */
const onDark = (label: string, bg: string, border: string): Surface => ({
  label,
  bg,
  text: "text-white",
  muted: "text-white/70",
  border,
  chip: `${bg} text-white`,
});

/** Superfícies cujo texto recomendado é Preto. */
const onLight = (label: string, bg: string, border: string): Surface => ({
  label,
  bg,
  text: "text-move-black",
  muted: "text-move-black/65",
  border,
  chip: `${bg} text-move-black`,
});

export const SURFACES: Record<SurfaceName, Surface> = {
  // Recomendado: Branco ou Off White · Evitar: Preto
  purple: onDark("Açaí", "bg-move-purple", "border-white/20"),
  green: onDark("Mata", "bg-move-green", "border-white/20"),
  // Recomendado: Branco / Off White · Alternativo: Preto
  coral: onDark("Goiaba", "bg-move-coral", "border-white/25"),
  // Recomendado: Preto · Alternativo: Branco / Off White
  yellow: onLight("Ipê", "bg-move-yellow", "border-move-black/15"),
  periwinkle: onLight("Lavanda", "bg-move-periwinkle", "border-move-black/15"),
  sand: onLight("Areia", "bg-move-sand", "border-move-black/15"),
  mint: onLight("Capim", "bg-move-mint", "border-move-black/15"),
};

/**
 * Cada ecossistema tem uma cor fixa do sistema. É o que faz uma listagem longa ficar
 * navegável: a cor carrega a informação antes da leitura do rótulo. Um por superfície,
 * sem repetição — se surgir um ecossistema novo, escolha uma cor ainda não usada aqui
 * ou aceite a repetição conscientemente.
 */
export const ECOSYSTEM_SURFACE: Record<string, SurfaceName> = {
  "Meio Ambiente": "green",
  Educação: "periwinkle",
  "Direitos Humanos": "coral",
  Cultura: "yellow",
  Finanças: "sand",
  Saúde: "mint",
  Empreendedorismo: "purple",
};

/** Superfície de um ecossistema, com Açaí como fallback para valores desconhecidos. */
export const surfaceForEcosystem = (ecosystem: string): Surface =>
  SURFACES[ECOSYSTEM_SURFACE[ecosystem] ?? "purple"];

/** Superfície por nome, com Açaí como fallback. */
export const surfaceByName = (name?: string | null): Surface =>
  SURFACES[(name as SurfaceName) ?? "purple"] ?? SURFACES.purple;
