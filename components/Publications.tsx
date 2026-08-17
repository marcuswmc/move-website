import Link from "next/link";

import { Grafismo } from "@/components/Grafismo";
import { PublicationCard } from "@/components/PublicationCard";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import type { PublicationCard as PublicationCardData } from "@/lib/content";

export function Publications({ publications }: { publications: PublicationCardData[] }) {
  if (publications.length === 0) return null;

  return (
    <section id="publicacoes" className="relative overflow-hidden bg-white px-5 py-24 md:px-14 md:py-32">
      <Grafismo
        src="/brand/icons/Group 11.svg"
        animate="spin"
        className="pointer-events-none absolute -bottom-20 -left-16 w-52 opacity-[0.07] md:w-72"
      />
      <div className="editorial-container relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Publicações</SectionLabel>
              <h2 className="max-w-2xl font-sans text-display-3 font-bold text-move-purple">
                Conhecimento que sistematiza o que aprendemos no campo.
              </h2>
            </div>
            <Link
              href="/publicacoes"
              className="inline-flex items-center gap-2 text-sm font-bold text-move-purple underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:decoration-move-purple"
            >
              Ver todas as publicações <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication, index) => (
            <Reveal key={publication.slug} delay={index * 0.06}>
              <PublicationCard publication={publication} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
