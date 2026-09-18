import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

import { TAG, type ContentTag } from "@/lib/cache";

/**
 * Sem isto, quem edita no /admin espera o prazo do cache para ver a mudança no site,
 * e o prazo precisa ser curto o bastante para não frustrar — o que obriga o site
 * inteiro a ser recalculado de tempos em tempos, mesmo sem ninguém ter mudado nada.
 * Invalidando por tag na hora de salvar, o cache pode durar muito e ainda assim a
 * edição aparece na publicação seguinte.
 *
 * `revalidateTag` só existe dentro de um request do Next. Os scripts de seed e de
 * importação rodam pelo CLI do Payload, fora desse contexto, e ali a chamada estoura
 * — daí o try/catch. Nesses casos não há cache a invalidar, porque não há servidor.
 */
function invalidate(tags: ContentTag[]) {
  for (const tag of tags) {
    try {
      // O segundo argumento é obrigatório desde o Next 16. "max" é a purga imediata,
      // a mesma semântica da forma antiga de um argumento só. `updateTag`, a outra
      // opção, recusa-se a rodar fora de uma Server Action — e o admin do Payload
      // escreve por route handlers.
      revalidateTag(tag, "max");
    } catch {
      // Fora de um request (CLI do Payload). Não há cache a invalidar.
    }
  }
}

/** Para `hooks.afterChange` e `hooks.afterDelete` de uma collection. */
export function revalidatesCollection(...tags: ContentTag[]) {
  const afterChange: CollectionAfterChangeHook = ({ doc }) => {
    invalidate(tags);
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    invalidate(tags);
    return doc;
  };

  return { afterChange: [afterChange], afterDelete: [afterDelete] };
}

/** Para `hooks.afterChange` de um global. */
export function revalidatesGlobal(...tags: ContentTag[]) {
  const afterChange: GlobalAfterChangeHook = ({ doc }) => {
    invalidate(tags);
    return doc;
  };

  return { afterChange: [afterChange] };
}

/**
 * Uma mídia trocada muda o endereço resolvido em qualquer página que a exiba, sem
 * que o documento que a referencia seja salvo. Por isso o upload invalida tudo o que
 * pode conter imagem, e não apenas a própria collection.
 */
export const MEDIA_DEPENDENTS: ContentTag[] = [
  TAG.media,
  TAG.projects,
  TAG.publications,
  TAG.team,
  TAG.partners,
  TAG.home,
  TAG.theory,
  TAG.contactPage,
  TAG.publicationsPage,
  TAG.portfolioPage,
];
