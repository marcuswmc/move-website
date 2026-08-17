import Link from "next/link";
import type { Metadata } from "next";

import { Grafismo } from "@/components/Grafismo";
import { Reveal } from "@/components/Reveal";
import { ServiceGrid } from "@/components/ServiceGrid";
import { TheoryAudienceRings } from "@/components/TheoryAudienceRings";
import { TheoryChainNav, TheoryChainSummary, type ChainLink } from "@/components/TheoryChainNav";
import { TheoryDeliverables } from "@/components/TheoryDeliverables";
import { TheoryFronts } from "@/components/TheoryFronts";
import { TheoryStep } from "@/components/TheoryStep";
import { getServices, getTheoryOfChange } from "@/lib/content";
import { SURFACES, type SurfaceName } from "@/lib/palette";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

/**
 * A página é a Teoria de Mudança oficial da Move desenhada como uma cadeia percorrível:
 * seis elos, das frentes de atuação ao impacto, na mesma ordem causal do documento.
 * O PDF lê de baixo para cima; aqui a leitura desce, mas a causalidade é a mesma —
 * cada elo é o que torna o próximo possível, e o último é a chegada.
 */
const CHAIN: ChainLink[] = [
  { id: "como-atuamos", label: "Como atuamos" },
  { id: "o-que-fazemos", label: "O que fazemos" },
  { id: "para-quem-fazemos", label: "Para quem fazemos" },
  { id: "o-que-entregamos", label: "O que entregamos" },
  { id: "o-que-queremos", label: "O que queremos" },
  { id: "impacto", label: "Impacto" },
];

/**
 * Cada resultado ganha uma cor do sistema da marca. São sete superfícies e sete
 * resultados no documento oficial, então cada um fica com a sua — e o módulo garante
 * que a lista continue funcionando se a Move acrescentar ou remover itens.
 */
const OUTCOME_SURFACES: SurfaceName[] = ["purple", "yellow", "periwinkle", "green", "coral", "mint", "sand"];

export async function generateMetadata(): Promise<Metadata> {
  const { meta, hero } = await getTheoryOfChange();

  return metadataFromSeo(meta, {
    title: `${hero?.title ?? "Teoria da Mudança"} | Move Social`,
    description:
      hero?.description ??
      "A Teoria de Mudança da Move: o porquê e o como do nosso trabalho, das frentes de atuação ao impacto que buscamos.",
  });
}

export default async function TheoryPage() {
  const [theory, services] = await Promise.all([getTheoryOfChange(), getServices()]);
  const {
    hero,
    frontsIntro,
    fronts,
    activitiesIntro,
    audiencesIntro,
    audiences,
    deliverablesIntro,
    deliverables,
    outcomesIntro,
    outcomes,
    impact,
    pdf,
  } = theory;

  return (
    <main className="bg-move-offwhite">
      <TheoryChainNav links={CHAIN} />

      {/* ── Abertura ─────────────────────────────────────────────────────── */}
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-20 pt-32 text-white md:px-14 md:pb-28 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full border-[8rem] border-move-yellow/[0.14] md:-right-24 md:-top-48 md:h-[38rem] md:w-[38rem] md:border-[10.5rem]" />
          <div
            className="float-slow absolute -bottom-10 left-[8%] h-14 w-14 rounded-full bg-move-yellow/25 md:h-20 md:w-20"
            style={{ animationDelay: "-3s" }}
          />
        </div>

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
                <li className="text-white/85">{hero?.eyebrow}</li>
              </ol>
            </nav>

            <h1 className="max-w-4xl font-sans text-display-1 font-medium text-white text-balance">
              {hero?.title}
            </h1>
            <p className="mt-7 max-w-2xl text-body-lg leading-relaxed text-white/75">{hero?.description}</p>

            {pdf.href && (
              <div className="mt-9">
                <a
                  href={pdf.href}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white"
                >
                  {pdf.label} <span aria-hidden="true">↓</span>
                </a>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.12}>
            <TheoryChainSummary links={CHAIN} />
          </Reveal>
        </div>
      </section>

      {/* ── Elo 1 · Como atuamos ─────────────────────────────────────────── */}
      <section
        id="como-atuamos"
        className="relative overflow-hidden bg-move-offwhite px-5 py-24 md:px-14 md:py-32"
      >
        <Grafismo
          src="/brand/icons/Group 12.svg"
          animate="spin"
          className="pointer-events-none absolute -left-20 top-10 w-56 opacity-[0.05]"
        />
        <div className="editorial-container relative">
          <TheoryStep
            step={1}
            total={CHAIN.length}
            eyebrow={frontsIntro?.eyebrow ?? "Como atuamos"}
            title={frontsIntro?.title ?? ""}
            description={frontsIntro?.description}
          />
          <div className="mt-16">
            <TheoryFronts fronts={fronts} />
          </div>
        </div>
      </section>

      {/* ── Elo 2 · O que fazemos ────────────────────────────────────────── */}
      <section id="o-que-fazemos" className="bg-white px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <TheoryStep
            step={2}
            total={CHAIN.length}
            eyebrow={activitiesIntro?.eyebrow ?? "O que fazemos"}
            title={activitiesIntro?.title ?? ""}
            description={activitiesIntro?.description}
          />
          <div className="mt-14">
            <ServiceGrid services={services} />
          </div>
          <Reveal>
            <Link
              href="/portfolio"
              className="mt-12 inline-flex items-center gap-2 font-bold text-move-purple/70 underline decoration-move-purple/30 decoration-2 underline-offset-4 transition hover:text-move-purple hover:decoration-move-purple"
            >
              Ver casos <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Elo 3 · Para quem fazemos ────────────────────────────────────── */}
      <section
        id="para-quem-fazemos"
        className="grain-overlay relative overflow-hidden bg-move-purple px-5 py-24 text-white md:px-14 md:py-32"
      >
        <div className="editorial-container relative z-10">
          <TheoryStep
            step={3}
            total={CHAIN.length}
            eyebrow={audiencesIntro?.eyebrow ?? "Para quem fazemos"}
            title={audiencesIntro?.title ?? ""}
            description={audiencesIntro?.description}
            light
          />
          <div className="mt-16">
            <TheoryAudienceRings audiences={audiences} />
          </div>
        </div>
      </section>

      {/* ── Elo 4 · O que entregamos ─────────────────────────────────────── */}
      <section id="o-que-entregamos" className="bg-move-offwhite px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <TheoryStep
            step={4}
            total={CHAIN.length}
            eyebrow={deliverablesIntro?.eyebrow ?? "O que entregamos"}
            title={deliverablesIntro?.title ?? ""}
            description={deliverablesIntro?.description}
          />
          <TheoryDeliverables deliverables={deliverables} />
        </div>
      </section>

      {/* ── Elo 5 · O que queremos ───────────────────────────────────────── */}
      <section id="o-que-queremos" className="bg-white px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <TheoryStep
            step={5}
            total={CHAIN.length}
            eyebrow={outcomesIntro?.eyebrow ?? "O que queremos"}
            title={outcomesIntro?.title ?? ""}
            description={outcomesIntro?.description}
          />

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome, index) => {
              const surface = SURFACES[OUTCOME_SURFACES[index % OUTCOME_SURFACES.length]];
              return (
                <li key={outcome.number} className="h-full">
                  <Reveal delay={(index % 3) * 0.06} className="h-full">
                    <article
                      className={`flex h-full flex-col justify-between gap-8 rounded-[1.5rem] p-7 transition-transform duration-300 hover:-translate-y-1 ${surface.bg}`}
                    >
                      <span className={`text-eyebrow font-bold tabular-nums ${surface.muted}`}>
                        {outcome.number}
                      </span>
                      <p className={`text-lg font-medium leading-snug text-balance ${surface.text}`}>
                        {outcome.label}
                      </p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Elo 6 · Impacto ──────────────────────────────────────────────── */}
      <section
        id="impacto"
        className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 py-28 text-white md:px-14 md:py-36"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full border-[9rem] border-move-yellow/[0.12]" />
        </div>

        <div className="editorial-container relative z-10">
          <TheoryStep
            step={6}
            total={CHAIN.length}
            eyebrow={impact?.eyebrow ?? "Impacto"}
            title={impact?.title ?? ""}
            light
          />

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-3xl font-sans text-display-3 font-medium leading-tight text-move-yellow text-balance">
              {impact?.statement}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              {pdf.href && (
                <a
                  href={pdf.href}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-8 py-4 font-bold text-move-purple transition hover:bg-white"
                >
                  {pdf.label} <span aria-hidden="true">↓</span>
                </a>
              )}
              <Link
                href="/contato"
                className="font-bold text-white/75 underline decoration-white/30 decoration-2 underline-offset-4 transition hover:text-white hover:decoration-white"
              >
                Fale com a gente
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
