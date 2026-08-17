/**
 * Taxonomias fechadas do portfólio.
 *
 * Vivem aqui, e não dentro de collections/Projects.ts, porque as duas pontas precisam
 * delas: o CMS monta os selects, e o filtro de /portfolio lista todas as opções mesmo
 * as que ainda não têm projeto — é o que faz a página comunicar a extensão do trabalho
 * da Move em vez de só o que já foi cadastrado. Um componente cliente não pode importar
 * o arquivo da collection sem arrastar o Payload para o bundle do navegador.
 */

/**
 * Cada ecossistema tem uma cor fixa em `ECOSYSTEM_SURFACE` (lib/palette.ts) e um
 * grafismo em `ECOSYSTEM_ICON` (lib/filterIcons.ts). Ao acrescentar um valor aqui,
 * acrescente nos dois mapas também, senão ele cai no fallback Açaí.
 */
export const ECOSYSTEMS = [
  "Meio Ambiente",
  "Educação",
  "Direitos Humanos",
  "Cultura",
  "Finanças",
  "Saúde",
  "Empreendedorismo",
] as const;

/** Natureza da organização atendida — mesma taxonomia do site antigo. */
export const SEGMENTS = [
  "Agência de Cooperação Internacional",
  "Empresa",
  "Fundação ou Instituto Empresarial",
  "Fundação ou Instituto Familiar",
  "Governo",
  "Negócio de Impacto",
  "Organização de Sociedade Civil",
  "Organismo Internacional",
  "Outros",
] as const;
