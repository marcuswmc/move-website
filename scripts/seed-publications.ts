import config from "@payload-config";
import { getPayload } from "payload";

import { publications } from "../data/site";
import { lexicalFromPlainText } from "../lib/lexical";
import type { Publication } from "../payload-types";

/**
 * Troca os três placeholders do acervo pelas publicações reais de `data/site.ts`,
 * todas destacadas na home.
 *
 * Não apaga o site como `pnpm seed` faria: remove só as entradas de exemplo
 * (`publicacao-01…03`), atualiza pelo slug o que já existe e cria o que falta —
 * então rodar duas vezes dá no mesmo, e nada que a Move já editou no admin se perde.
 *
 *   pnpm seed:publications
 */

/** Os placeholders criados pelo seed original, sem correspondente no acervo real. */
const PLACEHOLDER_SLUGS = ["publicacao-01", "publicacao-02", "publicacao-03"];

const payload = await getPayload({ config });

const removed = await payload.delete({
  collection: "publications",
  where: { slug: { in: PLACEHOLDER_SLUGS } },
});

if (removed.docs.length > 0) {
  payload.logger.info(`Removidos ${removed.docs.length} exemplos: ${removed.docs.map((d) => d.slug).join(", ")}`);
}

// As categorias são criadas pelo seed completo; aqui só resolvemos o id, criando a
// que faltar para o script também funcionar numa base que nunca viu `pnpm seed`.
const categoryIdByName = new Map<string, string>();

for (const name of new Set(publications.map((item) => item.category))) {
  const { docs } = await payload.find({
    collection: "publication-categories",
    where: { name: { equals: name } },
    limit: 1,
    pagination: false,
  });

  const existing = docs[0];
  if (existing) {
    categoryIdByName.set(name, existing.id);
    continue;
  }

  payload.logger.warn(`Categoria "${name}" não existe no CMS — criando.`);
  const created = await payload.create({
    collection: "publication-categories",
    data: {
      name,
      slug: name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      color: "purple",
      order: 99,
    },
  });

  categoryIdByName.set(name, created.id);
}

for (const item of publications) {
  const categoryId = categoryIdByName.get(item.category);

  const data = {
    title: item.title,
    slug: item.id,
    synopsis: item.synopsis,
    content: item.content ? (lexicalFromPlainText(item.content) as unknown as Publication["content"]) : undefined,
    cover: { externalUrl: item.cover.src, alt: item.cover.alt },
    // Os três materiais moram fora do site: a página apresenta e o botão leva pra lá.
    type: "external" as const,
    externalUrl: item.externalUrl,
    actionLabel: item.actionLabel,
    publishedAt: new Date(`${item.publishedAt}T12:00:00.000Z`).toISOString(),
    author: item.author,
    categories: categoryId ? [categoryId] : [],
    featured: true,
    _status: "published" as const,
  };

  const { docs } = await payload.find({
    collection: "publications",
    where: { slug: { equals: item.id } },
    limit: 1,
    pagination: false,
    draft: true,
  });

  const current = docs[0];

  if (current) {
    await payload.update({ collection: "publications", id: current.id, data });
    payload.logger.info(`Atualizada: ${item.title}`);
    continue;
  }

  await payload.create({ collection: "publications", data });
  payload.logger.info(`Criada: ${item.title}`);
}

payload.logger.info("Publicações da home atualizadas.");

process.exit(0);
