import Image from "next/image";
import { Grafismo } from "@/components/Grafismo";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export type ServiceCard = { number: string; title: string; body: string; icon: string };

export function ImpactServices({ services }: { services: ServiceCard[] }) {
  return (
    <section id="entregamos" className="relative overflow-hidden bg-white px-5 py-24 md:px-14 md:py-32">
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

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.number} delay={(index % 4) * 0.06}>
              <article className="group flex h-full flex-col rounded-[1.5rem] border border-move-purple/10 bg-move-offwhite p-7 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-editorial">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2.5 shadow-[0_6px_16px_rgba(84,53,93,0.1)]">
                    <Image src={service.icon} alt="" width={28} height={28} className="h-7 w-7" />
                  </span>
                  <span className="text-eyebrow font-bold text-move-purple/40">{service.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold leading-tight text-move-purple">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-move-black/65">{service.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
