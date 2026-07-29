import Image from "next/image";
import Link from "next/link";
import { goals, theoryPdf } from "@/data/site";
import { ImpactServices } from "@/components/ImpactServices";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { TheoryRings } from "@/components/TheoryRings";

const objectiveGoals = goals.filter((goal) => goal.kind === "objective");

export default function TheoryPage() {
  return (
    <main className="bg-move-offwhite">
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-16 pt-32 text-white md:px-14 md:pb-24 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full border-[4rem] border-move-periwinkle/[0.14] md:-right-24 md:-top-48 md:h-[38rem] md:w-[38rem] md:border-[5.5rem]" />
          <div
            className="float-slow absolute -bottom-10 left-[8%] h-14 w-14 rounded-full bg-move-mint/25 md:h-20 md:w-20"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="editorial-container relative z-10">
          <Reveal>
            <SectionLabel dot="mint" light>
              Teoria da Mudança
            </SectionLabel>
            <h1 className="max-w-3xl font-serif text-display-1 font-medium text-white text-balance">
              O framework por trás de cada entrega.
            </h1>
            <p className="mt-7 max-w-2xl text-body-lg leading-relaxed text-white/75">
              Um mapa de intenção: o que queremos ver mudar no campo socioambiental, para quem trabalhamos
              e o que entregamos para chegar lá.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href={theoryPdf.href}
                download
                className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white"
              >
                {theoryPdf.label} <span aria-hidden="true">↓</span>
              </a>
              <Link
                href="/#narrativa"
                scroll={false}
                className="text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-mint hover:decoration-move-mint"
              >
                Ver a narrativa completa na Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <Reveal>
            <SectionLabel dot="mint">O que queremos</SectionLabel>
            <h2 className="max-w-2xl font-serif text-display-2 font-medium leading-[1.05] text-move-purple text-balance">
              Justiça social e climática.
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-move-black/65">
              Uma sociedade justa, equitativa, com direitos garantidos, contribuindo para a preservação e
              regeneração ambiental — desdobrada em três camadas de mudança que se sustentam.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {objectiveGoals.map((goal, index) => (
              <Reveal key={goal.number} delay={index * 0.08}>
                <article className="h-full">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-soft">
                    <Image
                      src={goal.image}
                      alt={goal.imageAlt}
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-6 text-eyebrow font-bold uppercase text-move-periwinkle">{goal.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-2xl font-medium leading-tight text-move-purple">
                    {goal.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-move-black/60">{goal.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain-overlay relative overflow-hidden bg-move-purple px-5 py-24 text-white md:px-14 md:py-32">
        <div className="editorial-container grid gap-14 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <Reveal>
            <SectionLabel dot="mint" light>
              Para quem fazemos
            </SectionLabel>
            <h2 className="font-serif text-display-2 font-medium leading-[1.05] text-white text-balance">
              Pessoas, organizações e campo.
            </h2>
            <p className="mt-6 max-w-md text-body-lg leading-relaxed text-white/70">
              Três camadas que se sustentam: quem está no centro humano do trabalho, a organização que
              precisa de clareza, e o campo que se fortalece quando uma iniciativa aprende melhor.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <TheoryRings />
          </Reveal>
        </div>
      </section>

      <ImpactServices />

      <section className="grain-overlay relative overflow-hidden bg-move-black px-5 py-24 text-white md:px-14 md:py-32">
        <div className="editorial-container relative z-10">
          <Reveal>
            <p className="mb-7 text-eyebrow font-bold uppercase text-move-mint">A teoria por inteiro</p>
            <h2 className="max-w-3xl font-serif text-display-2 font-medium leading-[1.05] text-balance">
              Leve a teoria de mudança completa para a sua <span className="text-move-yellow">organização.</span>
            </h2>
            <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-white/70">
              Baixe o material em PDF para revisitar camadas, objetivos e entregas com o seu time — ou fale
              com a gente para desenhar o próximo passo juntos.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={theoryPdf.href}
                download
                className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-8 py-4 font-bold text-move-purple transition hover:bg-white"
              >
                {theoryPdf.label} <span aria-hidden="true">↓</span>
              </a>
              <Link href="/contato" className="font-bold text-white/70 underline decoration-white/30 decoration-2 underline-offset-4 transition hover:text-white hover:decoration-white">
                Fale com a gente
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
