import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { HorizontalGoals } from "@/components/HorizontalGoals";
import { ImpactServices } from "@/components/ImpactServices";
import { JusticeSection } from "@/components/JusticeSection";
import { PartnerLogoLoop } from "@/components/PartnerLogoLoop";
import { PortfolioStack } from "@/components/PortfolioStack";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { Testimonials } from "@/components/Testimonials";
import { TeamSection } from "@/components/TeamSection";

export default function Home() {
  return (
    <main>
      <Hero />

      <JusticeSection />

      <HorizontalGoals />

      <PortfolioStack />

      <ImpactServices />

      <PartnerLogoLoop />

      <Testimonials />


      <section className="bg-move-offwhite px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container">
          <Reveal>
            <SectionLabel>Publicações</SectionLabel>
            <h2 className="max-w-2xl font-serif text-display-3 font-medium text-move-purple">
              Presença real, em contextos reais.
            </h2>
          </Reveal>
          <div className="mt-12">
            <Gallery />
          </div>
        </div>
      </section>

      <TeamSection />

      <section className="grain-overlay relative overflow-hidden bg-move-black px-5 py-24 text-white md:px-14 md:py-32">
        <div className="editorial-container relative z-10">
          <Reveal>
            <p className="mb-7 text-eyebrow font-bold uppercase text-move-mint">Vamos construir junto</p>
            <h2 className="max-w-4xl font-serif text-display-2 font-medium leading-[1.02] text-balance">
              Vamos ampliar juntos o impacto da sua <span className="text-move-yellow">organização?</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/contato" className="rounded-full bg-move-yellow px-8 py-4 font-bold text-move-purple transition hover:bg-white">
                Fale com a gente
              </Link>
              <a href="mailto:move@move.social" className="font-bold text-white/70 transition hover:text-white">
                move@move.social
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
