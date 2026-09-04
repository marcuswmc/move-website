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
  /** Véu translúcido para pastilhas e divisórias *dentro* de um card desta cor. */
  soft: string;
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
  soft: "bg-white/15",
  chip: `${bg} text-white`,
});

/** Superfícies cujo texto recomendado é Preto. */
const onLight = (label: string, bg: string, border: string): Surface => ({
  label,
  bg,
  text: "text-move-black",
  muted: "text-move-black/65",
  border,
  soft: "bg-move-black/10",
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

/**
 * Ordem em que a paleta aparece nos selects do admin: principais antes das de apoio,
 * como no guia. `SURFACES` é um objeto e a ordem das chaves ali não é contrato.
 */
const SURFACE_ORDER: SurfaceName[] = ["purple", "yellow", "periwinkle", "coral", "sand", "mint", "green"];

/**
 * Opções da paleta para campos `select` do Payload, com o rótulo oficial da cor e a
 * cor de tipografia que vem junto — para quem edita saber o que está escolhendo sem
 * abrir o guia. Sai daqui para não existir uma segunda lista de cores a manter.
 */
export const SURFACE_OPTIONS: { label: string; value: SurfaceName }[] = SURFACE_ORDER.map((value) => ({
  label: `${SURFACES[value].label} (texto ${SURFACES[value].text === "text-white" ? "claro" : "preto"})`,
  value,
}));

/** Valor que devolve a escolha ao ecossistema, em vez de fixar uma cor no documento. */
export const SURFACE_AUTO = "auto";

/**
 * Cor de um card de projeto: a escolhida no CMS, ou a do ecossistema quando o campo
 * está em "automático" — que é o padrão e o que mantém a listagem legível por cor sem
 * ninguém precisar decidir nada projeto a projeto.
 */
export const surfaceForProject = (color: string | null | undefined, ecosystem: string): Surface =>
  !color || color === SURFACE_AUTO ? surfaceForEcosystem(ecosystem) : surfaceByName(color);
