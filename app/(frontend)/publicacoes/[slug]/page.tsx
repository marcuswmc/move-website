import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicationCard } from "@/components/PublicationCard";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { SectionLabel } from "@/components/SectionLabel";
import { getPublication, getPublicationSlugs, getPublications } from "@/lib/content";
import { surfaceByName } from "@/lib/palette";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublicationSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublication(slug);

  if (!publication) return { title: "Publicação não encontrada | Move Social" };

  return metadataFromSeo(publication.meta, {
    title: `${publication.title} | Move Social`,
    description: publication.synopsis,
    image: publication.cover.src ? publication.cover : null,
    type: "article",
    publishedTime: publication.publishedAt,
  });
}

/** Tamanho de arquivo legível, para a pessoa saber no que está clicando. */
const formatFileSize = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

/** Extensão a partir do mime type, para o botão dizer o que vai ser baixado. */
const FILE_LABEL: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "application/zip": "ZIP",
  "application/x-zip-compressed": "ZIP",
};

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublication(slug);

  if (!publication) notFound();

  const all = await getPublications();
  const related = all.filter((item) => item.slug !== publication.slug).slice(0, 3);

  return (
    <main className="bg-move-offwhite">
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-14 pt-28 text-white md:px-14 md:pb-20 md:pt-36">
        <div className="editorial-container relative z-10">
          <Reveal>
            <nav aria-label="Trilha de navegação" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/60">
                <li className="flex items-center gap-2">
                  <Link href="/" className="transition-colors hover:text-move-yellow">
                    Início
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li className="flex items-center gap-2">
                  <Link href="/publicacoes" className="transition-colors hover:text-move-yellow">
                    Publicações
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              </ol>
            </nav>

            {publication.categories.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {publication.categories.map((category) => (
                  <span
                    key={category.slug}
                    className={`rounded-full px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.1em] ${surfaceByName(category.color).chip}`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="max-w-4xl font-sans text-display-2 font-medium text-white text-balance">
              {publication.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65">
              <time dateTime={publication.publishedAt}>{publication.publishedLabel}</time>
              {publication.author && (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{publication.author}</span>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <article className="bg-white px-5 py-16 md:px-14 md:py-24">
        <div className="editorial-container">
          {publication.cover.src && (
            <Reveal>
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[1.5rem] bg-move-offwhite">
                <Image
                  src={publication.cover.src}
                  alt={publication.cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1340px) 1340px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          <Reveal delay={0.06}>
            <p className="mt-12 max-w-[68ch] border-l-2 border-move-yellow pl-5 text-body-lg font-medium leading-relaxed text-move-purple">
              {publication.synopsis}
            </p>
          </Reveal>

          {publication.content && (
            <Reveal delay={0.1}>
              <RichText data={publication.content} className="mt-12" />
            </Reveal>
          )}

          {/* A ação fecha a página, depois do texto que apresenta a publicação —
              a pessoa decide baixar ou sair já sabendo o que vai encontrar. */}
          {publication.action && (
            <Reveal delay={0.14}>
              <div className="flex items-center gap-4 mt-12 max-w-[68ch] border-move-purple/12 p-7">
                <a
                  href={publication.action.href}
                  {...(publication.action.isDownload
                    ? { download: true }
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex items-center gap-3 rounded-full bg-move-purple px-7 py-4 text-sm font-bold text-white transition hover:bg-move-purple/90"
                >
                  {publication.action.label}
                  <span aria-hidden="true">{publication.action.isDownload ? "↓" : "↗"}</span>
                </a>

                {publication.action.isDownload && (
                  <p className="mt-3 text-xs font-medium text-move-black/50">
                    {[
                      publication.action.fileType ? (FILE_LABEL[publication.action.fileType] ?? "Arquivo") : null,
                      publication.action.fileSize ? formatFileSize(publication.action.fileSize) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-move-offwhite px-5 py-16 md:px-14 md:py-24">
          <div className="editorial-container">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <SectionLabel dot="purple">Continue lendo</SectionLabel>
                  <h2 className="max-w-2xl font-sans text-display-3 font-bold text-move-purple text-balance">
                    Outras publicações da Move.
                  </h2>
                </div>
                <Link
                  href="/publicacoes"
                  className="inline-flex items-center gap-2 text-sm font-bold text-move-purple underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:decoration-move-purple"
                >
                  Ver todas <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PublicationCard key={item.slug} publication={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
