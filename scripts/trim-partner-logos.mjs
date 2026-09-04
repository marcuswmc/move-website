/**
 * Apara a margem embutida nos logos de `public/partners/` e limita a resolução.
 *
 *   pnpm logos:trim          mostra o que faria
 *   pnpm logos:trim --write  reescreve os arquivos
 *
 * Um logo entregue com 60% de área vazia aparece pequeno no carrossel mesmo ocupando
 * a mesma caixa que os outros — a caixa é a mesma, a marca dentro dela é que encolhe.
 * Aparar faz todos os arquivos começarem na borda da tinta, que é a premissa de que o
 * `LogoLoop` parte para dimensionar cada um pela proporção.
 *
 * Depois de rodar com `--write`, suba os arquivos para o CMS:
 *   LOGOS=1 pnpm seed:partners
 */
import { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import sharp from "sharp";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "partners");
const write = process.argv.includes("--write");

/** Acima disso a marca já ocupa o arquivo — reescrever só perderia qualidade. */
const MIN_WASTE = 0.15;

/**
 * A maior caixa em que um logo aparece tem 184px de largura; 640px cobre telas 3x com
 * folga. Arquivos bem maiores que isso (o Arapyaú vinha com 2560px) são peso morto.
 */
const MAX_WIDTH = 640;

const THRESHOLD = 12;

/**
 * Duas passadas, porque as duas bordas existem e são de tipos diferentes: o `trim`
 * do sharp compara com o pixel do canto, então a primeira passada tira a moldura
 * transparente e para na borda da caixa branca que alguns logos trazem por baixo.
 * A segunda passada já encontra o branco no canto, e tira essa também.
 */
async function trimEdges(input) {
  let buffer = input;
  for (let pass = 0; pass < 2; pass++) {
    try {
      buffer = await sharp(buffer).trim({ threshold: THRESHOLD }).toBuffer();
    } catch {
      break; // imagem de cor única: não há o que aparar
    }
  }
  return buffer;
}

for (const file of readdirSync(dir).filter((name) => name.endsWith(".webp")).sort()) {
  const filePath = path.join(dir, file);
  const before = statSync(filePath).size;
  const meta = await sharp(filePath).metadata();

  const trimmed = await trimEdges(filePath);
  const inked = await sharp(trimmed).metadata();

  const waste = 1 - (inked.width * inked.height) / (meta.width * meta.height);
  const width = Math.min(inked.width, MAX_WIDTH);

  if (waste < MIN_WASTE && inked.width <= MAX_WIDTH) {
    console.log(`  ok       ${file}`);
    continue;
  }

  const resized = () => sharp(trimmed).resize({ width, withoutEnlargement: true });

  /**
   * Num logo chapado o lossless costuma sair menor e sem artefato na borda das
   * letras; num que tem gradiente ou fotografia, ele triplica o arquivo. Em vez de
   * escolher por marca, codifica dos dois jeitos e fica com o menor.
   */
  const [lossless, lossy] = await Promise.all([
    resized().webp({ lossless: true, effort: 6 }).toBuffer(),
    resized().webp({ quality: 90, effort: 6 }).toBuffer(),
  ]);
  const output = lossless.length <= lossy.length ? lossless : lossy;
  const final = await sharp(output).metadata();

  console.log(
    `  ${write ? "aparado" : "aparia "} ${file.padEnd(26)}` +
      ` ${`${meta.width}x${meta.height} → ${final.width}x${final.height}`.padEnd(22)}` +
      ` ${(before / 1024).toFixed(1)}kB → ${(output.length / 1024).toFixed(1)}kB` +
      ` | vazio ${Math.round(waste * 100)}%`,
  );

  if (write) await sharp(output).toFile(filePath);
}

console.log(write ? "\nArquivos reescritos. Agora: LOGOS=1 pnpm seed:partners" : "\nNada foi escrito. Rode com --write.");
