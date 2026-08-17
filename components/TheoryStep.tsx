import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

type TheoryStepProps = {
  /** Posição do elo na cadeia, 1-based. Aparece como "elo 03 / 06". */
  step: number;
  total: number;
  eyebrow: string;
  title: string;
  description?: string | null;
  /** Sobre Açaí a tipografia inverte — ver a tabela de contraste em lib/palette.ts. */
  light?: boolean;
  children?: React.ReactNode;
};

/**
 * Cabeçalho de um elo da cadeia da Teoria de Mudança.
 *
 * O contador "elo 03 / 06" é o que mantém a leitura orientada quando a barra lateral
 * não cabe na tela: sem ele, cada seção pareceria uma seção solta em vez de um passo
 * de uma sequência causal — que é justamente o que o documento oficial descreve.
 */
export function TheoryStep({ step, total, eyebrow, title, description, light = false, children }: TheoryStepProps) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <Reveal>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionLabel dot={light ? "yellow" : "purple"} light={light}>
          {eyebrow}
        </SectionLabel>
        <p
          className={`mb-6 text-eyebrow font-bold uppercase tabular-nums ${
            light ? "text-white/45" : "text-move-purple/40"
          }`}
        >
          elo {pad(step)} <span aria-hidden="true">/</span> {pad(total)}
        </p>
      </div>

      {/* `max-w-4xl`, e não 3xl: no corpo do display-2 a medida menor empurrava títulos
          de ~45 caracteres para três linhas. Aqui eles fecham em duas. */}
      <h2
        className={`max-w-4xl font-sans text-display-2 font-medium leading-[1.05] text-balance ${
          light ? "text-white" : "text-move-purple"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 max-w-2xl text-body-lg leading-relaxed ${
            light ? "text-white/75" : "text-move-black/65"
          }`}
        >
          {description}
        </p>
      )}

      {children}
    </Reveal>
  );
}
