/**
 * Tira o carimbo da migração dos arquivos de mídia.
 *
 * A importação do WordPress prefixou tudo o que trouxe: `wordpress-publication-*`
 * nas capas, `wordpress-material-*` nos PDFs e `wordpress-portfolio-<hash>` nas fotos
 * de apoio do portfólio. O nome do arquivo não é detalhe interno — é a chave do
 * objeto no Blob, é o que aparece no `content-disposition` e, portanto, é o nome com
 * que a pessoa salva o estudo no computador dela.
 *
 * O que o script faz, por documento:
 *   1. calcula o nome novo (prefixo fora; nome descritivo onde o original era hash);
 *   2. copia no Blob para a chave nova — o arquivo original e cada variação de
 *      tamanho gerada pelo sharp;
 *   3. atualiza `filename`, `url`, `thumbnailURL` e `sizes.*` no Mongo;
 *   4. apaga as chaves antigas.
 *
 * A cópia acontece antes da escrita no banco, e a remoção só depois: se o script
 * parar no meio, o documento aponta para uma chave que existe nas duas pontas.
 *
 * Por padrão só relata. `MOVE_RENAME_APPLY=1` escreve.
 *
 *   pnpm payload run scripts/rename-wordpress-media.ts
 *   MOVE_RENAME_APPLY=1 pnpm payload run scripts/rename-wordpress-media.ts
 */
import config from "@payload-config";
import type { MongooseAdapter } from "@payloadcms/db-mongodb";
import { copy, del } from "@vercel/blob";
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";

const apply = process.env.MOVE_RENAME_APPLY === "1";
const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) throw new Error("BLOB_READ_WRITE_TOKEN é obrigatório para mexer no store.");

/** O mesmo prazo que o adapter grava nos uploads: `copy` não herda metadados. */
const CACHE_CONTROL_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * O endereço público do store, montado a partir do token exatamente como o adapter
 * faz (ver payload.config.ts).
 */
const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
if (!storeId) throw new Error("BLOB_READ_WRITE_TOKEN não está no formato vercel_blob_rw_<store>_<hash>.");
const baseUrl = `https://${storeId}.public.blob.vercel-storage.com`;

/**
 * Nomes para as seis fotos de apoio do portfólio, cujo original era um hash sem
 * significado. Cada uma vem do texto alternativo que já estava cadastrado, então
 * descrevem a imagem de fato — e duas delas partilhavam o mesmo alt, daí a distinção
 * pelo enquadramento.
 */
const PORTFOLIO_NAMES: Record<string, string> = {
  "wordpress-portfolio-05382afaaf45d3b21783": "equipe-ao-redor-da-mesa-de-trabalho",
  "wordpress-portfolio-45846c87bd91babf577b": "copas-de-arvores-vistas-de-baixo",
  "wordpress-portfolio-89f8ab164644bac52f67": "maos-unidas-em-circulo",
  "wordpress-portfolio-c37ef45512b5ef147f12": "estetoscopio-ao-lado-de-computador",
  "wordpress-portfolio-d9604e2bc4542fea9d7e": "mesa-de-trabalho-vista-de-cima",
  "wordpress-portfolio-e2f6578b78b82b029ff8": "pilha-de-livros-coloridos",
};

/**
 * Alguns títulos editoriais viram slugs de 150 caracteres. Continuam legíveis muito
 * antes disso, e o nome aparece na caixa de download do navegador — o corte é no
 * hífen anterior ao limite, para não terminar no meio de uma palavra. Se o corte
 * deixar uma conjunção ou preposição na ponta ("…de-maneira", "…planejar-e"), ela
 * também sai: um nome de arquivo que termina em "e" parece truncado por acidente.
 */
const MAX_STEM = 90;
const TRAILING_STOPWORDS = /-(?:a|o|as|os|e|ou|de|da|do|das|dos|em|na|no|nas|nos|para|por|com|sem|sobre|entre|que|ao|aos|a-partir-da|a-partir-do)$/;

const shorten = (stem: string) => {
  if (stem.length <= MAX_STEM) return stem;
  const cut = stem.slice(0, MAX_STEM);
  const lastHyphen = cut.lastIndexOf("-");
  let trimmed = (lastHyphen > 40 ? cut.slice(0, lastHyphen) : cut).replace(/-+$/, "");
  // Pode haver mais de uma na sequência: "…-de-maneira-a" → "…".
  while (TRAILING_STOPWORDS.test(trimmed)) trimmed = trimmed.replace(TRAILING_STOPWORDS, "");
  return trimmed;
};

/** Devolve o nome novo, ou null quando o arquivo não veio da migração. */
function renameFile(filename: string): string | null {
  const ext = path.extname(filename);
  const stem = filename.slice(0, filename.length - ext.length);

  if (PORTFOLIO_NAMES[stem]) return `${PORTFOLIO_NAMES[stem]}${ext}`;

  const stripped = stem.replace(/^wordpress-(publication|material|portfolio)-/, "");
  if (stripped === stem) return null;

  return `${shorten(stripped)}${ext}`;
}

/** As variações de tamanho herdam o nome do original: `<nome>-<larg>x<alt>.<ext>`. */
function renameSize(sizeFilename: string, oldStem: string, newStem: string): string {
  return sizeFilename.startsWith(oldStem) ? `${newStem}${sizeFilename.slice(oldStem.length)}` : sizeFilename;
}

/**
 * A escrita vai pelo driver, não pela API local do Payload: `filename` e `sizes` são
 * campos que o Payload administra a partir do arquivo enviado, e um `update` com
 * eles no `data` tentaria reprocessar o upload em vez de apenas corrigir o nome.
 */
const payload = await getPayload({ config });
const media = (payload.db as MongooseAdapter).connection.db!.collection("media");

const docs = await media.find({ filename: /^wordpress-/ }).toArray();
const taken = new Set(
  (await media.find({}, { projection: { filename: 1 } }).toArray()).map((d) => d.filename as string),
);

type Move = { from: string; to: string };
type Plan = {
  id: string;
  from: string;
  to: string;
  moves: Move[];
  set: Record<string, string>;
};

const plans: Plan[] = [];
const conflicts: string[] = [];

for (const doc of docs) {
  const from = doc.filename as string;
  const to = renameFile(from);

  if (!to) continue;

  // Um nome já ocupado por outro documento tornaria os dois indistinguíveis no store.
  if (taken.has(to)) {
    conflicts.push(`${from} → ${to} (nome já em uso)`);
    continue;
  }
  taken.add(to);

  const oldStem = from.slice(0, from.length - path.extname(from).length);
  const newStem = to.slice(0, to.length - path.extname(to).length);

  const moves: Move[] = [{ from, to }];
  const set: Record<string, string> = { filename: to, url: `${baseUrl}/${encodeURIComponent(to)}` };

  const sizes = (doc.sizes ?? {}) as Record<string, { filename?: string | null }>;
  for (const [name, size] of Object.entries(sizes)) {
    if (!size?.filename) continue;
    const sizeTo = renameSize(size.filename, oldStem, newStem);
    if (sizeTo === size.filename) continue;
    moves.push({ from: size.filename, to: sizeTo });
    set[`sizes.${name}.filename`] = sizeTo;
    set[`sizes.${name}.url`] = `${baseUrl}/${encodeURIComponent(sizeTo)}`;
  }

  // Guardado no documento quando a variação existe. É recalculado na leitura, mas
  // deixá-lo apontando para o nome antigo confundiria quem for ler o banco.
  const thumbnail = sizes.thumbnail?.filename;
  if (typeof doc.thumbnailURL === "string" && thumbnail) {
    set.thumbnailURL = `${baseUrl}/${encodeURIComponent(renameSize(thumbnail, oldStem, newStem))}`;
  }

  plans.push({ id: String(doc._id), from, to, moves, set });
}

console.log(`${docs.length} mídias com o prefixo da migração; ${plans.length} a renomear.`);
if (conflicts.length) {
  console.log("\nConflitos (nenhuma ação tomada nestes):");
  conflicts.forEach((c) => console.log(`  ${c}`));
}

if (!apply) {
  console.log("\nModo leitura. Nada foi alterado. Use MOVE_RENAME_APPLY=1 para aplicar.\n");
  plans.forEach((p) => console.log(`  ${p.from}\n    → ${p.to}  (+${p.moves.length - 1} variações)`));
  fs.writeFileSync("tmp/rename-wordpress-media.plan.json", JSON.stringify(plans, null, 2));
  console.log("\nPlano gravado em tmp/rename-wordpress-media.plan.json");
  await payload.destroy();
  process.exit(0);
}

const done: Plan[] = [];
const failed: { plan: Plan; error: string }[] = [];

for (const plan of plans) {
  try {
    // 1. Copiar primeiro. `copy` é do lado do servidor: nada é baixado nem reenviado.
    for (const move of plan.moves) {
      await copy(`${baseUrl}/${encodeURIComponent(move.from)}`, move.to, {
        access: "public",
        addRandomSuffix: false,
        cacheControlMaxAge: CACHE_CONTROL_MAX_AGE,
        token,
      });
    }

    // 2. Só então apontar o documento para os nomes novos. O `url` é recalculado na
    // leitura pelo hook do plugin, mas fica coerente no banco em vez de guardar o
    // caminho /api/media/file/* de antes.
    await media.updateOne({ _id: docs.find((d) => String(d._id) === plan.id)!._id }, { $set: plan.set });

    // 3. E finalmente descartar as chaves antigas.
    await del(plan.moves.map((m) => `${baseUrl}/${encodeURIComponent(m.from)}`), { token });

    done.push(plan);
    console.log(`${done.length}/${plans.length}  ${plan.to}`);
  } catch (error) {
    failed.push({ plan, error: error instanceof Error ? error.message : String(error) });
    console.error(`FALHOU  ${plan.from}: ${String(error)}`);
  }
}

fs.writeFileSync(
  "tmp/rename-wordpress-media.result.json",
  JSON.stringify({ done, failed, conflicts }, null, 2),
);

console.log(`\nRenomeadas: ${done.length}. Falhas: ${failed.length}. Conflitos: ${conflicts.length}.`);
console.log("Relatório em tmp/rename-wordpress-media.result.json");

await payload.destroy();
