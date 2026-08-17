"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ALL, FilterGroup } from "@/components/FilterGroup";
import type { FilterOption } from "@/components/FilterGroup";
import { ProjectCard } from "@/components/ProjectCard";
import { SearchField } from "@/components/SearchField";
import type { ProjectCard as ProjectCardData } from "@/lib/content";
import { iconForEcosystem, iconForService } from "@/lib/filterIcons";
import { ECOSYSTEMS, SEGMENTS } from "@/lib/taxonomy";

/** Normaliza para busca: minúsculas e sem acento, para "arapyau" achar "Arapyaú". */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** As três dimensões da classificação, na ordem em que aparecem no filtro. */
const DIMENSIONS = ["ecosystem", "service", "segment"] as const;
type Dimension = (typeof DIMENSIONS)[number];

const LABELS: Record<Dimension, string> = {
  ecosystem: "Ecossistema",
  service: "Serviço",
  segment: "Segmento",
};

const PICK: Record<Dimension, (project: ProjectCardData) => string | null> = {
  ecosystem: (project) => project.ecosystem,
  service: (project) => project.service,
  segment: (project) => project.segment,
};

const ICON: Record<Dimension, ((value: string) => string) | null> = {
  ecosystem: iconForEcosystem,
  service: iconForService,
  // Segmento é a natureza jurídica da organização, não um tema — sem grafismo, como no
  // material do cliente.
  segment: null,
};

type Selection = Record<Dimension, string>;

const NOTHING_SELECTED: Selection = { ecosystem: ALL, service: ALL, segment: ALL };

const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");

/**
 * As opções de cada grupo, em ordem alfabética pt-BR.
 *
 * Ecossistema e Segmento são listas fechadas no CMS, então aparecem inteiras — inclusive
 * o que ainda não tem projeto, apagado e com contagem zero. Isso é intencional: os
 * rótulos dizem em que campos a Move atua, e uma lista que encolhe conforme o acervo
 * esconderia metade dessa mensagem. Serviço é texto livre no admin, então não há lista
 * canônica para exibir — ali as opções só podem sair dos projetos cadastrados.
 */
const optionsFor = (projects: ProjectCardData[], dimension: Dimension): string[] => {
  if (dimension === "ecosystem") return [...ECOSYSTEMS].sort(byName);
  if (dimension === "segment") return [...SEGMENTS].sort(byName);

  return Array.from(
    new Set(projects.map(PICK[dimension]).filter((value): value is string => Boolean(value))),
  ).sort(byName);
};

export function PortfolioBrowser({ projects }: { projects: ProjectCardData[] }) {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>(NOTHING_SELECTED);

  /**
   * O logo de um cliente com vários projetos leva para cá com `?cliente=slug`. O filtro
   * mora no estado, e não na URL, para o resto da navegação não empilhar histórico a
   * cada clique — mas segue o parâmetro quando ele muda, para voltar/avançar funcionar.
   */
  const clientParam = useSearchParams().get("cliente");
  const [client, setClient] = useState<string | null>(clientParam);
  useEffect(() => setClient(clientParam), [clientParam]);

  const clientName = useMemo(
    () => (client ? (projects.find((project) => project.clientSlug === client)?.client ?? null) : null),
    [projects, client],
  );

  const matches = useMemo(() => {
    const term = normalize(query.trim());

    /** `ignore` fica de fora da conta — é assim que se contam facetas. */
    return (project: ProjectCardData, current: Selection, ignore?: Dimension) => {
      if (client && project.clientSlug !== client) return false;

      for (const dimension of DIMENSIONS) {
        if (dimension === ignore) continue;
        if (current[dimension] !== ALL && PICK[dimension](project) !== current[dimension]) return false;
      }

      if (!term) return true;

      // A busca cobre cliente, resumo e serviço — é o que alguém digita quando lembra do
      // projeto, mas não do rótulo exato da classificação.
      return [project.client, project.summary, project.service].some((field) => normalize(field).includes(term));
    };
  }, [query, client]);

  const filtered = useMemo(
    () => projects.filter((project) => matches(project, selection)),
    [projects, matches, selection],
  );

  /**
   * Cada opção mostra quantos projetos restariam se ela fosse escolhida — ou seja,
   * contada contra todos os outros filtros, mas não contra o próprio grupo.
   */
  const groups = useMemo(
    () =>
      DIMENSIONS.map((dimension) => {
        const pool = projects.filter((project) => matches(project, selection, dimension));
        const icon = ICON[dimension];

        const options: FilterOption[] = optionsFor(projects, dimension).map((value) => ({
          value,
          count: pool.filter((project) => PICK[dimension](project) === value).length,
          icon: icon?.(value),
        }));

        return { dimension, options };
      }),
    [projects, matches, selection],
  );

  const hasFilters =
    query.trim() !== "" || client !== null || DIMENSIONS.some((dimension) => selection[dimension] !== ALL);

  const clear = () => {
    setQuery("");
    setClient(null);
    setSelection(NOTHING_SELECTED);
  };

  const filters = (
    <div className="grid gap-7">
      <SearchField
        label="Buscar por cliente ou projeto"
        value={query}
        onChange={setQuery}
        placeholder="Cliente ou projeto"
      />

      {clientName && (
        <button
          type="button"
          onClick={() => setClient(null)}
          className="flex items-center justify-between gap-2 rounded-full bg-move-purple px-4 py-2 text-left text-xs font-bold text-white transition-[background-color,scale] hover:bg-move-purple/90 active:scale-[0.98]"
        >
          <span className="truncate">Cliente: {clientName}</span>
          <span aria-hidden="true">✕</span>
          <span className="sr-only">Remover filtro de cliente</span>
        </button>
      )}

      {groups.map(({ dimension, options }) =>
        options.length > 0 ? (
          <FilterGroup
            key={dimension}
            label={LABELS[dimension]}
            value={selection[dimension]}
            options={options}
            onChange={(value) => setSelection((current) => ({ ...current, [dimension]: value }))}
          />
        ) : null,
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="w-full rounded-full border border-move-purple/25 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-move-purple transition-[background-color,color,scale] hover:bg-move-purple hover:text-white active:scale-[0.98]"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <section className="bg-move-offwhite px-5 py-14 md:px-14 md:py-20">
      <div className="editorial-container grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
        {/* No desktop o filtro acompanha a rolagem; no celular vira um painel que abre,
            para não empurrar a listagem para baixo da dobra. */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filters}</div>
        </aside>

        <details className="group rounded-[1.25rem] border border-move-purple/12 bg-white p-4 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-sm font-bold text-move-purple [&::-webkit-details-marker]:hidden">
            Filtros
            <span aria-hidden="true" className="text-xs transition-transform duration-200 group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="mt-6">{filters}</div>
        </details>

        <div>
          <p aria-live="polite" className="text-sm font-semibold text-move-purple">
            {filtered.length} {filtered.length === 1 ? "projeto" : "projetos"}
            {hasFilters && <span className="font-medium text-move-black/50"> de {projects.length}</span>}
          </p>

          {filtered.length > 0 ? (
            // Quatro por linha a partir de xl (1280px), onde o card fica com ~216px e
            // sobe para ~240px num monitor de 1440. Abaixo disso vai direto para duas:
            // descontada a barra lateral, três colunas em 1024 deixariam cada card com
            // 189px — estreito a ponto de o nome do cliente quebrar em três linhas.
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filtered.map((project, index) => (
                <ProjectCard key={project.slug} project={project} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-move-purple/25 bg-white px-6 py-16 text-center">
              <p className="font-sans text-xl font-bold text-move-purple">Nenhum projeto encontrado.</p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-move-black/60">
                Tente outra combinação de filtros ou limpe a busca para ver todo o portfólio.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-7 rounded-full bg-move-purple px-6 py-3 text-sm font-bold text-white transition-[background-color,scale] hover:bg-move-purple/90 active:scale-[0.96]"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
