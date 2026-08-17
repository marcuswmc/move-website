import { Grafismo } from "@/components/Grafismo";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ServiceGrid, type ServiceCard } from "@/components/ServiceGrid";

export type { ServiceCard };

export function ImpactServices({ services }: { services: ServiceCard[] }) {
  return (
    <section id="entregamos" className="relative overflow-hidden bg-white px-4 py-24 md:px-14 md:py-32">
      <Grafismo
        src="/brand/icons/Group 13.svg"
        animate="float"
        className="pointer-events-none absolute -right-16 -top-16 w-48 opacity-[0.06] md:w-64"
      />
      <div className="editorial-container relative">
        <Reveal>
          <SectionLabel dot="yellow">O que entregamos</SectionLabel>
          <h2 className="max-w-2xl font-sans text-display-3 font-bold leading-[0.98] tracking-[-0.035em] text-move-purple text-balance">
            Do planejamento à avaliação, gestão de impacto de ponta a ponta.
          </h2>
          <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-move-black/65">
            Partimos do que já está em jogo para construir caminhos com intenção, rigor analítico e escuta qualificada.
          </p>
        </Reveal>

        <div className="mt-14">
          <ServiceGrid services={services} />
        </div>
      </div>
    </section>
  );
}
