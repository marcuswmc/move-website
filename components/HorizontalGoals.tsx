"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { goals } from "@/data/site";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Tone = {
  bg: string;
  text: string;
  body: string;
  eyebrow: string;
  dot: string;
  ring: string;
  shadow: string;
};

const toneStyles: Record<string, Tone> = {
  purple: {
    bg: "bg-move-purple",
    text: "text-white",
    body: "text-white/75",
    eyebrow: "text-move-mint",
    dot: "bg-move-mint",
    ring: "ring-white/10",
    shadow: "shadow-[0_20px_45px_rgba(0,0,0,0.35)]",
  },
  green: {
    bg: "bg-move-green",
    text: "text-white",
    body: "text-white/75",
    eyebrow: "text-move-mint",
    dot: "bg-move-mint",
    ring: "ring-white/10",
    shadow: "shadow-[0_20px_45px_rgba(0,0,0,0.35)]",
  },
  periwinkle: {
    bg: "bg-move-periwinkle",
    text: "text-white",
    body: "text-white/80",
    eyebrow: "text-move-yellow",
    dot: "bg-move-yellow",
    ring: "ring-white/15",
    shadow: "shadow-[0_20px_45px_rgba(0,0,0,0.35)]",
  },
  light: {
    bg: "bg-move-offwhite",
    text: "text-move-purple",
    body: "text-move-purple/70",
    eyebrow: "text-move-green",
    dot: "bg-move-green",
    ring: "ring-move-purple/10",
    shadow: "shadow-editorial",
  },
  black: {
    bg: "bg-move-black",
    text: "text-white",
    body: "text-white/70",
    eyebrow: "text-move-yellow",
    dot: "bg-move-yellow",
    ring: "ring-white/10",
    shadow: "shadow-[0_20px_45px_rgba(0,0,0,0.35)]",
  },
};

export function HorizontalGoals() {
  const container = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".goal-panel");

      const scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".goals-track",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (panels.length - 1),
            delay: 0.05,
            duration: { min: 0.3, max: 0.7 },
            ease: "power2.inOut",
          },
          end: () => "+=" + window.innerWidth * panels.length,
          onUpdate: (self) => {
            setActiveIndex(Math.round(self.progress * (panels.length - 1)));
          },
        },
      });

      const panelTriggers = panels.map((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(panel.querySelector(".goal-content"), {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        }).from(
          panel.querySelector(".goal-image"),
          { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" },
          "-=0.7"
        );

        return tl.scrollTrigger;
      });

      // Landing here already scrolled in (e.g. a hash-anchor nav from another page)
      // can leave a panel's own trigger never crossing its "enter" threshold from
      // this fresh refresh, so its reveal never plays. Sync once against the
      // scroll position we actually mounted at instead of leaving it blank.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        panelTriggers.forEach((st) => {
          if (st?.isActive) st.animation?.progress(1);
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={container} id="narrativa" className="relative hidden overflow-hidden lg:block">
        <div className="goals-track flex" style={{ width: `${goals.length * 100}vw` }}>
          {goals.map((goal, index) => {
            const tone = toneStyles[goal.tone];
            return (
              <section
                key={goal.number}
                className={`goal-panel relative flex h-screen w-screen shrink-0 items-center overflow-hidden ${tone.bg} ${tone.text}`}
              >
                <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-10 md:grid-cols-[1.05fr_0.95fr] md:px-20">
                  <div className="goal-content max-w-2xl">
                    <span className={`mb-5 block text-eyebrow font-bold uppercase ${tone.eyebrow}`}>
                      {goal.eyebrow}
                    </span>
                    <h2 className="font-serif text-display-2 font-medium leading-[1.05] text-balance">
                      {goal.title}
                    </h2>
                    <p className={`mt-6 max-w-lg text-lg leading-relaxed ${tone.body}`}>{goal.body}</p>
                    {goal.cta && (
                      <Link
                        href={goal.cta.href}
                        className={`mt-8 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4 transition-opacity hover:opacity-80 ${tone.eyebrow}`}
                      >
                        {goal.cta.label} →
                      </Link>
                    )}
                  </div>

                  <div className="goal-image hidden md:block">
                    <div className="float-slow" style={{ animationDelay: `${-(index * 1.7)}s` }}>
                      <div
                        className={`relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] ring-1 ${tone.ring} ${tone.shadow}`}
                      >
                        <Image
                          src={goal.image}
                          alt={goal.imageAlt}
                          fill
                          sizes="(min-width: 768px) 35vw, 80vw"
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-2.5">
          {goals.map((goal, index) => (
            <span
              key={goal.number}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? `w-8 ${toneStyles[goal.tone].dot}` : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="bg-move-offwhite px-5 py-20 lg:hidden">
        <div className="editorial-container">
          <span className="mb-8 block text-eyebrow font-bold uppercase text-move-green">Teoria da mudança</span>
          <div className="grid gap-5">
            {goals.map((goal) => {
              const tone = toneStyles[goal.tone];
              return (
                <article key={goal.number} className={`overflow-hidden rounded-soft ${tone.bg} ${tone.text}`}>
                  <div className="relative h-44 w-full">
                    <Image src={goal.image} alt={goal.imageAlt} fill sizes="100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <span className={`block text-eyebrow font-bold uppercase ${tone.eyebrow}`}>{goal.eyebrow}</span>
                    <h3 className="mt-3 font-serif text-2xl font-medium">{goal.title}</h3>
                    <p className={`mt-3 leading-relaxed ${tone.body}`}>{goal.body}</p>
                    {goal.cta && (
                      <Link
                        href={goal.cta.href}
                        className={`mt-5 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4 ${tone.eyebrow}`}
                      >
                        {goal.cta.label} →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
