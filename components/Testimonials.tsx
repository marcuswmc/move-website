"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { testimonials } from "@/data/site";
import { SectionLabel } from "@/components/SectionLabel";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const testimonial = testimonials[activeIndex];

  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);

  const slide = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <section id="relatos" className="bg-white px-5 py-24 md:px-14 md:py-32">
      <div className="editorial-container grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div className="flex flex-col justify-between lg:min-h-[32rem]">
          <div>
            <SectionLabel dot="yellow">Relatos</SectionLabel>
            <h2 className="max-w-md font-sans text-display-2 font-bold leading-[0.98] tracking-[-0.035em] text-move-purple text-balance">
              O que muda quando o caminho é <span className="text-move-periwinkle">construído junto.</span>
            </h2>
            <p className="mt-7 max-w-sm text-body-lg leading-relaxed text-move-black/65">
              Histórias de organizações que encontraram na Move uma parceria para olhar mais fundo para o que está em jogo.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3 lg:mt-0">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-move-purple/20 text-2xl text-move-purple transition-[background-color,color,transform] duration-200 hover:bg-move-purple hover:text-white active:scale-[0.96]"
              aria-label="Ver relato anterior"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-move-purple/20 text-2xl text-move-purple transition-[background-color,color,transform] duration-200 hover:bg-move-purple hover:text-white active:scale-[0.96]"
              aria-label="Ver próximo relato"
            >
              <span aria-hidden="true">→</span>
            </button>
            <span className="ml-3 text-sm font-bold tabular-nums text-move-purple/60" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-move-purple/10 bg-move-offwhite p-7 sm:p-10 md:p-14">
          <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[1.75rem] border-move-periwinkle/15" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={testimonial.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={slide}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.2, 0, 0, 1] }}
              className="relative flex min-h-[24rem] flex-col justify-between"
            >
              <blockquote>
                <span className="font-serif text-6xl leading-none text-move-periwinkle sm:text-7xl" aria-hidden="true">“</span>
                <p className="mt-2 max-w-3xl font-sans text-2xl font-semibold leading-[1.18] tracking-[-0.025em] text-move-purple sm:text-3xl md:text-4xl">
                  {testimonial.quote}
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-move-green text-sm font-bold text-move-mint">
                  {testimonial.initials}
                </span>
                <span>
                  <span className="block font-bold text-move-purple">{testimonial.name}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-move-black/60">
                    {testimonial.role} · {testimonial.organization}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="relative mt-8 flex gap-2" aria-label="Escolher relato">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-current={index === activeIndex ? "true" : undefined}
                aria-label={`Ver relato de ${item.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  index === activeIndex ? "w-8 bg-move-periwinkle" : "w-1.5 bg-move-purple/20 hover:bg-move-purple/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
