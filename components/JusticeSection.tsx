"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { images } from "@/data/images";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function JusticeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!headingRef.current) return;

      SplitText.create(headingRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="queremos"
      className="overflow-hidden bg-move-purple px-5 py-24 text-white md:px-14 md:py-32"
    >
      <div className="editorial-container grid gap-14 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <Reveal>
            <SectionLabel dot="yellow" light>
              O que queremos
            </SectionLabel>
          </Reveal>
          <h2 ref={headingRef} className="font-sans text-display-2 font-medium leading-[1.05]">
            Justiça social <br />e climática.
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-body-lg leading-relaxed text-white/75">
              Uma sociedade justa, equitativa, com direitos garantidos, contribuindo para a preservação
              e regeneração ambiental.
            </p>
          </Reveal>
        </div>
        <MediaFrame
          src={images.justice.src}
          alt={images.justice.alt}
          aspect="aspect-[4/5]"
          className="md:ml-auto md:w-full md:max-w-md"
        />
      </div>
    </section>
  );
}
