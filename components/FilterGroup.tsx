"use client";

import { BrandGlyph } from "@/components/BrandGlyph";

export const ALL = "__all__";

export type FilterOption = {
  value: string;
  /** Quantos projetos sobram com essa opção, mantidos os demais filtros. */
  count: number;
  /** Grafismo da marca, quando a dimensão tem um (ver lib/filterIcons.ts). */
  icon?: string;
};

type FilterGroupProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

/**
 * Um grupo do filtro lateral de /portfolio: título e lista vertical de opções.
 *
 * Uma escolha por grupo, e clicar na opção ativa desmarca — é a leitura mais direta de
 * uma lista assim, e evita o estado em que se acumulam filtros que se anulam. Opção que
 * zeraria a listagem aparece apagada e desativada em vez de sumir: a lista de rótulos é
 * parte do que a página comunica sobre o trabalho da Move, e um item que some a cada
 * clique faz o filtro inteiro parecer instável. A contagem ao lado é o que explica por
 * que aquele item está apagado — sem ela, o estado desativado não se justifica sozinho.
 */
export function FilterGroup({ label, value, options, onChange }: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 font-sans text-base font-semibold text-move-black">{label}</legend>

      <ul className="-mx-2.5">
        {options.map((option) => {
          const active = value === option.value;
          const empty = option.count === 0 && !active;

          return (
            <li key={option.value}>
              <button
                type="button"
                disabled={empty}
                aria-pressed={active}
                onClick={() => onChange(active ? ALL : option.value)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm leading-snug transition-colors ${
                  active
                    ? "bg-move-purple/10 font-bold text-move-purple"
                    : empty
                      ? "cursor-not-allowed font-medium text-move-purple/30"
                      : "font-medium text-move-purple/85 hover:bg-move-purple/5 hover:text-move-purple"
                }`}
              >
                {option.icon ? (
                  <BrandGlyph src={option.icon} className="h-4 w-4" />
                ) : (
                  <span aria-hidden="true" className="h-4 w-4 shrink-0" />
                )}
                <span className="flex-1">{option.value}</span>
                <span className="shrink-0 text-[0.7rem] font-semibold tabular-nums opacity-50">{option.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
