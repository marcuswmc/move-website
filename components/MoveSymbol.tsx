type MoveSymbolProps = {
  className?: string;
};

/**
 * O símbolo da Move (o "o" com o ponto) desenhado inline.
 *
 * Fica inline, e não como `<Image src="/brand/icon_move.svg">`, porque o guia da
 * marca prevê o símbolo em cores diferentes conforme o fundo — e um SVG carregado
 * por `src` é opaco ao CSS da página: nenhuma classe alcança o `fill` lá dentro.
 * Com `currentColor`, a cor passa a ser uma classe de texto como qualquer outra.
 */
export function MoveSymbol({ className = "" }: MoveSymbolProps) {
  return (
    <svg
      viewBox="0 0 230 365"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M171.57 257.926C171.57 226.4 147.457 200.891 115 200.891C82.5433 200.891 58.43 226.4 58.43 257.926C58.43 289.453 82.0783 314.496 115 314.496C147.922 314.496 171.57 288.523 171.57 257.926ZM196.148 179.09C216.09 197.171 230 225.005 230 257.926C230 290.848 216.09 318.216 196.148 336.298C178.983 352.068 153.023 364.583 115 364.583C76.9767 364.583 51.0033 352.055 33.8517 336.298C13.91 318.216 0 290.383 0 257.926C0 225.47 13.91 197.185 33.8517 179.09C51.0166 163.32 76.9767 150.805 115 150.805C153.023 150.805 178.997 163.333 196.148 179.09Z"
        fill="currentColor"
      />
      <path
        d="M171.57 57.035C171.57 25.5083 147.457 0 115 0C82.5433 0 58.43 25.5083 58.43 57.035C58.43 88.5617 82.0783 113.605 115 113.605C147.922 113.605 171.57 87.6317 171.57 57.035Z"
        fill="currentColor"
      />
    </svg>
  );
}
