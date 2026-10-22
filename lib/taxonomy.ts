/**
 * Taxonomia fechada do portfólio.
 *
 * Vive aqui, e não dentro de collections/Projects.ts, porque as duas pontas precisam
 * dela: o CMS monta o select, e o filtro de /portfolio lista todas as opções mesmo as
 * que ainda não têm projeto — é o que faz a página comunicar a extensão do trabalho da
 * Move em vez de só o que já foi cadastrado. Um componente cliente não pode importar o
 * arquivo da collection sem arrastar o Payload para o bundle do navegador.
 *
 * Segmento saiu daqui e virou collection (collections/ProjectSegments.ts), porque a
 * Move precisa criar valor novo sem deploy. Ecossistema fica: cada valor tem cor e
 * grafismo presos a ele, e um valor fora dos mapas cairia num fallback silencioso.
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
