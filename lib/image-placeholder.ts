import sharp from "sharp";
import type { CollectionBeforeChangeHook } from "payload";

/** Gerado uma vez no upload; nunca durante a renderização da página. */
export async function createImagePlaceholder(input: Buffer | string): Promise<string> {
  const buffer = await sharp(input)
    .rotate()
    .resize(10, 10, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 30 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

export const addImagePlaceholder: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Edições de alt/metadados preservam a prévia existente. Substituições de arquivo
  // sempre a recalculam, inclusive removendo a antiga se o novo arquivo não é imagem.
  if (!req.file) return data;
  data.blurDataURL = null;
  if (!req.file.mimetype.startsWith("image/") || req.file.mimetype === "image/svg+xml") return data;

  try {
    data.blurDataURL = await createImagePlaceholder(req.file.tempFilePath || req.file.data);
  } catch {
    // Uma prévia é opcional: não impede o upload de uma mídia válida para o CMS.
    req.payload.logger.warn("Não foi possível gerar a prévia da imagem; será usado o fundo de reserva.");
  }
  return data;
};
