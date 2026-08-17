/**
 * Grafismo da marca desenhado com a cor do texto.
 *
 * Os SVGs em public/brand/icons têm as cores gravadas no arquivo, então renderizá-los
 * com <Image> devolveria sempre o mesmo tom — e um ícone de filtro precisa acompanhar
 * o estado (normal, ativo, indisponível). A máscara CSS usa o desenho apenas como
 * recorte e pinta o vão com `currentColor`: um arquivo só, recolorido por CSS.
 */
export function BrandGlyph({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
