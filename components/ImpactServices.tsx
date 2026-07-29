"use client";

import { useState } from "react";
import { deliverables } from "@/data/site";
import { SectionLabel } from "@/components/SectionLabel";

export function ImpactServices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = deliverables[activeIndex];

  return (
    <section id="entregamos" className="bg-white px-5 py-24 md:px-14 md:py-32">
      <div className="editorial-container">
        <SectionLabel dot="yellow">O que entregamos</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-eyebrow font-bold uppercase text-move-green">Do planejamento à avaliação</p>
            <h2 className="mt-5 max-w-xl font-sans text-display-2 font-bold leading-[0.98] tracking-[-0.035em] text-move-purple text-balance">
              Todo o ciclo de impacto, por inteiro.
            </h2>
            <p className="mt-7 max-w-md text-body-lg leading-relaxed text-move-black/65">
              Partimos do que já está em jogo para construir caminhos com intenção, rigor analítico e escuta qualificada.
            </p>

            <div className="mt-10 hidden border-l-2 border-move-yellow pl-6 lg:block" aria-live="polite">
              <p className="text-eyebrow font-bold uppercase text-move-green">{activeService.number} · Em foco</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-move-purple">{activeService.title}</h3>
              <p className="mt-4 max-w-sm leading-relaxed text-move-black/65">{activeService.body}</p>
            </div>
          </div>

          <ol className="border-t border-move-purple/15">
            {deliverables.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={service.number} className="border-b border-move-purple/15">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    className={`group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 py-5 text-left transition-[color,background-color] duration-200 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-5 sm:py-6 ${
                      isActive ? "bg-move-purple px-4 text-white sm:px-6" : "text-move-purple hover:bg-move-offwhite"
                    }`}
                  >
                    <span className={`text-eyebrow font-bold ${isActive ? "text-move-yellow" : "text-move-green"}`}>{service.number}</span>
                    <span className="text-xl font-bold leading-tight sm:text-2xl">{service.title}</span>
                    <span className={`text-xl transition-transform duration-200 group-hover:translate-x-1 ${isActive ? "text-move-yellow" : "text-move-periwinkle"}`} aria-hidden="true">
                      {isActive ? "−" : "↗"}
                    </span>
                  </button>
                  {isActive && <p className="bg-move-purple px-4 pb-6 text-base leading-relaxed text-white/75 sm:px-6 lg:hidden">{service.body}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
