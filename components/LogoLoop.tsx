import Image from "next/image";
import Link from "next/link";

type Logo = {
  name: string;
  src: string;
  href?: string;
  /** Dimensões do arquivo enviado. Ausentes quando o logo é uma URL externa. */
  width?: number | null;
  height?: number | null;
};

type LogoLoopProps = {
  logos: readonly Logo[];
};

/**
 * Altura de referência: um logo de proporção 2:1 — a mais comum entre os parceiros —
 * ocupa 45px. Os outros são calculados a partir daqui.
 */
const AREA = 45 * 45 * 2;

/**
 * Limites da altura. Sem eles uma marca quadrada como a da Ação da Cidadania cresce
 * até dominar a faixa, e uma assinatura muito deitada como a da Rumo some.
 */
const MIN_HEIGHT = 32;
const MAX_HEIGHT = 52;

/** Proporção assumida quando o arquivo não informa a sua — a mediana do conjunto. */
const DEFAULT_RATIO = 2;

/**
 * Dar a mesma altura a todos os logos não os deixa do mesmo tamanho: uma marca
 * quadrada com 64px de altura ocupa o quádruplo da área de uma assinatura deitada com
 * os mesmos 64px, e é assim que ela é lida — enorme ao lado das outras. O que iguala
 * é a área, então a altura sai da proporção do arquivo: `h = √(área / proporção)`.
 *
 * Isso pressupõe que o arquivo esteja cortado na borda da tinta. Um logo com margem
 * embutida tem a proporção da margem, não a da marca, e volta a aparecer pequeno —
 * `pnpm logos:trim` cuida disso antes do upload.
 */
function logoHeight({ width, height }: Pick<Logo, "width" | "height">): number {
  const ratio = width && height ? width / height : DEFAULT_RATIO;
  return Math.round(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.sqrt(AREA / ratio))));
}

export function LogoLoop({ logos }: LogoLoopProps) {
  const loopedLogos = [...logos, ...logos];

  return (
    <div className="logo-loop overflow-hidden" aria-label="Organizações parceiras">
      <ul className="logo-loop-track flex w-max items-center" role="list">
        {loopedLogos.map((logo, index) => {
          const image = (
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width ?? 220}
              height={logo.height ?? 110}
              // A altura calculada entra como variável para o `sm:` poder crescê-la
              // junto com a célula, sem recalcular nada.
              style={{ "--logo-height": `${logoHeight(logo)}px` } as React.CSSProperties}
              className="h-[var(--logo-height)] w-auto max-w-full object-contain mix-blend-multiply sm:h-[calc(var(--logo-height)*1.15)]"
            />
          );
          return (
            <li key={`${logo.name}-${index}`} className="flex h-24 w-48 shrink-0 items-center justify-center px-6 sm:h-28 sm:w-60 sm:px-7" aria-hidden={index >= logos.length}>
              {logo.href ? (
                <Link href={logo.href} aria-label={logo.name} className="transition-opacity hover:opacity-70">
                  {image}
                </Link>
              ) : (
                image
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
