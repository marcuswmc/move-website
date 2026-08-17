"use client";

import { useEffect, useMemo, useState } from "react";

import { PublicationCard } from "@/components/PublicationCard";
import { PublicationRow } from "@/components/PublicationRow";
import { SearchField } from "@/components/SearchField";
import { ViewToggle } from "@/components/ViewToggle";
import type { View } from "@/components/ViewToggle";
import type { PublicationCard as PublicationCardData } from "@/lib/content";
import { surfaceByName } from "@/lib/palette";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

type Category = { slug: string; name: string; color: string };

const ALL = "__all__";

/** Onde a preferência de visualização fica guardada entre visitas. */
const VIEW_KEY = "move:publicacoes:view";

export function PublicationsBrowser({
  publications,
  categories,
}: {
  publications: PublicationCardData[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  /**
   * Começa sempre em grade e só depois lê a preferência salva: ler o localStorage no
   * primeiro render faria o HTML do servidor divergir do cliente na hidratação.
   */
  const [view, setView] = useState<View>("grid");

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "grid" || saved === "list") setView(saved);
  }, []);

  const chooseView = (next: View) => {
    setView(next);
    window.localStorage.setItem(VIEW_KEY, next);
  };

  /**
   * Só entram no filtro as categorias que realmente têm publicação — uma pílula que
   * sempre devolve lista vazia é ruído.
   */
  const usedCategories = useMemo(() => {
    const used = new Set(publications.flatMap((item) => item.categories.map((c) => c.slug)));
    return categories.filter((item) => used.has(item.slug));
  }, [publications, categories]);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());

    return publications.filter((publication) => {
      if (category !== ALL && !publication.categories.some((c) => c.slug === category)) return false;
      if (!term) return true;

      return [publication.title, publication.synopsis].some((field) => normalize(field).includes(term));
    });
  }, [publications, query, category]);

  const clear = () => {
    setQuery("");
    setCategory(ALL);
  };

  return (
    <section className="bg-move-offwhite px-4 py-14 md:px-14 md:py-20">
      <div className="editorial-container">
        <div className="flex flex-wrap items-center gap-3 border-b border-move-purple/12 pb-6">
          <SearchField
            label="Buscar publicações"
            value={query}
            onChange={setQuery}
            placeholder="Título ou assunto"
            className="w-full sm:w-64"
          />

          {usedCategories.length > 0 && (
            <div role="group" aria-label="Categorias" className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCategory(ALL)}
                aria-pressed={category === ALL}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-[background-color,border-color,color,scale] active:scale-[0.96] ${
                  category === ALL
                    ? "bg-move-purple text-white"
                    : "border border-move-purple/20 bg-white text-move-purple hover:border-move-purple/50"
                }`}
              >
                Todas
              </button>

              {usedCategories.map((item) => {
                const active = category === item.slug;
                const surface = surfaceByName(item.color);

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setCategory(active ? ALL : item.slug)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 rounded-full py-2 pl-3 pr-4 text-xs font-bold uppercase tracking-[0.08em] transition-[background-color,border-color,color,scale] active:scale-[0.96] ${
                      active
                        ? surface.chip
                        : "border border-move-purple/20 bg-white text-move-purple hover:border-move-purple/50"
                    }`}
                  >
                    {/* O ponto adianta a cor da categoria: quem escolhe já sabe de que
                        cor as etiquetas dos cards vão ficar. */}
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${active ? "bg-current opacity-70" : surface.bg}`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="ml-auto">
            <ViewToggle value={view} onChange={chooseView} />
          </div>
        </div>

        <p aria-live="polite" className="mt-6 text-sm font-semibold text-move-purple">
          {filtered.length} {filtered.length === 1 ? "publicação" : "publicações"}
          {filtered.length !== publications.length && (
            <span className="font-medium text-move-black/50"> de {publications.length}</span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-move-purple/25 bg-white px-6 py-16 text-center">
            <p className="font-sans text-xl font-bold text-move-purple">Nenhuma publicação encontrada.</p>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-move-black/60">
              Tente outra categoria ou limpe a busca para ver todo o acervo.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-7 rounded-full bg-move-purple px-6 py-3 text-sm font-bold text-white transition-[background-color,scale] hover:bg-move-purple/90 active:scale-[0.96]"
            >
              Limpar filtros
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((publication, index) => (
              <PublicationCard key={publication.slug} publication={publication} priority={index < 3} />
            ))}
          </div>
        ) : (
          <ul className="mt-8 rounded-[1.5rem] bg-white px-5 py-2 md:px-8">
            {filtered.map((publication, index) => (
              <PublicationRow key={publication.slug} publication={publication} priority={index < 3} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
