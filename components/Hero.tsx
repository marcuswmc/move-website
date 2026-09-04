import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import Link from "next/link";
import { MoveSymbol } from "@/components/MoveSymbol";
import { Reveal } from "@/components/Reveal";

type HeroProps = {
  hero: { eyebrow: string; title: string; body: SerializedEditorState };
  metrics: { value: string; label: string }[];
  affiliations: { label: string }[];
};

export function Hero({ hero, metrics, affiliations }: HeroProps) {
  return (
    <section
      id="hero"
      /**
       * `min-h`, e não `h`: com altura fixa e `justify-center`, uma tela baixa (Safari
       * no iPhone, com a barra de URL ocupando altura) deixa o conteúdo mais alto que a
       * caixa. O flex então centra o excedente e transborda para os dois lados,
       * ignorando o `padding-top` — o chapéu ia parar atrás do header. Com `min-h` a
       * seção cresce, o padding volta a valer e o header nunca cobre o texto.
       */
      className="grain-overlay relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-move-purple px-4 pb-8 pt-28 md:px-14 md:pb-10 md:pt-32"
    >
      {/* Move symbol — bled 50% off the right edge, lg+ only so it never competes with the copy on small screens */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-0 hidden items-center lg:flex">
        <MoveSymbol className="h-[87vh] max-h-[42rem] w-auto translate-x-1/2 text-move-yellow opacity-95 xl:h-[95vh] xl:max-h-[50rem]" />
      </div>

      <div className="editorial-container relative z-10">
        <div className="max-w-xl lg:max-w-3xl">
          <Reveal>
            <p className="mb-4 text-eyebrow font-bold uppercase text-move-yellow">{hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Sem line-clamp: o título é conteúdo de CMS e cortar com reticências
                esconderia texto que a Move escreveu. A escala abaixo foi reduzida até
                a chamada atual caber em duas linhas; se uma futura ficar mais longa,
                ela quebra para uma terceira linha em vez de sumir. */}
            <h1 className="text-balance font-sans text-[clamp(2rem,1.2rem+2.3vw,3.25rem)] font-bold leading-[1.05] text-white">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            {/* Rich text, não string: o texto de apoio é editado no admin com negrito e
                itálico. A tipografia continua vindo do contêiner — não do `editorial-prose`,
                que é escuro e feito para corpo de página — e o negrito sobe para branco
                pleno, que é o destaque que ele precisa ter sobre o roxo. */}
            <div className="mt-5 max-w-lg text-pretty text-body-lg leading-relaxed text-white/75 [&_p+p]:mt-4 [&_strong]:font-bold [&_strong]:text-white">
              <LexicalRichText data={hero.body} />
            </div>
          </Reveal>

          <Reveal delay={0.24} className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="/portfolio"
              className="rounded-full bg-move-yellow px-7 py-3.5 text-sm font-bold text-move-purple transition hover:bg-white active:scale-[0.96]"
            >
              Conheça nosso portfólio
            </Link>
            <Link
              href="/teoria-da-mudanca"
              className="text-sm font-bold text-white underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:text-move-yellow hover:decoration-white"
            >
              Ver teoria de mudança
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.32} className="mt-8 w-full max-w-3xl border-t border-white/15 pt-6">
          {/* Grade, não linha de baseline: com quatro números o par valor+legenda
              lado a lado estourava a largura e quebrava em pontos arbitrários. Empilhados
              em colunas, os quatro cabem numa faixa só a partir de `sm` e em 2×2 no
              celular, sem encolher o valor a ponto de ele deixar de ser o destaque. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-sans text-3xl font-bold tabular-nums leading-none text-white md:text-4xl">
                  {metric.value}
                </div>
                <p className="mt-1.5 text-sm font-medium leading-snug text-white/70">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Os selos passam a ocupar a própria faixa: as legendas agora são frases
              ("Associada à…"), largas demais para dividir a linha com os números. Sem
              caixa alta nem tracking pelo mesmo motivo — a versão maiúscula de uma frase
              inteira pesa e quebra pior. */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-5">
            {affiliations.map((item) => (
              <span
                key={item.label}
                className="rounded-soft border border-white/20 px-3.5 py-2 text-xs font-semibold text-white/70"
              >
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
