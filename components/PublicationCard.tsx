import Image from "next/image";
import Link from "next/link";

import type { PublicationCard as PublicationCardData } from "@/lib/content";
import { surfaceByName } from "@/lib/palette";

/** Ícone da ação, por tipo — sinaliza o que vai acontecer antes do clique. */
const ACTION_ICON: Record<PublicationCardData["type"], string> = {
  article: "→",
  download: "↓",
  external: "↗",
};

export function PublicationCard({
  publication,
  priority = false,
}: {
  publication: PublicationCardData;
  priority?: boolean;
}) {
  return (
    <article className="group h-full">
      {/* Sempre para a página da publicação, inclusive nas de link externo: é lá
          que mora o texto que apresenta o material. */}
      <Link
        href={publication.href}
        className="flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-[0_2px_10px_rgba(84,53,93,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-editorial focus-visible:-translate-y-1 focus-visible:shadow-editorial"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-move-offwhite ring-1 ring-inset ring-black/10">
          {publication.cover.src && (
            <Image
              src={publication.cover.src}
              alt={publication.cover.alt}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          {publication.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {publication.categories.map((category) => (
                <span
                  key={category.slug}
                  className={`rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${surfaceByName(category.color).chip}`}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-balance font-sans text-lg font-bold leading-tight text-move-purple">
            {publication.title}
          </h3>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-move-black/65">{publication.synopsis}</p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-move-purple/10 pt-4">
            <time dateTime={publication.publishedAt} className="text-xs font-medium text-move-black/45">
              {publication.publishedLabel}
            </time>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-move-purple">
              {publication.actionLabel}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                {ACTION_ICON[publication.type]}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
