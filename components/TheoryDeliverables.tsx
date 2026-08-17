"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { Reveal } from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

export type Deliverable = { number: string; label: string };

/**
 * As entregas como uma lista que se preenche conforme a leitura desce.
 *
 * O traço vertical é `scrub`ado no scroll e os pontos acendem quando ele passa — a
 * sensação é de acumulação, que é o que a camada descreve no documento: as entregas
 * somam umas às outras até virarem resultado.
 *
 * O traço nasce em `scale-y-0` e só existe se o JS rodar; é puramente decorativo, e o
 * texto abaixo está sempre lá. As linhas em si usam `Reveal` (Framer Motion), o padrão
 * do projeto para aparição simples — ver CLAUDE.md.
 */
export function TheoryDeliverables({ deliverables }: { deliverables: Deliverable[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    const ctx = gsap.context(() => {
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 78%", scrub: true },
      });

      root.querySelectorAll<HTMLElement>(".theory-dot").forEach((dot) => {
        ScrollTrigger.create({
          trigger: dot,
          start: "top 72%",
          toggleClass: { targets: dot, className: "is-on" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [deliverables]);

  return (
    <div ref={rootRef} className="relative mt-14">
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-[0.625rem] top-0 w-px -translate-x-1/2 bg-move-purple/12"
      />
      <span
        ref={lineRef}
        aria-hidden="true"
        className="absolute bottom-0 left-[0.625rem] top-0 w-px -translate-x-1/2 origin-top scale-y-0 bg-move-purple"
      />

      <ol className="relative">
        {deliverables.map((deliverable, index) => (
          <li key={deliverable.number}>
            <Reveal delay={(index % 4) * 0.05}>
              <div className="grid grid-cols-[1.25rem_2.25rem_1fr] items-start gap-x-3 border-b border-move-purple/10 py-5 md:gap-x-5">
                <span aria-hidden="true" className="theory-dot mt-[0.55rem] h-[7px] w-[7px] justify-self-center rounded-full" />
                <span className="mt-1 text-eyebrow font-bold tabular-nums text-move-purple/35">
                  {deliverable.number}
                </span>
                <p className="text-body-lg leading-relaxed text-move-black/75">{deliverable.label}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
