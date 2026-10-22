import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

type TheoryStepProps = {
  eyebrow: string;
  title: string;
  description?: string | null;
  /** Sobre Açaí a tipografia inverte — ver a tabela de contraste em lib/palette.ts. */
  light?: boolean;
  children?: React.ReactNode;
};

/** Cabeçalho de um elo da cadeia da Teoria de Mudança. */
export function TheoryStep({ eyebrow, title, description, light = false, children }: TheoryStepProps) {
  return (
    <Reveal>
      <SectionLabel dot={light ? "yellow" : "purple"} light={light}>
        {eyebrow}
      </SectionLabel>

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
