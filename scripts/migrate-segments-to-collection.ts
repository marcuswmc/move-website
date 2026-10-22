/**
 * Move os segmentos dos projetos de lista fechada para a collection.
 *
 * `Projects.segments` era um `select` que guardava o texto ("Empresa"). Virou
 * `relationship` para `project-segments`, e passa a guardar o id. Este script cria os
 * segmentos e reescreve as referências nos documentos que já existem.
 *
 * O que faz:
 *   1. cria os segmentos que faltam (nome + slug + ordem), reaproveitando os que já
 *      estiverem lá — é idempotente;
 *   2. reescreve `segments` nos projetos e nas versões, trocando nome por id;
 *   3. confere que nenhum projeto ficou sem segmento.
 *
 * As versões entram junto porque guardam o documento inteiro sob `version`: sem elas,
 * restaurar uma versão antiga no admin gravaria texto num campo que agora espera id.
 *
 * Tudo passa pelo driver, não pela API local do Payload: `payload.create` envolve a
 * escrita numa transação, e o Atlas M0 as aborta de forma intermitente
 * (`TransientTransactionError`). Escrever direto também garante que a referência
 * entre no documento como ObjectId — é o que o campo de relação espera na leitura.
 *
 * Por padrão só relata. `MOVE_SEGMENTS_APPLY=1` escreve, com backup antes.
 *
 *   pnpm payload run scripts/migrate-segments-to-collection.ts
 *   MOVE_SEGMENTS_APPLY=1 pnpm payload run scripts/migrate-segments-to-collection.ts
 */
import config from "@payload-config";
import type { MongooseAdapter } from "@payloadcms/db-mongodb";
import fs from "node:fs";
import { getPayload } from "payload";

const apply = process.env.MOVE_SEGMENTS_APPLY === "1";

/**
 * A lista fechada que existia em lib/taxonomy.ts, na ordem em que aparecia no filtro.
 * Os dois últimos não têm projeto hoje, mas entram: o filtro de /portfolio mostra a
 * lista inteira de propósito, e tirá-los aqui mudaria a página sem ninguém ter pedido.
 */
const SEGMENTS = [
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

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const payload = await getPayload({ config });
const connection = (payload.db as MongooseAdapter).connection;
const { ObjectId } = connection.base.Types;
const db = connection.db!;
const projects = db.collection("projects");
const versions = db.collection("_projects_versions");

/** Nomes ainda gravados como texto nos projetos — inclusive algum fora da lista. */
const stored = new Set<string>();
const docs = await projects.find({}, { projection: { segments: 1, slug: 1 } }).toArray();
for (const doc of docs) {
  for (const value of (doc.segments ?? []) as unknown[]) {
    if (typeof value === "string" && !/^[0-9a-f]{24}$/i.test(value)) stored.add(value);
  }
}

const unknown = [...stored].filter((name) => !SEGMENTS.includes(name as (typeof SEGMENTS)[number]));

console.log(`projetos: ${docs.length}`);
console.log(`nomes de segmento gravados como texto: ${stored.size}`);
if (unknown.length) {
  console.log("\nFora da lista fechada — serão criados assim mesmo, para não perder a classificação:");
  unknown.forEach((name) => console.log(`  ${name}`));
}

const toCreate = [...SEGMENTS, ...unknown];
const segmentsCollection = db.collection("project-segments");
const existing = await segmentsCollection.find({}, { projection: { name: 1 } }).toArray();
const byName = new Map(existing.map((segment) => [segment.name as string, segment._id]));

console.log(`\nsegmentos já na collection: ${existing.length}`);
console.log(`a criar: ${toCreate.filter((name) => !byName.has(name)).length}`);

/** Só o que ainda está como texto; um ObjectId já gravado fica onde está. */
const pending = docs.filter((doc) => ((doc.segments ?? []) as unknown[]).some((v) => typeof v === "string"));
const pendingVersions = await versions.countDocuments({ "version.segments": { $exists: true, $ne: [] } });
console.log(`projetos a reescrever: ${pending.length}`);
console.log(`versões a reescrever: ${pendingVersions}`);

if (!apply) {
  console.log("\nModo leitura. Nada foi alterado. Use MOVE_SEGMENTS_APPLY=1 para aplicar.");
  await payload.destroy();
  process.exit(0);
}

fs.mkdirSync("tmp/backup", { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.writeFileSync(`tmp/backup/projects-segments-${stamp}.json`, JSON.stringify(docs, null, 1));
console.log(`\nBackup em tmp/backup/projects-segments-${stamp}.json`);

// 1. criar o que falta
const now = new Date();
for (const [index, name] of toCreate.entries()) {
  if (byName.has(name)) continue;
  const { insertedId } = await segmentsCollection.insertOne({
    name,
    slug: slugify(name),
    order: index,
    createdAt: now,
    updatedAt: now,
  });
  byName.set(name, insertedId);
  console.log(`  criado: ${name}`);
}

// 2. trocar nome por id, nos projetos e nas versões
const rewrite = (values: unknown[]): unknown[] =>
  values.map((value) => (typeof value === "string" ? (byName.get(value) ?? value) : value)).filter(Boolean);

let changedProjects = 0;
for (const doc of pending) {
  const next = rewrite((doc.segments ?? []) as unknown[]);
  await projects.updateOne({ _id: doc._id }, { $set: { segments: next } });
  changedProjects++;
}

let changedVersions = 0;
for await (const version of versions.find({ "version.segments": { $exists: true, $ne: [] } })) {
  const current = (version.version?.segments ?? []) as unknown[];
  if (!current.some((value) => typeof value === "string")) continue;
  const next = rewrite(current);
  await versions.updateOne({ _id: version._id }, { $set: { "version.segments": next } });
  changedVersions++;
}

// 3. conferir
const orphans = await projects.countDocuments({ $or: [{ segments: { $size: 0 } }, { segments: { $exists: false } }] });
const leftovers = await projects.countDocuments({ segments: { $elemMatch: { $type: "string" } } });

console.log(`\nprojetos reescritos: ${changedProjects}`);
console.log(`versões reescritas: ${changedVersions}`);
console.log(`projetos sem segmento: ${orphans}`);
console.log(`valores que não viraram id: ${leftovers}`);

await payload.destroy();
