import type { Media } from "@/payload-types";

/** Forma gerada pelo `imageField()` (fields/imageField.ts). */
export type ImageGroup = {
  media?: (string | null) | Media;
  externalUrl?: string | null;
  alt?: string | null;
};

export type ResolvedImage = { src: string; alt: string };

/**
 * O upload tem prioridade sobre a URL externa — é o que permite a Move trocar um
 * placeholder do Unsplash por fotografia própria sem ninguém tocar no código.
 *
 * O `alt` do documento de mídia vence o do campo: quem sobe a imagem descreve a
 * imagem que subiu, e essa descrição acompanha o arquivo onde quer que ele apareça.
 */
export function resolveImage(image: ImageGroup | null | undefined): ResolvedImage | null {
  if (!image) return null;

  const media = typeof image.media === "object" ? image.media : null;
  const src = media?.url ?? image.externalUrl;

  if (!src) return null;

  return { src, alt: media?.alt ?? image.alt ?? "" };
}

/** Numeração "01", "02"… derivada da posição, para não haver campo manual a sincronizar. */
export const displayNumber = (index: number) => String(index + 1).padStart(2, "0");
