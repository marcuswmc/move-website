import Link from "next/link";
import { LogoLoop } from "@/components/LogoLoop";
import { SectionLabel } from "@/components/SectionLabel";

const partners = [
  { name: "Instituto de Cidadania Empresarial", src: "/partners/instituto-cidadania-empresarial.webp" },
  { name: "GIFE", src: "/partners/gife.webp" },
  { name: "NOSSAS", src: "/partners/nossas.webp" },
  { name: "AMAZ", src: "/partners/amaz.webp" },
  { name: "Instituto ACP", src: "/partners/instituto-acp.webp" },
  { name: "Fundo Vale", src: "/partners/fundo-vale.webp" },
  { name: "Itaú Social", src: "/partners/itau-social.webp" },
  { name: "Laudes Foundation", src: "/partners/laudes-foundation.webp" },
  { name: "Instituto Alana", src: "/partners/instituto-alana.webp" },
  { name: "Escolas Criativas", src: "/partners/escolas-criativas.webp" }
] as const;

export function PartnerLogoLoop() {
  return (
    <section className="relative isolate overflow-hidden bg-move-purple py-24 text-white md:py-32">
      <div aria-hidden="true" className="absolute -right-32 top-[-9rem] -z-10 h-[32rem] w-[32rem] rounded-full border-[5rem] border-move-periwinkle/35" />
      <div aria-hidden="true" className="absolute -bottom-52 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full border-[4rem] border-white/5" />
      <div className="editorial-container relative px-5 md:px-0">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionLabel dot="yellow" light>Com quem trabalhamos</SectionLabel>
            <h2 className="max-w-3xl font-sans text-display-3 font-bold leading-[1.02] tracking-[-0.03em] text-white text-balance">
              Parcerias para olhar melhor o que <span className="text-move-mint">está em jogo.</span>
            </h2>
          </div>
          <Link href="/portfolio" className="inline-flex w-fit items-center gap-3 text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-mint">
            Conheça nosso portfólio <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white py-3 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
          <LogoLoop logos={partners} />
        </div>
      </div>
    </section>
  );
}
