"use client";

import { motion } from "framer-motion";

export function TheoryRings() {
  return (
    <motion.svg
      viewBox="0 0 520 520"
      className="mx-auto aspect-square w-full max-w-[560px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20% 0px" }}
      aria-label="Para quem fazemos"
    >
      <motion.circle
        cx="260"
        cy="260"
        r="220"
        fill="#54355D"
        variants={{ hidden: { scale: 0.72, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "260px 260px" }}
      />
      <motion.circle
        cx="260"
        cy="260"
        r="162"
        fill="#F2F2F2"
        variants={{ hidden: { scale: 0.64, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "260px 260px" }}
      />
      <motion.circle
        cx="260"
        cy="260"
        r="112"
        fill="#FACA77"
        variants={{ hidden: { scale: 0.56, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.85, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "260px 260px" }}
      />
      <motion.circle
        cx="260"
        cy="260"
        r="68"
        fill="#FFFFFF"
        variants={{ hidden: { scale: 0.42, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "260px 260px" }}
      />
      <text x="260" y="252" textAnchor="middle" className="fill-move-purple font-sans text-[19px] font-medium">
        Pessoas
      </text>
      <text x="260" y="276" textAnchor="middle" className="fill-move-purple/70 text-[13px] font-semibold uppercase tracking-[0.1em]">
        do campo
      </text>
      <text x="260" y="116" textAnchor="middle" className="fill-move-purple text-[13px] font-bold uppercase tracking-[0.14em]">
        Organizações de impacto
      </text>
      <text x="260" y="465" textAnchor="middle" className="fill-move-offwhite/85 text-[12px] font-bold uppercase tracking-[0.12em]">
        Campo de impacto socioambiental positivo
      </text>
    </motion.svg>
  );
}
