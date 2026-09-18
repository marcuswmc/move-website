/**
 * Conserta a última menção ao WordPress dentro do conteúdo do CMS.
 *
 * A publicação "Avaliação da Efetividade das Aceleradoras" ficou como `external`
 * apontando para `https://move.social/aceleradoras-de-impacto-avaliacao-da-efetividade/`
 * — um permalink do WordPress, no próprio domínio, que deixou de existir na migração.
 * O botão "Baixar o estudo" levava a um 404; com os 301 desta branch passaria a levar
 * de volta à própria página, o que é pior.
 *
 * O PDF em si (`RelatorioAceleradoras.pdf`, 85 páginas) foi recuperado do acervo do
 * Wayback Machine, onde estava sob `/wp-content/uploads/2024/07/`. É o documento da
 * própria Move, publicado pela própria Move; o que se perdeu foi só o endereço.
 *
 * O script sobe o arquivo para a collection Media com nome limpo e converte a
 * publicação para `download`, que é o comportamento que o rótulo do botão sempre
 * anunciou.
 *
 * Por padrão só relata. `MOVE_FIX_APPLY=1` escreve.
 *
 *   pnpm payload run scripts/fix-aceleradoras-publication.ts
 *   MOVE_FIX_APPLY=1 pnpm payload run scripts/fix-aceleradoras-publication.ts
 */
import config from "@payload-config";
import fs from "node:fs";
import { getPayload } from "payload";

const apply = process.env.MOVE_FIX_APPLY === "1";
const SLUG = "avaliacao-da-efetividade-das-aceleradoras";
const SOURCE = "tmp/recuperados/RelatorioAceleradoras.pdf";
const FILENAME = "avaliacao-da-efetividade-das-aceleradoras.pdf";

if (!fs.existsSync(SOURCE)) {
  throw new Error(
    `${SOURCE} não encontrado. Baixe o arquivo do acervo antes de rodar:\n` +
      "  curl -sL -o tmp/recuperados/RelatorioAceleradoras.pdf \\\n" +
      '    "https://web.archive.org/web/20250219123149if_/http://move.social/wp-content/uploads/2024/07/RelatorioAceleradoras.pdf"',
  );
}

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "publications",
  where: { slug: { equals: SLUG } },
  limit: 1,
  draft: true,
});

const publication = docs[0];
if (!publication) throw new Error(`Publicação ${SLUG} não encontrada.`);

console.log("antes:");
console.log(`  tipo:        ${publication.type}`);
console.log(`  externalUrl: ${publication.externalUrl}`);
console.log(`  arquivo:     ${typeof publication.file === "object" ? publication.file?.filename : publication.file}`);
console.log(`  rótulo:      ${publication.actionLabel}`);

if (!apply) {
  console.log("\nModo leitura. Nada foi alterado. Use MOVE_FIX_APPLY=1 para aplicar.");
  await payload.destroy();
  process.exit(0);
}

const existing = await payload.find({
  collection: "media",
  where: { filename: { equals: FILENAME } },
  limit: 1,
});

const bytes = fs.readFileSync(SOURCE);
const media =
  existing.docs[0] ??
  (await payload.create({
    collection: "media",
    data: { alt: "Capa do estudo Avaliação da Efetividade das Aceleradoras" },
    file: { data: bytes, name: FILENAME, mimetype: "application/pdf", size: bytes.length },
  }));

await payload.update({
  collection: "publications",
  id: publication.id,
  data: {
    type: "download",
    file: media.id,
    // O endereço antigo sai: o destino agora é o arquivo, não um permalink morto.
    externalUrl: null,
  },
});

console.log(`\ndepois: type=download, file=${media.filename} (${(bytes.length / 1024 / 1024).toFixed(1)} MB)`);

await payload.destroy();
