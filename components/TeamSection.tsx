"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const cardOffsets = [0, 64, 18, 82, 34, 76, 12];

export function TeamSection() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current || !viewportRef.current || !trackRef.current) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".team-scroll-card");
        const distance = () => Math.max(0, trackRef.current!.scrollWidth - window.innerWidth + 96);

        const scrollTween = gsap.to(trackRef.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewportRef.current,
            start: "top top",
            end: () => `+=${distance() + window.innerWidth * 0.45}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true
          }
        });

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 56 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 88%",
                end: "left 44%",
                scrub: true
              }
            }
          );
        });
      });

      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="equipe" className="relative overflow-hidden bg-move-black text-white">
      <div ref={viewportRef} className="relative flex min-h-dvh flex-col justify-between overflow-hidden py-20 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <span className="absolute -left-5 top-[8%] font-sans text-[clamp(8rem,22vw,23rem)] font-bold leading-none tracking-[-0.09em] text-white/[0.035]">
            move.
          </span>
          <span className="absolute -right-20 bottom-[-18%] h-[32rem] w-[32rem] rounded-full border-[4rem] border-move-periwinkle/30" />
        </div>

        <div className="editorial-container relative z-10 px-5 md:px-0">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-eyebrow font-bold uppercase text-move-mint">
                <span className="h-2 w-2 rounded-full bg-move-yellow" /> Quem move a Move
              </p>
              <h2 className="mt-5 max-w-3xl font-sans text-display-2 font-bold leading-[0.98] tracking-[-0.04em] text-balance">
                Pessoas que fazem parte do <span className="text-move-mint">campo.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/65 lg:text-right">
              Percorra para conhecer a equipa que constrói cada processo junto.
            </p>
          </div>
        </div>

        <div className={`relative z-10 mt-10 ${reducedMotion ? "overflow-x-auto" : "overflow-hidden"} lg:mt-12`}>
          <div
            ref={trackRef}
            className="flex w-max items-end gap-5 px-5 pb-3 md:gap-7 md:px-14 lg:pl-[max(2.5rem,calc((100vw-1340px)/2))] lg:pr-24"
            role="list"
            aria-label="Integrantes da equipa Move"
          >
            {teamMembers.map((member, index) => (
              <article
                key={member.name}
                className="team-scroll-card w-[min(78vw,19rem)] shrink-0 overflow-hidden rounded-[1.25rem] bg-move-offwhite text-move-purple shadow-[0_16px_35px_rgba(0,0,0,0.24)] lg:w-[21rem]"
                style={{ marginBottom: `${cardOffsets[index]}px` }}
                role="listitem"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={member.image} alt={member.imageAlt} fill sizes="(min-width: 1024px) 336px, 78vw" className="object-cover" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                </div>
                <div className="border-t border-move-purple/10 p-5">
                  <p className="text-lg font-bold leading-tight">{member.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-move-purple/65">{member.specialty}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="editorial-container relative z-10 mt-8 px-5 md:px-0">
          <p className="text-sm text-white/50 lg:hidden">Deslize para explorar a equipa.</p>
          <div className="hidden h-px w-full bg-white/15 lg:block" />
        </div>
      </div>
    </section>
  );
}
