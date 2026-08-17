/**
 * Grafismos dos filtros de /portfolio.
 *
 * A lista de ecossistemas é fechada (collections/Projects.ts), então cada um ganha um
 * grafismo fixo — o desenho vira um segundo canal de leitura, junto com a cor definida
 * em lib/palette.ts. Serviço é texto livre no CMS e chega combinado ("Teoria de Mudança
 * e Planejamento Estratégico"), por isso ali a escolha é por palavra-chave, na ordem
 * das regras, com um grafismo neutro para o que não casar.
 */

const ICON = (name: string) => `/brand/icons/${name}.svg`;

/** Grafismo neutro para valores fora dos mapas. */
const FALLBACK_ICON = ICON("Group 12");

export const ECOSYSTEM_ICON: Record<string, string> = {
  "Meio Ambiente": ICON("Group 4"),
  Educação: ICON("Group 6"),
  "Direitos Humanos": ICON("Group 9"),
  Cultura: ICON("Group 11"),
  Finanças: ICON("Group 13"),
  Saúde: ICON("Group 5"),
  Empreendedorismo: ICON("Group 15"),
};

export const iconForEcosystem = (ecosystem: string): string => ECOSYSTEM_ICON[ecosystem] ?? FALLBACK_ICON;

const SERVICE_ICON_RULES: [RegExp, string][] = [
  [/teoria de mudan/i, ICON("Group 2")],
  [/planejamento/i, ICON("Group 3")],
  [/avalia/i, ICON("Group 7")],
  [/monitoramento/i, ICON("Group 8")],
  [/facilita/i, ICON("Group 10")],
  [/diagn/i, ICON("Group 14")],
  [/estudo|sistematiza/i, ICON("Group 16")],
  [/forma/i, ICON("Group 11")],
];

export const iconForService = (service: string): string =>
  SERVICE_ICON_RULES.find(([pattern]) => pattern.test(service))?.[1] ?? FALLBACK_ICON;
