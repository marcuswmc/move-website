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

/**
 * Linha da visualização em lista de /publicacoes.
 *
 * Mesma informação do card, reordenada para varredura vertical: a data vira uma coluna
 * fixa à esquerda, então dá para percorrer o acervo pela cronologia sem ler os títulos.
 * A miniatura fica pequena de propósito — em lista quem manda é o texto.
 */
export function PublicationRow({
  publication,
  priority = false,
}: {
  publication: PublicationCardData;
  priority?: boolean;
}) {
  return (
    <li className="group border-t border-move-purple/12 first:border-t-0">
      <Link
        href={publication.href}
        className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 py-5 sm:grid-cols-[3.5rem_10rem_minmax(0,1fr)_1.5rem] sm:items-center sm:gap-x-6"
      >
        <time dateTime={publication.publishedAt} className="flex flex-col leading-none text-move-purple">
          <span className="font-sans text-2xl font-bold tabular-nums">{publication.publishedDay}</span>
          <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-move-purple/55">
            {publication.publishedMonthYear}
          </span>
        </time>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-move-offwhite ring-1 ring-inset ring-black/10">
          {publication.cover.src && (
            <Image
              src={publication.cover.src}
              alt={publication.cover.alt}
              fill
              priority={priority}
              sizes="(min-width: 640px) 10rem, 92vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <h3 className="font-sans text-lg font-bold leading-tight text-move-purple text-balance">
            {publication.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-move-black/65">{publication.synopsis}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {publication.categories.map((category) => (
              <span
                key={category.slug}
                className={`rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${surfaceByName(category.color).chip}`}
              >
                {category.name}
              </span>
            ))}
            {/* No celular não há coluna de seta: a ação volta para junto das etiquetas. */}
            <span className="text-xs font-bold text-move-purple sm:hidden">
              {publication.actionLabel} <span aria-hidden="true">{ACTION_ICON[publication.type]}</span>
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="hidden justify-self-end text-lg font-bold text-move-purple transition-transform duration-200 group-hover:translate-x-1 sm:block"
        >
          {ACTION_ICON[publication.type]}
        </span>
      </Link>
    </li>
  );
}
