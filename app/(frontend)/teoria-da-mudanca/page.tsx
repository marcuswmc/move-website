import Image from "next/image";
import Link from "next/link";
import { ImpactServices } from "@/components/ImpactServices";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { TheoryRings } from "@/components/TheoryRings";
import type { Metadata } from "next";
import { getServices, getTheoryOfChange } from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTheoryOfChange();

  return metadataFromSeo(meta, {
    title: "Teoria da Mudança | Move Social",
    description:
      "O framework por trás de cada entrega da Move: o que queremos ver mudar no campo socioambiental, para quem trabalhamos e o que entregamos para chegar lá.",
  });
}

export default async function TheoryPage() {
  const [{ goals, pdf: theoryPdf }, services] = await Promise.all([
    getTheoryOfChange(),
    getServices(),
  ]);

  return (
    <main className="bg-move-offwhite">
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-16 pt-32 text-white md:px-14 md:pb-24 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full border-[8rem] border-move-yellow/[0.14] md:-right-24 md:-top-48 md:h-[38rem] md:w-[38rem] md:border-[10.5rem]" />
          <div
            className="float-slow absolute -bottom-10 left-[8%] h-14 w-14 rounded-full bg-move-yellow/25 md:h-20 md:w-20"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="editorial-container relative z-10">
          <Reveal>
            <SectionLabel dot="yellow" light>
              Teoria da Mudança
            </SectionLabel>
            <h1 className="max-w-3xl font-sans text-display-1 font-medium text-white text-balance">
              O framework por trás de cada entrega.
            </h1>
            <p className="mt-7 max-w-2xl text-body-lg leading-relaxed text-white/75">
              Um mapa de intenção: o que queremos ver mudar no campo socioambiental, para quem trabalhamos
              e o que entregamos para chegar lá.
            </p>

            <div className="mt-9">
              <a
                href={theoryPdf.href}
                download
                className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white"
              >
                {theoryPdf.label} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="narrativa" className="bg-white px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <Reveal>
            <SectionLabel dot="purple">O que queremos</SectionLabel>
            <h2 className="max-w-2xl font-sans text-display-2 font-medium leading-[1.05] text-move-purple text-balance">
              Justiça social e climática.
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-move-black/65">
              Uma sociedade justa, equitativa, com direitos garantidos, contribuindo para a preservação e
              regeneração ambiental — desdobrada em camadas de mudança que se sustentam.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-5">
            {goals.map((goal, index) => {
              const dark = goal.tone === "purple" || goal.tone === "black";
              return (
                <Reveal key={goal.number} delay={index * 0.05}>
                  <article
                    className={`grid gap-0 overflow-hidden rounded-soft md:grid-cols-[0.85fr_1.15fr] ${
                      dark ? "bg-move-purple text-white" : "bg-move-offwhite text-move-purple"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full md:aspect-auto">
                      <Image
                        src={goal.image}
                        alt={goal.imageAlt}
                        fill
                        sizes="(min-width: 768px) 35vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
                      <span className={`text-eyebrow font-bold uppercase ${dark ? "text-move-yellow" : "text-move-purple/70"}`}>
                        {goal.eyebrow}
                      </span>
                      <h3 className="mt-3 font-sans text-2xl font-medium leading-tight md:text-3xl">{goal.title}</h3>
                      <p className={`mt-3 max-w-lg leading-relaxed ${dark ? "text-white/75" : "text-move-black/65"}`}>{goal.body}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grain-overlay relative overflow-hidden bg-move-purple px-5 py-24 text-white md:px-14 md:py-32">
        <div className="editorial-container grid gap-14 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <Reveal>
            <SectionLabel dot="yellow" light>
              Para quem fazemos
            </SectionLabel>
            <h2 className="font-sans text-display-2 font-medium leading-[1.05] text-white text-balance">
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

      <ImpactServices services={services} />

      <section className="bg-white px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container relative z-10">
          <Reveal>
            <p className="mb-7 text-eyebrow font-bold uppercase text-move-purple/70">A teoria por inteiro</p>
            <h2 className="max-w-3xl font-sans text-display-2 font-medium leading-[1.05] text-move-purple text-balance">
              Leve a teoria de mudança completa para a sua <span className="text-move-purple">organização.</span>
            </h2>
            <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-move-black/65">
              Baixe o material em PDF para revisitar camadas, objetivos e entregas com o seu time — ou fale
              com a gente para desenhar o próximo passo juntos.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={theoryPdf.href}
                download
                className="inline-flex items-center gap-2 rounded-full bg-move-yellow px-8 py-4 font-bold text-move-purple transition hover:bg-move-purple hover:text-white"
              >
                {theoryPdf.label} <span aria-hidden="true">↓</span>
              </a>
              <Link href="/contato" className="font-bold text-move-purple/70 underline decoration-move-purple/30 decoration-2 underline-offset-4 transition hover:text-move-purple hover:decoration-move-purple">
                Fale com a gente
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
