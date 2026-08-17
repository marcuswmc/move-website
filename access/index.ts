import type { Access } from "payload";

/** Leitura pública — o site é estático e aberto. */
export const anyone: Access = () => true;

/** Escrita: apenas usuários logados no painel. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);

/**
 * Leitura de collections com drafts: visitante anônimo só enxerga o que foi
 * publicado; quem está logado no admin enxerga rascunhos também (necessário
 * para o preview funcionar).
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};
