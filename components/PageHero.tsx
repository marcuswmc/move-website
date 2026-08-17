import Link from "next/link";

import { Grafismo } from "@/components/Grafismo";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

type Crumb = { label: string; href: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
};

/**
 * Faixa Açaí do topo das páginas internas. Texto em branco porque é o que a tabela
 * de contraste do guia manda sobre Açaí — preto ali é combinação classificada como
 * "evitar".
 */
export function PageHero({ eyebrow, title, description, breadcrumbs, children }: PageHeroProps) {
  return (
    <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-14 pt-28 text-white md:px-14 md:pb-20 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full border-[6rem] border-move-yellow/[0.14] md:-right-24 md:h-[34rem] md:w-[34rem] md:border-[9rem]" />
      </div>
      <Grafismo
        src="/brand/icons/Group 12.svg"
        animate="spin"
        className="pointer-events-none absolute -bottom-16 -left-12 -z-10 w-40 opacity-[0.07] md:w-56"
      />

      <div className="editorial-container relative z-10">
        <Reveal>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Trilha de navegação" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/60">
                {breadcrumbs.map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    <Link href={crumb.href} className="transition-colors hover:text-move-yellow">
                      {crumb.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <SectionLabel dot="yellow" light>
            {eyebrow}
          </SectionLabel>
          <h1 className="max-w-4xl font-sans text-display-1 font-medium text-white text-balance">{title}</h1>
          {description && (
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-white/75">{description}</p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
