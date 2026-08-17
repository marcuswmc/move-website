import Image from "next/image";

import { Reveal } from "@/components/Reveal";

export type ServiceCard = { number: string; title: string; body: string; icon: string };

/**
 * A grade de serviços, sem cabeçalho.
 *
 * Ela aparece em dois lugares com aberturas diferentes — "O que entregamos" na home e
 * o elo "O que fazemos" da Teoria da Mudança — então o título mora em quem chama, e
 * aqui fica só o que os dois compartilham de fato: o card.
 */
export function ServiceGrid({ services }: { services: ServiceCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
