import type { Metadata } from "next";

import { resolveImage } from "@/lib/resolveImage";
import type { Media } from "@/payload-types";

/** Forma do grupo `meta` que o @payloadcms/plugin-seo injeta nos documentos. */
export type SeoMeta =
  | {
      title?: string | null;
      description?: string | null;
      image?: (string | null) | Media;
    }
  | null
  | undefined;

type Fallback = {
  /** Título usado quando o campo de SEO está vazio. */
  title: string;
  description?: string | null;
  /** Imagem de compartilhamento quando não houver uma escolhida no SEO. */
  image?: { src: string; alt: string } | null;
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * Converte o SEO editado no admin em `Metadata` do Next.
 *
 * O campo do CMS sempre vence; o fallback é o conteúdo real da página. Assim uma
 * publicação recém-criada já sai com título e descrição corretos sem ninguém
 * preencher a aba de SEO, e quem quiser afinar o texto para busca tem onde fazê-lo.
 */
export function metadataFromSeo(meta: SeoMeta, fallback: Fallback): Metadata {
  const title = meta?.title?.trim() || fallback.title;
  const description = meta?.description?.trim() || fallback.description?.trim() || undefined;

  const seoImage = meta?.image ? resolveImage({ media: meta.image, alt: title }) : null;
  const image = seoImage ?? fallback.image ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: fallback.type ?? "website",
      ...(fallback.publishedTime ? { publishedTime: fallback.publishedTime } : {}),
      ...(image?.src ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
    twitter: {
      card: image?.src ? "summary_large_image" : "summary",
      title,
      description,
      ...(image?.src ? { images: [image.src] } : {}),
    },
  };
}
