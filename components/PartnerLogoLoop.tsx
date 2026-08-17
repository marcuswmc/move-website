import Link from "next/link";
import { Grafismo } from "@/components/Grafismo";
import { LogoLoop } from "@/components/LogoLoop";
import { SectionLabel } from "@/components/SectionLabel";

// `href` já chega resolvido de lib/content.ts: a página do projeto quando o cliente
// tem um só, /portfolio?cliente=… quando tem vários, /portfolio quando não tem nenhum.
export type Partner = { name: string; src: string; href: string };

export function PartnerLogoLoop({ partners }: { partners: Partner[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-move-purple py-24 text-white md:py-32">
      <div aria-hidden="true" className="absolute -right-32 top-[-9rem] -z-10 h-[32rem] w-[32rem] rounded-full border-[5rem] border-move-yellow/35" />
      <div aria-hidden="true" className="absolute -bottom-52 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full border-[4rem] border-white/5" />
      <Grafismo
        src="/brand/icons/Group 12.svg"
        animate="spin"
        className="pointer-events-none absolute -left-10 bottom-10 -z-10 w-32 opacity-[0.05] md:w-44"
      />
      <div className="editorial-container relative px-5 md:px-0">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionLabel dot="yellow" light>Com quem trabalhamos</SectionLabel>
            <h2 className="max-w-3xl font-sans text-display-3 font-bold leading-[1.02] tracking-[-0.03em] text-white text-balance">
              Parcerias para olhar melhor o que <span className="text-move-yellow">está em jogo.</span>
            </h2>
          </div>
          <Link href="/portfolio" className="inline-flex w-fit items-center gap-3 text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-yellow">
            Conheça nosso portfólio <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white py-3 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
          <LogoLoop
            logos={partners.map((partner) => ({
              name: partner.name,
              src: partner.src,
              href: partner.href
            }))}
          />
        </div>
      </div>
    </section>
  );
}
