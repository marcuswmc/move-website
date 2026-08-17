type IconProps = {
  size?: number;
  className?: string;
};

/**
 * Marcas de Instagram e LinkedIn, as mesmas que a Move já usa no site atual.
 *
 * Não vêm do `lucide-react`: a versão 1 do pacote removeu todos os ícones de marca, e
 * `Instagram`/`Linkedin` deixaram de existir lá. Em vez de prender o projeto a uma
 * versão antiga ou somar um pacote só por dois glifos, os desenhos foram extraídos do
 * header de move.social — assim as marcas seguem idênticas às que o público já associa
 * à Move, em vez de trocarem de forma na migração.
 *
 * São preenchidos (`fill`), não traçados: é assim que os dois desenhos são construídos
 * — no Instagram o contorno vem do recorte interno do próprio path, não de um stroke.
 * Por isso a cor se controla por `text-*` no elemento pai, via `currentColor`.
 */
/**
 * `scale` é correção óptica, não geometria: o LinkedIn é um glifo sólido e o Instagram
 * é vazado, então, desenhados no mesmo tamanho de caixa, o LinkedIn pesa visivelmente
 * mais. Encolhê-lo um pouco faz o par ler como do mesmo tamanho. A compensação mora
 * aqui, e não em quem chama, para que o header passe um `size` só e os dois continuem
 * equilibrados em qualquer lugar que sejam usados.
 */
const base = (size: number, className?: string, scale = 1) => ({
  width: Math.round(size * scale),
  height: Math.round(size * scale),
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
  className,
});

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z" />
      <circle cx="14.87" cy="5.26" r="1.09" />
      <path d="M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className, 0.92)}>
      <path d="M5.77,17.89 L5.77,7.17 L2.21,7.17 L2.21,17.89 L5.77,17.89 L5.77,17.89 Z M3.99,5.71 C5.23,5.71 6.01,4.89 6.01,3.86 C5.99,2.8 5.24,2 4.02,2 C2.8,2 2,2.8 2,3.85 C2,4.88 2.77,5.7 3.97,5.7 L3.99,5.7 L3.99,5.71 L3.99,5.71 Z" />
      <path d="M7.75,17.89 L11.31,17.89 L11.31,11.9 C11.31,11.58 11.33,11.26 11.43,11.03 C11.69,10.39 12.27,9.73 13.26,9.73 C14.55,9.73 15.06,10.71 15.06,12.15 L15.06,17.89 L18.62,17.89 L18.62,11.74 C18.62,8.45 16.86,6.92 14.52,6.92 C12.6,6.92 11.75,7.99 11.28,8.73 L11.3,8.73 L11.3,7.17 L7.75,7.17 C7.79,8.17 7.75,17.89 7.75,17.89 L7.75,17.89 L7.75,17.89 Z" />
    </svg>
  );
}
