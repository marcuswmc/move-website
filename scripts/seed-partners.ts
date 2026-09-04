import { statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import config from "@payload-config";
import { getPayload } from "payload";
import type { Payload } from "payload";

import { partners } from "../data/partners";

/**
 * Sincroniza o carrossel "Com quem trabalhamos" com `data/partners.ts`.
 *
 *   pnpm seed:partners              nome, logo e ordem
 *   LOGOS=1 pnpm seed:partners      idem, reenviando os arquivos de public/partners
 *   PRUNE=1 pnpm seed:partners      idem, apagando quem está no CMS e fora da lista
 *
 * As opções vão por variável de ambiente porque `payload run` não repassa os
 * argumentos da linha de comando para o script — um `--prune` seria engolido em
 * silêncio, e o script diria que apagou sem ter apagado.
 *
 * Casa pelo nome em vez de recriar: os parceiros que já existem mantêm o id — e com
 * ele o vínculo feito no admin com os projetos do portfólio. Quem está no CMS mas
 * fora da lista, por padrão, só vai para o fim da fila: tirar um cliente do ar é
 * decisão da Move, e o script não a toma sozinho. `pnpm seed` faria o mesmo
 * apagando o site inteiro antes.
 */
const logoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "partners");

/** Reenvia os logos mesmo quando o parceiro já tem um — para trocar a arte. */
const forceLogos = process.env.LOGOS === "1";

/** Apaga quem sobrou fora da lista, em vez de empurrar para o fim do carrossel. */
const prune = process.env.PRUNE === "1";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Reproduz o `slugify` do Payload (utilities/slugify), que é quem preenche o campo
 * quando ninguém escreve nada. Ele não dobra os acentos: apaga a letra acentuada e
 * "Ação da Cidadania" vira `ao-da-cidadania`. Serve só para reconhecer um slug
 * automático e poder corrigi-lo sem pisar em cima de um que a Move escreveu à mão.
 */
const autoSlug = (value: string) => value.trim().replace(/ /g, "-").replace(/[^\w-]+/g, "").toLowerCase();

/**
 * `amaz-1.webp` e `amaz.webp` são o mesmo logo. Ao substituir um upload o Payload
 * numera o arquivo novo, porque o antigo ainda ocupa o nome na hora da escrita — e
 * na rodada seguinte o número aumentaria de novo. Comparar sem o sufixo mantém a
 * execução idempotente: um logo já enviado não sobe outra vez.
 */
const isSameLogo = (filename: string | null | undefined, file: string) =>
  typeof filename === "string" &&
  path.basename(filename, path.extname(filename)).replace(/-\d+$/, "") ===
    path.basename(file, path.extname(file));

async function upsertLogo(
  payload: Payload,
  file: string,
  alt: string,
  linkedId?: string | null,
): Promise<string> {
  const filePath = path.join(logoDir, file);
  statSync(filePath); // falha cedo e com o caminho no erro se o arquivo sumiu

  const linked = linkedId
    ? await payload.findByID({ collection: "media", id: linkedId, disableErrors: true })
    : null;

  const current =
    linked ??
    (
      await payload.find({
        collection: "media",
        where: { filename: { like: `${path.basename(file, path.extname(file))}` } },
        limit: 1,
        pagination: false,
      })
    ).docs[0];

  if (!current) {
    const created = await payload.create({ collection: "media", data: { alt }, filePath });
    return created.id;
  }

  if (!forceLogos && isSameLogo(current.filename, file) && current.alt === alt) return current.id;

  const updated = await payload.update({ collection: "media", id: current.id, data: { alt }, filePath });
  return updated.id;
}

const payload = await getPayload({ config });

const current = await payload.find({
  collection: "partners",
  limit: 0,
  pagination: false,
  draft: true,
  depth: 0,
});

const byName = new Map(current.docs.map((doc) => [doc.name.trim().toLowerCase(), doc]));
const seen = new Set<string>();

for (const [index, partner] of partners.entries()) {
  const alt = `Logo ${partner.name}`;
  const slug = slugify(partner.name);
  const existing = byName.get(partner.name.trim().toLowerCase());
  const linkedId = typeof existing?.logo?.media === "string" ? existing.logo.media : null;
  const logo = { media: await upsertLogo(payload, partner.file, alt, linkedId), alt };

  if (existing) {
    seen.add(existing.id);
    // O slug identifica o cliente em /portfolio?cliente=… . Só é reescrito quando
    // falta ou quando ainda é o automático do Payload, para não atropelar um
    // endereço que a Move tenha definido no admin.
    const keepSlug = Boolean(existing.slug) && existing.slug !== autoSlug(partner.name);

    await payload.update({
      collection: "partners",
      id: existing.id,
      data: {
        logo,
        order: index,
        _status: "published",
        ...(keepSlug ? {} : { slug, generateSlug: false }),
      },
    });
    payload.logger.info(`${index + 1}. ${partner.name} — atualizado`);
    continue;
  }

  await payload.create({
    collection: "partners",
    data: { name: partner.name, slug, generateSlug: false, logo, order: index, _status: "published" },
  });
  payload.logger.info(`${index + 1}. ${partner.name} — criado`);
}

for (const [index, doc] of current.docs.filter((doc) => !seen.has(doc.id)).entries()) {
  if (!prune) {
    await payload.update({
      collection: "partners",
      id: doc.id,
      data: { order: partners.length + index },
    });
    payload.logger.warn(`Fora da lista, movido para o fim do carrossel: ${doc.name}`);
    continue;
  }

  // Um projeto que ainda aponte para este parceiro ficaria com o card sem logo, e a
  // ligação some sem ninguém perceber. Nesse caso o parceiro fica: quem decide
  // desligar o projeto é a Move, no admin.
  const linked = await payload.find({
    collection: "projects",
    where: { partner: { equals: doc.id } },
    limit: 0,
    pagination: false,
    draft: true,
    depth: 0,
  });

  if (linked.docs.length > 0) {
    payload.logger.error(
      `${doc.name} não foi apagado: ainda é o cliente de ${linked.docs.length} projeto(s) — ${linked.docs
        .map((project) => project.client)
        .join(", ")}.`,
    );
    continue;
  }

  // O logo continua na biblioteca de mídias: apagar o arquivo do Blob é
  // irreversível, e ele não atrapalha ninguém parado lá.
  await payload.delete({ collection: "partners", id: doc.id });
  payload.logger.warn(`Fora da lista, removido: ${doc.name}`);
}

payload.logger.info(`${partners.length} parceiros na ordem pedida.`);

process.exit(0);
