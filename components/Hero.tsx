import Link from "next/link";
import { MoveSymbol } from "@/components/MoveSymbol";
import { Reveal } from "@/components/Reveal";

type HeroProps = {
  hero: { eyebrow: string; title: string; body: string };
  metrics: { value: string; label: string }[];
  affiliations: { label: string }[];
};

export function Hero({ hero, metrics, affiliations }: HeroProps) {
  return (
    <section
      id="hero"
      className="grain-overlay relative isolate flex h-[100dvh] flex-col justify-center overflow-hidden bg-move-purple px-5 pb-8 pt-28 md:px-14 md:pb-10 md:pt-32"
    >
      {/* Move symbol — bled 50% off the right edge, lg+ only so it never competes with the copy on small screens */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-0 hidden items-center lg:flex">
        <MoveSymbol className="h-[87vh] max-h-[42rem] w-auto translate-x-1/2 text-move-yellow opacity-95 xl:h-[95vh] xl:max-h-[50rem]" />
      </div>

      <div className="editorial-container relative z-10">
        <div className="max-w-xl lg:max-w-3xl">
          <Reveal>
            <p className="mb-4 text-eyebrow font-bold uppercase text-move-yellow">{hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Sem line-clamp: o título é conteúdo de CMS e cortar com reticências
                esconderia texto que a Move escreveu. A escala abaixo foi reduzida até
                a chamada atual caber em duas linhas; se uma futura ficar mais longa,
                ela quebra para uma terceira linha em vez de sumir. */}
            <h1 className="text-balance font-sans text-[clamp(2rem,1.2rem+2.3vw,3.25rem)] font-bold leading-[1.05] text-white">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 max-w-lg text-pretty text-body-lg leading-relaxed text-white/75">{hero.body}</p>
          </Reveal>

          <Reveal delay={0.24} className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="#entregamos"
              className="rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white active:scale-[0.96]"
            >
              Conhecer nossos serviços
            </Link>
            <Link
              href="/teoria-da-mudanca"
              className="text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-yellow hover:decoration-white"
            >
              Ver teoria de mudança
            </Link>
          </Reveal>
        </div>

        <Reveal
          delay={0.32}
          className="mt-8 flex w-full max-w-3xl flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:gap-8"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-baseline gap-3">
                <span className="font-sans text-4xl font-bold tabular-nums text-white md:text-5xl">{metric.value}</span>
                <span className="text-sm font-medium text-white/70">{metric.label}</span>
              </div>
            ))}
          </div>

          <div aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-white/15 sm:block" />

          <div className="flex flex-wrap items-center gap-3">
            {affiliations.map((item) => (
              <span
                key={item.label}
                className="rounded-soft border border-white/20 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/70"
              >
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
