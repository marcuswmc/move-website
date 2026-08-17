"use client";

export type View = "grid" | "list";

const ICON_PATHS: Record<View, string> = {
  // Quatro quadrados / três linhas: os dois desenhos padrão para essa escolha.
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  list: "M4 6h16M4 12h16M4 18h16",
};

const LABELS: Record<View, string> = { grid: "Grade", list: "Lista" };

/**
 * Alternância entre grade e lista.
 *
 * Dois botões visíveis em vez de um só que troca de ícone: num controle de duas
 * posições, mostrar as duas opções ao mesmo tempo diz onde se está e para onde se vai,
 * sem depender de lembrar o que o ícone significa. O estado ativo é cor e fundo, não
 * apenas movimento.
 */
export function ViewToggle({ value, onChange }: { value: View; onChange: (view: View) => void }) {
  return (
    <div
      role="group"
      aria-label="Visualização"
      className="inline-flex shrink-0 gap-1 rounded-full border border-move-purple/20 bg-white p-1"
    >
      {(["grid", "list"] as const).map((view) => {
        const active = value === view;

        return (
          <button
            key={view}
            type="button"
            onClick={() => onChange(view)}
            aria-pressed={active}
            title={LABELS[view]}
            className={`grid h-8 w-8 place-items-center rounded-full transition-[background-color,color,scale] active:scale-[0.96] ${
              active ? "bg-move-purple text-white" : "text-move-purple/55 hover:bg-move-purple/10 hover:text-move-purple"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={view === "grid" ? 1.75 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d={ICON_PATHS[view]} />
            </svg>
            <span className="sr-only">{LABELS[view]}</span>
          </button>
        );
      })}
    </div>
  );
}
