/**
 * Apaga o andaime que a importação do WordPress deixou nos documentos.
 *
 * Três campos sobraram na collection de projetos:
 *
 *   migrationNotes — bilhetes do importador ("ecossistema: 2 termos no WordPress",
 *                    "Serviço do texto difere da taxonomia"), num textarea visível na
 *                    barra lateral de 79 projetos. Falam de um site que não existe
 *                    mais para quem só quer editar um case.
 *   wordpressId    — o id do post na base antiga.
 *   sourceUrl      — o endereço do post na base antiga.
 *
 * Os dois últimos nem estão declarados em collections/Projects.ts: o Payload os
 * ignora na leitura, mas eles continuam no Mongo. Nada no site os consulta.
 *
 * O conteúdo é exportado para tmp/backup antes de sair, porque algumas notas eram
 * pendências editoriais de verdade ("Ecossistema principal requer revisão") e a Move
 * pode querer lê-las uma última vez.
 *
 * Por padrão só relata. `MOVE_CLEANUP_APPLY=1` escreve.
 *
 *   pnpm payload run scripts/remove-wordpress-migration-fields.ts
 *   MOVE_CLEANUP_APPLY=1 pnpm payload run scripts/remove-wordpress-migration-fields.ts
 */
import config from "@payload-config";
import type { MongooseAdapter } from "@payloadcms/db-mongodb";
import fs from "node:fs";
import { getPayload } from "payload";

const apply = process.env.MOVE_CLEANUP_APPLY === "1";

const FIELDS = ["migrationNotes", "wordpressId", "sourceUrl"] as const;

const payload = await getPayload({ config });
const db = (payload.db as MongooseAdapter).connection.db!;

const projects = db.collection("projects");
// As versões guardam o documento inteiro sob `version`, então o campo vive lá também.
const versions = db.collection("_projects_versions");

const present = await projects
  .find({ $or: FIELDS.map((field) => ({ [field]: { $exists: true } })) })
  .project({ slug: 1, client: 1, migrationNotes: 1, wordpressId: 1, sourceUrl: 1 })
  .toArray();

const versionCount = await versions.countDocuments({
  $or: FIELDS.map((field) => ({ [`version.${field}`]: { $exists: true } })),
});

console.log(`projetos com campos da migração: ${present.length}`);
console.log(`versões com campos da migração: ${versionCount}`);

for (const field of FIELDS) {
  const n = await projects.countDocuments({ [field]: { $exists: true } });
  console.log(`  ${field}: ${n}`);
}

if (!apply) {
  console.log("\nModo leitura. Nada foi alterado. Use MOVE_CLEANUP_APPLY=1 para aplicar.");
  await payload.destroy();
  process.exit(0);
}

fs.mkdirSync("tmp/backup", { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `tmp/backup/migration-fields-${stamp}.json`;
fs.writeFileSync(backup, JSON.stringify(present, null, 1));
console.log(`\nConteúdo exportado para ${backup}`);

const unset = Object.fromEntries(FIELDS.map((field) => [field, ""]));
const unsetVersion = Object.fromEntries(FIELDS.map((field) => [`version.${field}`, ""]));

const a = await projects.updateMany({}, { $unset: unset });
const b = await versions.updateMany({}, { $unset: unsetVersion });

console.log(`projetos atualizados: ${a.modifiedCount}`);
console.log(`versões atualizadas: ${b.modifiedCount}`);

await payload.destroy();
