"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";

export type Audience = { number: string; label: string; summary: string; description: string };

/**
 * Os três públicos como anéis concêntricos, como no diagrama oficial: pessoas no
 * centro, organizações em volta, campo abraçando tudo. A forma carrega a tese —
 * cada camada contém a anterior, então fortalecer uma alcança as de fora.
 *
 * Descrito de fora para dentro, que é a ordem em que os círculos precisam ser
 * empilhados. Os dados chegam do centro para fora (a ordem do CMS e do PDF), por
 * isso a lista é invertida na renderização.
 *
 * Superfícies conferidas na tabela de contraste do guia (lib/palette.ts): Lavanda e
 * Ipê pedem texto preto; Off White, texto Açaí. O fundo da seção é Açaí, então os
 * três anéis clareiam em direção ao centro.
 *
 * Medidas em unidades do viewBox 0–100, que é a mesma caixa do contêiner quadrado:
 * `radius` é o raio do círculo e `textRadius`, o meio da faixa onde o rótulo corre.
 * Assim raio do círculo e raio do texto não podem sair de sincronia.
 */
const RINGS = [
  { size: "h-full w-full", surface: "bg-move-periwinkle", radius: 50, textRadius: 41 },
  { size: "h-[64%] w-[64%]", surface: "bg-move-yellow", radius: 32, textRadius: 25 },
  { size: "h-[36%] w-[36%]", surface: "bg-move-offwhite", radius: 18, textRadius: null },
] as const;

/**
 * Arco da esquerda para a direita passando por cima, no raio pedido. É sobre ele que
 * o rótulo corre: texto reto não cabe na corda do círculo — "CAMPO DE IMPACTO
 * SOCIOAMBIENTAL POSITIVO" transbordava as bordas do anel — enquanto na curva ele
 * acompanha a circunferência e tem a faixa inteira para ocupar.
 */
const arcPath = (radius: number) => `M ${50 - radius} 50 A ${radius} ${radius} 0 0 1 ${50 + radius} 50`;

export function TheoryAudienceRings({ audiences }: { audiences: Audience[] }) {
  // Índice na lista original (centro → fora), para não embaralhar o que vem do CMS.
  const [active, setActive] = useState(0);
  const current = audiences[active];
  // Sem os dois-pontos que o React usa no id: eles atrapalham como fragmento de URL
  // no `href` do textPath.
  const arcId = useId().replace(/:/g, "");

  /** Do anel externo para o interno: é a ordem de empilhamento no DOM. */
  const outerToInner = audiences.map((audience, index) => ({ audience, index })).reverse();

  return (
    <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
      <motion.div
        /**
         * `containerType: inline-size` deixa o rótulo do centro medir em `cqw`, ou seja,
         * em porcentagem da largura do próprio diagrama. Os rótulos curvos não precisam
         * disso: vivem no SVG e escalam junto com o viewBox.
         */
        style={{ containerType: "inline-size" }}
        className="relative mx-auto aspect-square w-full max-w-[30rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
      >
        {outerToInner.map(({ audience, index }, depth) => {
          const ring = RINGS[depth] ?? RINGS[RINGS.length - 1];
          const isActive = index === active;
          const isCenter = ring.textRadius === null;

          return (
            <motion.button
              key={audience.label}
              type="button"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              aria-pressed={isActive}
              /**
               * Escala e opacidade passam pelo Motion, não por classe do Tailwind: o
               * Motion escreve `transform` e `opacity` inline, e estilo inline vence
               * classe — um `scale-*` ou `opacity-*` utilitário aqui seria ignorado.
               */
              variants={{
                hidden: { scale: 0.6, opacity: 0 },
                visible: { scale: 1, opacity: isActive ? 1 : 0.72 },
              }}
              transition={{ duration: 0.8, delay: depth * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: depth + 1 }}
              /**
               * Centralizado por `inset-0 m-auto`, e não por `left-1/2 -translate-x-1/2`:
               * o `transform` do Motion substituiria o translate e tiraria os anéis do
               * eixo comum, desconcentrando o diagrama.
               */
              className={`absolute inset-0 m-auto flex items-center justify-center rounded-full text-center ${ring.size} ${ring.surface}`}
            >
              {/* Nos anéis externos o rótulo visível é o texto curvo do SVG; aqui fica
                  só o nome acessível, que é o que dá voz ao botão. */}
              {isCenter ? (
                <span
                  style={{ fontSize: "clamp(0.5rem, 3.4cqw, 1rem)" }}
                  className="max-w-[82%] font-bold uppercase leading-tight tracking-[0.08em] text-move-purple"
                >
                  {audience.label}
                </span>
              ) : (
                <span className="sr-only">{audience.label}</span>
              )}
            </motion.button>
          );
        })}

        {/*
          Camada só dos rótulos curvos, acima de todos os anéis para que o círculo de
          dentro não corte o texto do de fora. `pointer-events-none` deixa o clique
          atravessar até o anel correspondente, que continua sendo o alvo real.
        */}
        <motion.svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-40 h-full w-full"
        >
          <defs>
            {outerToInner.map(({ audience }, depth) => {
              const ring = RINGS[depth] ?? RINGS[RINGS.length - 1];
              if (ring.textRadius === null) return null;
              return (
                <path
                  key={audience.label}
                  id={`${arcId}-${depth}`}
                  d={arcPath(ring.textRadius)}
                  fill="none"
                />
              );
            })}
          </defs>

          {outerToInner.map(({ audience, index }, depth) => {
            const ring = RINGS[depth] ?? RINGS[RINGS.length - 1];
            if (ring.textRadius === null) return null;

            return (
              <text
                key={audience.label}
                fontSize="3.4"
                letterSpacing="0.26"
                textAnchor="middle"
                className="fill-move-black font-bold"
                style={{ opacity: index === active ? 1 : 0.72, transition: "opacity 0.3s ease" }}
              >
                {/*
                  `dy` de 0.35em em vez de `dominant-baseline`: sobre um textPath a
                  linha de base fica na borda externa do arco, e o deslocamento traz o
                  bloco de glifos para o meio da faixa em qualquer navegador.
                */}
                <textPath href={`#${arcId}-${depth}`} startOffset="50%" dy="0.35em">
                  {audience.label.toUpperCase()}
                </textPath>
              </text>
            );
          })}
        </motion.svg>
      </motion.div>

      <div aria-live="polite" className="min-h-[11rem]">
        {current && (
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-eyebrow font-bold uppercase text-move-yellow">Camada {current.number}</p>
            <h3 className="mt-3 font-sans text-2xl font-medium leading-tight text-white md:text-3xl">
              {current.label}
            </h3>
            <p className="mt-2 text-body-lg leading-relaxed text-white/85">{current.summary}</p>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">{current.description}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
