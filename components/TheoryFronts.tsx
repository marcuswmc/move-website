"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export type Front = { number: string; label: string; description: string };

/**
 * As quatro frentes se sobrepõem em cruz, como no diagrama oficial: elas não são
 * quatro serviços separados, e sim quatro modos de atuação que se cruzam no centro.
 * Um grid de cards perderia exatamente essa informação.
 */
const POSITIONS = ["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"] as const;

/**
 * Alternância na diagonal, igual ao PDF. As duas superfícies vêm da tabela de contraste
 * do guia (lib/palette.ts): sobre Açaí o texto é branco, sobre Ipê é preto.
 */
const SURFACES = [
  "bg-move-purple text-white",
  "bg-move-yellow text-move-black",
  "bg-move-yellow text-move-black",
  "bg-move-purple text-white",
] as const;

export function TheoryFronts({ fronts }: { fronts: Front[] }) {
  const [active, setActive] = useState(0);
  const current = fronts[active];

  return (
    <div className="grid items-center gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
      <motion.div
        className="relative mx-auto aspect-square w-full max-w-[26rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
      >
        {fronts.map((front, index) => {
          const isActive = index === active;
          return (
            <motion.button
              key={front.label}
              type="button"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              aria-pressed={isActive}
              /**
               * O destaque da frente ativa é escala, e ela passa pelo Motion: o Motion
               * escreve `transform` inline, então um `scale-*` do Tailwind aqui seria
               * sobrescrito e a frente selecionada não cresceria.
               */
              variants={{
                hidden: { scale: 0.55, opacity: 0 },
                visible: { scale: isActive ? 1.06 : 1, opacity: 1 },
              }}
              transition={{ duration: 0.7, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute flex h-[58%] w-[58%] items-center justify-center rounded-full p-6 text-center transition-shadow duration-300 ${
                POSITIONS[index] ?? "left-0 top-0"
              } ${SURFACES[index] ?? SURFACES[0]} ${isActive ? "z-20 shadow-editorial" : "z-10"}`}
            >
              <span className="text-sm font-bold leading-tight tracking-tight sm:text-base">{front.label}</span>
            </motion.button>
          );
        })}

        {/* Ponto de encontro das quatro frentes — o centro do grafismo original. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-move-offwhite"
        />
      </motion.div>

      <div aria-live="polite" className="min-h-[9rem]">
        {current && (
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-eyebrow font-bold uppercase text-move-purple/45">Frente {current.number}</p>
            <h3 className="mt-3 font-sans text-2xl font-medium leading-tight text-move-purple md:text-3xl">
              {current.label}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-move-black/65">{current.description}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
