"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

import { getLenis } from "@/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export type ChainLink = { id: string; label: string };

/**
 * Leva a um elo pelo Lenis, e não pelo salto nativo do navegador.
 *
 * Um `<a href="#id">` comum move o documento por baixo do Lenis, que segue interpolando
 * em direção ao alvo antigo e puxa a página de volta. É o mesmo motivo de existir o
 * components/HashScrollSync.tsx — aqui a correção é local aos links da cadeia.
 */
function scrollToLink(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -80 });
  else target.scrollIntoView({ behavior: "smooth" });
}

/**
 * Sumário da cadeia, no topo da página: mostra a sequência inteira antes de percorrê-la
 * e serve de atalho para qualquer elo — inclusive nas larguras em que o trilho lateral
 * não aparece.
 */
export function TheoryChainSummary({ links }: { links: ChainLink[] }) {
  return (
    <ol className="mt-14 grid gap-px overflow-hidden rounded-soft border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link, index) => (
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            onClick={(event) => {
              event.preventDefault();
              window.history.pushState(null, "", `#${link.id}`);
              scrollToLink(link.id);
            }}
            className="flex h-full items-baseline gap-3 bg-move-purple px-5 py-4 transition-colors duration-300 hover:bg-white/10"
          >
            <span className="text-eyebrow font-bold tabular-nums text-move-yellow">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-semibold text-white/85">{link.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Trilho fixo que acompanha a leitura da cadeia da Teoria de Mudança.
 *
 * A Teoria de Mudança é uma sequência causal: cada elo só faz sentido sabendo de onde
 * veio e para onde vai. Numa página longa isso se perde — o trilho devolve essa
 * orientação mostrando, o tempo todo, em que ponto da cadeia o leitor está e quanto
 * falta, e permite pular direto para qualquer elo.
 *
 * Só aparece a partir de `xl`: abaixo disso não há goteira livre ao lado do conteúdo,
 * e o contador "elo 03 / 06" de cada cabeçalho (components/TheoryStep.tsx) já cumpre
 * o mesmo papel de orientação.
 */
export function TheoryChainNav({ links }: { links: ChainLink[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      /**
       * Um gatilho por seção, com o marcador a 45% da viewport: o elo vira "atual"
       * quando seu conteúdo está de fato sendo lido, não quando encosta na borda.
       */
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      ScrollTrigger.create({
        trigger: sections[0],
        start: "top 65%",
        endTrigger: sections[sections.length - 1],
        end: "bottom bottom",
        onToggle: (self) => setVisible(self.isActive),
      });
    });

    return () => ctx.revert();
  }, [links]);

  const goTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    // Pelo Lenis, e não por scrollIntoView: o salto nativo briga com o raf do Lenis,
    // que continua interpolando em direção ao alvo antigo (ver components/HashScrollSync.tsx).
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -80 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Elos da teoria de mudança"
      className={`fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      } transition-opacity duration-500`}
    >
      {/*
        Só os pontos ficam visíveis; o rótulo aparece no hover/foco. Com os rótulos
        sempre abertos o trilho chegava a ~196px, e o conteúdo começa em ~76px na
        largura em que ele estreia — ou seja, ele cobriria o texto. Assim a coluna fixa
        cabe na calha, e o rótulo só invade a página no instante em que é pedido.
      */}
      <ol className="relative flex flex-col gap-6">
        <span aria-hidden="true" className="absolute bottom-1 left-[3px] top-1 w-px bg-move-purple/15" />
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-1 w-px bg-move-purple transition-[height] duration-500 ease-out"
          style={{ height: `calc(${((active + 1) / links.length) * 100}% - 4px)` }}
        />

        {links.map((link, index) => {
          const isActive = index === active;
          return (
            <li key={link.id} className="relative flex">
              <button
                type="button"
                onClick={() => goTo(link.id)}
                aria-current={isActive ? "step" : undefined}
                className="group relative flex h-[7px] w-[7px] items-center justify-center"
              >
                <span className="sr-only">{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-[7px] w-[7px] rounded-full transition-all duration-300 ${
                    isActive
                      ? "scale-[1.6] bg-move-purple"
                      : index < active
                        ? "bg-move-purple/50"
                        : "bg-move-purple/20 group-hover:bg-move-purple/60"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-6 whitespace-nowrap rounded-full bg-move-purple px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {link.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
