"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import type { Member } from "@/components/TeamSection";

type TeamCarouselProps = {
  members: Member[];
  eyebrow: string;
  title: string;
  body: string;
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* O trilho é um scroller nativo com scroll-snap; as setas só chamam scrollBy. Assim o
   arrasto no touch e a navegação por teclado continuam funcionando sem código extra, e
   o `behavior` fica por conta do CSS (`scroll-smooth`) — que o bloco global de
   prefers-reduced-motion em globals.css já neutraliza. O Lenis não intercepta
   containers internos (SmoothScroll não liga syncTouch), então nada de data-lenis-prevent,
   que quebraria o scroll vertical da página por cima do carrossel. */
export function TeamCarousel({ members, eyebrow, title, body }: TeamCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  /**
   * Card com o resumo aberto. No mouse quem abre é o hover, mas no toque não existe
   * hover — antes o resumo ficava permanentemente aberto no celular, tapando a foto e
   * enchendo o card. O toque agora é o gesto que abre e fecha, e um card por vez fica
   * aberto para a lista não virar um paredão de texto.
   */
  const [openCard, setOpenCard] = useState<string | null>(null);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncEdges();
    track.addEventListener("scroll", syncEdges, { passive: true });
    // O trilho muda de largura no resize e quando as fontes carregam.
    const observer = new ResizeObserver(syncEdges);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", syncEdges);
      observer.disconnect();
    };
  }, [syncEdges]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.firstElementChild;
    // Um card por clique, incluindo o gap-5 (20px) entre eles.
    const amount = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction });
  };

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-12">
      <Reveal className="flex flex-col justify-between">
        <div>
          <SectionLabel dot="yellow">{eyebrow}</SectionLabel>
          <h2 className="font-sans text-display-3 font-bold leading-[1.02] text-move-purple text-balance">{title}</h2>
          <p className="mt-5 leading-relaxed text-move-black/65">{body}</p>
        </div>

        <p className="mt-10 text-eyebrow font-bold uppercase text-move-purple/55">Conheça quem faz</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Ver pessoas anteriores"
            className="flex size-12 items-center justify-center rounded-full border border-move-purple/25 text-move-purple transition hover:border-move-purple hover:bg-move-purple hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Ver mais pessoas"
            className="flex h-12 w-16 items-center justify-center rounded-full bg-move-purple text-white transition hover:bg-move-purple/90 disabled:pointer-events-none disabled:opacity-25"
          >
            <Arrow direction="right" />
          </button>
        </div>
      </Reveal>


      {/* O trilho termina na borda do .editorial-container: o último card fica cortado
          ali, sinalizando que a lista continua, sem desalinhar da grade da página.

          `min-w-0` é o que faz o carrossel existir no mobile. Item de grid nasce com
          `min-width: auto`, então esta coluna esticava até a largura somada dos cards
          (1148px numa tela de 393px): `scrollWidth` ficava igual a `clientWidth` e não
          havia excedente para rolar nem arrastar. O `minmax(0,…)` do `md:` já resolvia
          isso a partir de tablet — faltava a coluna única do mobile. */}
      <div className="min-w-0">
        <ul
          ref={trackRef}
          tabIndex={0}
          aria-label={`Equipe da Move — ${members.length} pessoas`}
          className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {members.map((member) => {
            /* Estado aberto e estado "abre no hover/foco" são exclusivos, escolhidos com
               ternário em vez de empilhar `grid-rows-[0fr]` e `grid-rows-[1fr]` na mesma
               lista de classes: entre duas utilitárias de igual especificidade quem vence
               é a ordem no CSS gerado, não a ordem no atributo — daria sorte. */
            const isOpen = openCard === member.name;

            return (
              <li key={member.name} className="w-[min(74vw,17rem)] shrink-0 snap-start">
                {/* Botão, e não article: no toque o card precisa de um gesto para abrir
                    o resumo, e virar controle real dá de brinde foco por teclado e o
                    `aria-expanded` que anuncia o estado. */}
                <button
                  type="button"
                  onClick={() => setOpenCard(isOpen ? null : member.name)}
                  aria-expanded={member.bio ? isOpen : undefined}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-move-purple/10 text-left"
                >
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(min-width: 768px) 272px, 74vw"
                    className={`object-cover transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:grayscale-0 ${
                      isOpen ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  {/* Dois scrims em cruzamento de opacidade: gradiente não interpola em
                      CSS, então o hover não poderia "escurecer" um único gradiente. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-move-purple from-0% via-move-purple/35 via-30% to-transparent to-60%"
                  />
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-t from-move-purple via-move-purple/85 to-move-purple/25 transition-opacity duration-500 ${
                      isOpen
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {/* 0fr → 1fr abre a altura real do resumo sem precisar medir nada. */}
                    {member.bio && (
                      <div
                        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]"
                        }`}
                      >
                        <p className="overflow-hidden text-[0.8125rem] leading-relaxed text-white/85">
                          <span className="block pb-4">{member.bio}</span>
                        </p>
                      </div>
                    )}
                    <p className="text-eyebrow font-bold uppercase text-move-yellow">{member.specialty}</p>
                    <p className="mt-2 text-xl font-bold leading-tight text-white">{member.name}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
