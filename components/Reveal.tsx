import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Conteúdo já visível no SSR. `delay` segue aceito pelos consumidores existentes,
 * mas não posterga mais a leitura nem a exibição das imagens. */
export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}
