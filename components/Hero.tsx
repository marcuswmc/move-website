import Image from "next/image";
import Link from "next/link";
import { images } from "@/data/images";
import { metrics } from "@/data/site";
import { Reveal } from "@/components/Reveal";

type HeroProps = {
  /** Optional real footage — plays inside the left frame when provided, falling back to the still. */
  videoSrc?: string;
};

export function Hero({ videoSrc }: HeroProps) {
  return (
    <section
      id="hero"
      className="grain-overlay relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-move-purple px-5 pb-16 pt-36 md:px-14 md:pb-20 md:pt-40"
    >
      {/* Brand symbol echo — the ring + dot from the "O" mark, standing in for a background photo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full border-[4rem] border-move-periwinkle/[0.14] md:-right-24 md:-top-48 md:h-[38rem] md:w-[38rem] md:border-[5.5rem]" />
        <div
          className="float-slow absolute -bottom-6 left-[10%] h-14 w-14 rounded-full bg-move-mint/25 md:h-20 md:w-20"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Lateral photo frames — desktop only, flank the headline like tilted Polaroids */}
      <div className="absolute left-[3%] top-[16%] hidden w-40 -rotate-6 xl:block xl:w-48" aria-hidden>
        <Reveal delay={0.32}>
          <div className="float-slow" style={{ animationDelay: "-1.5s" }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_20px_45px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              {videoSrc ? (
                <video
                  className="h-full w-full object-cover"
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={images.hero.src}
                  alt={images.hero.alt}
                  fill
                  priority
                  sizes="192px"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute right-[3%] top-[36%] hidden w-36 rotate-[8deg] xl:block xl:w-44" aria-hidden>
        <Reveal delay={0.4}>
          <div className="float-slow" style={{ animationDelay: "-6s" }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_20px_45px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <Image
                src={images.heroPortrait.src}
                alt={images.heroPortrait.alt}
                fill
                sizes="176px"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-move-periwinkle mix-blend-multiply" />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="mb-6 text-eyebrow font-bold uppercase text-move-mint">
            Gestão de impacto socioambiental · 15 anos de campo
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="font-serif text-display-1 font-medium text-white text-balance">
            Ampliar o que o <em className="text-move-mint">impacto</em> pode ser.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-body-lg leading-relaxed text-white/75">
            Fazemos parte do campo socioambiental. Há 15 anos ajudamos organizações a transformar
            intenção em impacto, com rigor analítico, escuta qualificada e presença.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="#queremos"
            className="rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white active:scale-[0.96]"
          >
            Conheça nossa forma de trabalhar
          </Link>
          <Link
            href="/teoria-da-mudanca"
            className="text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-mint hover:decoration-move-mint"
          >
            Ver teoria de mudança
          </Link>
        </Reveal>
      </div>

      <Reveal
        delay={0.32}
        className="relative z-10 mt-16 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="font-serif text-3xl font-medium tabular-nums text-white md:text-4xl">{metric.value}</div>
            <p className="mt-1 text-sm font-medium text-white/70">{metric.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
