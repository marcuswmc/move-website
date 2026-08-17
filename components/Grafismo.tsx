import Image from "next/image";

type GrafismoProps = {
  src: string;
  className?: string;
  animate?: "spin" | "float";
};

// Decorative brand grafismo (see docs/brand-guide-cores.md, p.13 "combinações monocromáticas")
// rendered big and faint in section corners, same treatment as FlowerGraphic in the Footer.
export function Grafismo({ src, className = "", animate = "spin" }: GrafismoProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={220}
      height={220}
      className={`pointer-events-none select-none ${animate === "spin" ? "flower-spin" : "float-slow"} ${className}`}
    />
  );
}
