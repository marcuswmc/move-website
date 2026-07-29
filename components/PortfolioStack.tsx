import Image from "next/image";
import Link from "next/link";
import { portfolioProjects } from "@/data/site";
import { SectionLabel } from "@/components/SectionLabel";

const tones = {
  green: {
    card: "bg-move-green text-white",
    eyebrow: "text-move-mint",
    body: "text-white/75",
    button: "border-white/30 text-white hover:bg-white hover:text-move-green"
  },
  periwinkle: {
    card: "bg-move-periwinkle text-white",
    eyebrow: "text-move-yellow",
    body: "text-white/80",
    button: "border-white/30 text-white hover:bg-white hover:text-move-periwinkle"
  },
  purple: {
    card: "bg-move-purple text-white",
    eyebrow: "text-move-mint",
    body: "text-white/75",
    button: "border-white/30 text-white hover:bg-white hover:text-move-purple"
  },
  yellow: {
    card: "bg-move-yellow text-move-purple",
    eyebrow: "text-move-green",
    body: "text-move-purple/70",
    button: "border-move-purple/25 text-move-purple hover:bg-move-purple hover:text-white"
  }
} as const;

type PortfolioTone = keyof typeof tones;

export function PortfolioStack() {
  return (
    <section id="portfolio" className="bg-move-offwhite px-5 py-24 md:px-14 md:py-32">
      <div className="editorial-container">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionLabel dot="green">Portfólio</SectionLabel>
            <h2 className="max-w-3xl font-serif text-display-2 font-medium leading-[1.06] text-move-purple text-balance">
              Impactos que ganham forma em cada <span className="text-move-periwinkle">parceria.</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-move-purple/25 px-6 py-3.5 text-sm font-bold text-move-purple transition-[background-color,color,transform] duration-200 hover:bg-move-purple hover:text-white active:scale-[0.96]"
          >
            Ver todo o portfólio <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="portfolio-stack mt-14">
          {portfolioProjects.map((project, index) => {
            const tone = tones[project.tone as PortfolioTone];
            return (
              <article
                key={project.client}
                className={`portfolio-stack-card sticky overflow-hidden rounded-[1.5rem] ${tone.card}`}
                style={{ top: `calc(5.5rem + ${index * 1.25}rem)` }}
              >
                <div className="grid min-h-[35rem] md:grid-cols-[0.92fr_1.08fr]">
                  <div className="flex flex-col justify-between p-7 sm:p-10 md:p-12 lg:p-14">
                    <div>
                      <div className={`flex items-center gap-3 text-eyebrow font-bold uppercase ${tone.eyebrow}`}>
                        <span className="flex h-10 min-w-10 items-center justify-center rounded-full border border-current/30 px-2 text-xs">
                          {project.number}
                        </span>
                        <span>{project.category}</span>
                      </div>
                      <p className={`mt-10 text-sm font-bold uppercase tracking-[0.14em] ${tone.eyebrow}`}>{project.client}</p>
                      <h3 className="mt-4 max-w-md font-serif text-display-3 font-medium leading-[1.06] text-balance">{project.title}</h3>
                      <p className={`mt-6 max-w-md text-base leading-relaxed md:text-lg ${tone.body}`}>{project.description}</p>
                    </div>
                    <Link
                      href="/portfolio"
                      className={`mt-10 inline-flex w-fit items-center gap-3 rounded-full border px-5 py-3 text-sm font-bold transition-[background-color,color,transform] duration-200 active:scale-[0.96] ${tone.button}`}
                    >
                      Conhecer o projeto <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <div className="relative min-h-72 overflow-hidden md:min-h-0">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
