import { cache } from "react";
import { unstable_cache } from "next/cache";

/**
 * Uma tag por collection e por global. A leitura declara de que documentos depende,
 * o CMS invalida a tag ao salvar (ver `lib/revalidate.ts`), e só o que de fato mudou
 * é recalculado — em vez de todo o site expirar junto a cada 60 segundos.
 *
 * `media` entra em quase tudo porque uma imagem trocada muda o `src` resolvido em
 * qualquer página que a exiba, sem que o documento que a referencia seja tocado.
 */
export const TAG = {
  projects: "projects",
  services: "services",
  publications: "publications",
  publicationCategories: "publication-categories",
  team: "team-members",
  partners: "partners",
  media: "media",
  home: "home",
  theory: "theory-of-change",
  publicationsPage: "publications-page",
  portfolioPage: "portfolio-page",
  contactPage: "contact-page",
  siteSettings: "site-settings",
} as const;

export type ContentTag = (typeof TAG)[keyof typeof TAG];

/**
 * Rede de segurança para o caso de uma invalidação se perder — uma edição feita
 * direto no banco, um hook que falhou. Com as tags ligadas, este prazo quase nunca
 * é o que devolve o conteúdo novo: ele só existe para o desvio não ser permanente.
 * Dez minutos em vez dos sessenta segundos anteriores reduz o trabalho repetido sem
 * transformar uma invalidação perdida num problema de uma hora.
 */
const FALLBACK_TTL = 600;

/**
 * `unstable_cache` guarda o resultado entre requests e entre instâncias; `cache()`
 * do React deduplica as chamadas dentro do mesmo request — o cabeçalho e o rodapé
 * leem o mesmo global sem duas idas ao banco. As duas camadas resolvem problemas
 * diferentes e por isso se acumulam.
 */
export function cachedRead<Read extends (...args: never[]) => Promise<unknown>>(
  read: Read,
  key: string,
  tags: ContentTag[],
): Read {
  // `unstable_cache` devolve a mesma assinatura que recebe; `cache()` do React
  // preserva-a também. O genérico existe para que os parâmetros de quem chama —
  // `getProject(slug)`, `getRelatedProjects(slug, ecossistemas, limite)` — não se
  // percam pelo caminho.
  return cache(unstable_cache(read as never, [key], { revalidate: FALLBACK_TTL, tags })) as Read;
}
