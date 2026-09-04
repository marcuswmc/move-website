/**
 * Roster do carrossel "Com quem trabalhamos", na ordem em que aparece na home.
 *
 * É a única lista de parceiros do repositório: tanto `scripts/seed.ts` (carga
 * inicial) quanto `scripts/seed-partners.ts` (sincronização) leem daqui. `file` é o
 * arquivo em `public/partners/` e também o nome com que a mídia é gravada — por isso
 * todos seguem o mesmo padrão de slug. `caseId` liga o parceiro ao projeto de mesmo
 * id em `data/site.ts`, e só é lido pelo seed inicial.
 *
 * A ordem aqui não manda no site depois da primeira carga: quem manda é o campo
 * "Ordem" de cada parceiro no admin. Rodar `pnpm seed:partners` reescreve esse campo
 * a partir desta lista.
 */
export const partners: { name: string; file: string; caseId?: string }[] = [
  { name: "UNICEF", file: "unicef.webp", caseId: "unicef" },
  { name: "AMAZ", file: "amaz.webp" },
  { name: "GIFE", file: "gife.webp" },
  { name: "Rumo", file: "rumo.webp", caseId: "rumo-logistica" },
  { name: "Instituto Alana", file: "instituto-alana.webp", caseId: "instituto-alana" },
  { name: "Bonde", file: "bonde.webp" },
  { name: "Freedom Fund", file: "freedom-fund.webp" },
  { name: "Instituto Arapyaú", file: "instituto-arapyau.webp", caseId: "instituto-arapyau" },
  { name: "Ação da Cidadania", file: "acao-da-cidadania.webp" },
  { name: "Itaú Social", file: "itau-social.webp", caseId: "itau-social" },
  { name: "Instituto ACP", file: "instituto-acp.webp", caseId: "instituto-acp" },
  { name: "Fundo Vale", file: "fundo-vale.webp" },
];
