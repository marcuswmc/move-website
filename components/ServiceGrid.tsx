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
          <article className="group flex h-full flex-col rounded-[1.5rem] border border-move-purple/10 bg-move-offwhite p-6 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-editorial">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-[0_6px_16px_rgba(84,53,93,0.1)]">
              <Image src={service.icon} alt="" width={32} height={32} className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-base font-bold leading-tight text-move-purple">{service.title}</h3>
            <p className="mt-2.5 text-body-sm text-move-black/65">{service.body}</p>
            {/* O número desceu para o rodapé com `mt-auto`. As descrições têm comprimentos
                bem diferentes e a linha da grade estica todos os cards até a altura do mais
                alto — com o número no topo, os textos curtos terminavam num vão vazio. Ancorado
                embaixo, ele fecha o card e o espaço que sobra vira respiro entre texto e número. */}
            <span className="mt-auto pt-4 text-right text-eyebrow font-bold text-move-purple/40">
              {service.number}
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
