import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ImpactServices } from "@/components/ImpactServices";
import { PartnerLogoLoop } from "@/components/PartnerLogoLoop";
import { PortfolioStack } from "@/components/PortfolioStack";
import { Publications } from "@/components/Publications";
import { Reveal } from "@/components/Reveal";
import { TeamSection } from "@/components/TeamSection";
import {
  getHomeContent,
  getHomePublications,
  getPartners,
  getServices,
  getSiteSettings,
  getTeam,
} from "@/lib/content";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { meta, hero } = await getHomeContent();

  return metadataFromSeo(meta, {
    title: "Move Social | Gestão de impacto socioambiental",
    description: hero.body,
  });
}

export default async function Home() {
  const [home, settings, services, partners, publications, team] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
    getServices(),
    getPartners(),
    getHomePublications(),
    getTeam(),
  ]);

  return (
    <main>
      <Hero hero={home.hero} metrics={settings.metrics} affiliations={home.affiliations} />

      <ImpactServices services={services} />

      <PartnerLogoLoop partners={partners} />

      <Publications publications={publications} />

      <PortfolioStack projects={home.showcase} />

      <TeamSection teamMembers={team.teamMembers} boardMembers={team.boardMembers} />

      <section className="bg-move-offwhite px-5 py-24 md:px-14 md:py-32">
        <div className="editorial-container relative z-10">
          <Reveal>
            <p className="mb-7 text-eyebrow font-bold uppercase text-move-purple/70">Vamos construir junto</p>
            <h2 className="max-w-4xl font-sans text-display-2 font-medium leading-[1.02] text-move-purple text-balance">
              Vamos ampliar juntos o impacto da sua <span className="rounded bg-move-yellow/50 px-1">organização?</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/contato" className="rounded-full bg-move-purple px-8 py-4 font-bold text-white transition hover:bg-move-purple/90">
                Fale com a gente
              </Link>
              <a href="mailto:move@move.social" className="font-bold text-move-purple/70 transition hover:text-move-purple">
                move@move.social
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
