/**
 * Sobe para o Vercel Blob os arquivos de upload que hoje existem só em ./media.
 *
 *   pnpm migrate:media
 *
 * Contexto: a collection Media nasceu com `staticDir: "media"`, gravando em disco
 * local. Como /media está no .gitignore e o filesystem das functions da Vercel é
 * efêmero, os arquivos da carga inicial nunca chegaram a produção — os documentos no
 * Mongo estão corretos, faltava o binário no lugar de onde o site lê.
 *
 * O adaptador do Payload não adiciona sufixo aleatório ao nome e o campo `url` é
 * resolvido na leitura, então basta o arquivo chegar ao Blob com o mesmo pathname
 * para os registros atuais voltarem a resolver. Este script não escreve no banco.
 *
 * Idempotente e conservador: o que já existe no Blob é pulado, nunca sobrescrito —
 * uma foto que a Move tenha subido pelo admin não é revertida para o placeholder.
 */
import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { list, put } from "@vercel/blob";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(dirname, "..", "media");

// Mesmo TTL que o adaptador aplica nos uploads novos, para que arquivo migrado e
// arquivo recém-subido tenham exatamente o mesmo comportamento de cache.
const CACHE_CONTROL_MAX_AGE = 365 * 24 * 60 * 60;

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.error(
    "BLOB_READ_WRITE_TOKEN ausente. Vercel → Storage → seu Blob store → .env.local,\n" +
      "copie a linha para o .env local e rode de novo.",
  );
  process.exit(1);
}

/** Nomes já presentes no store, para não sobrescrever nada. */
async function existingPathnames(): Promise<Set<string>> {
  const found = new Set<string>();
  let cursor: string | undefined;

  do {
    const page = await list({ cursor, token });
    for (const blob of page.blobs) found.add(blob.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return found;
}

const entries = await readdir(mediaDir, { withFileTypes: true });
const files = entries.filter((entry) => entry.isFile() && entry.name !== ".DS_Store");

if (files.length === 0) {
  console.error(`Nenhum arquivo em ${mediaDir}. Nada a migrar.`);
  process.exit(1);
}

const alreadyThere = await existingPathnames();

let uploaded = 0;
let skipped = 0;

for (const file of files) {
  if (alreadyThere.has(file.name)) {
    console.log(`· ${file.name} — já está no Blob, pulando`);
    skipped++;
    continue;
  }

  const body = await readFile(path.join(mediaDir, file.name));

  const blob = await put(file.name, body, {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: CACHE_CONTROL_MAX_AGE,
    token,
  });

  console.log(`✓ ${file.name} → ${blob.url}`);
  uploaded++;
}

console.log(`\nConcluído: ${uploaded} enviado(s), ${skipped} já existente(s).`);
process.exit(0);
