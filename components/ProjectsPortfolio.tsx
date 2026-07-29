"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioCases } from "@/data/site";
import InfiniteMenu, { type InfiniteMenuItem } from "@/components/InfiniteMenu";

const allValue = "Todos";

const unsplashProjectImages: Record<string, string> = {
  "instituto-arapyau": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
  "fundacao-lemann": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
  "itau-social": "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=85",
  unicef: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85",
  "rumo-logistica": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85",
  labora: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85",
  ecosocial: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=85",
  "projeto-guri": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=85",
  sustenidos: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=900&q=85",
  nossas: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=85",
  "instituto-alana": "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=900&q=85",
  "instituto-acp": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  "escolas-criativas": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85",
  unesco: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=85",
  CAIXA: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=85"
};

export function ProjectsPortfolio() {
  const [ecosystem, setEcosystem] = useState(allValue);
  const [service, setService] = useState(allValue);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const ecosystems = useMemo(
    () => Array.from(new Set(portfolioCases.map((project) => project.ecosystem))),
    []
  );
  const services = useMemo(
    () => Array.from(new Set(portfolioCases.map((project) => project.service))),
    []
  );
  const filteredProjects = useMemo(
    () =>
      portfolioCases.filter(
        (project) =>
          (ecosystem === allValue || project.ecosystem === ecosystem) &&
          (service === allValue || project.service === service)
      ),
    [ecosystem, service]
  );
  const activeProject = activeProjectId
    ? filteredProjects.find((project) => project.id === activeProjectId)
    : undefined;
  const menuItems = useMemo<InfiniteMenuItem[]>(
    () =>
      filteredProjects.map((project) => ({
        image: unsplashProjectImages[project.id] ?? project.image,
        title: project.client,
        description: `${project.ecosystem} · ${project.year}`
      })),
    [filteredProjects]
  );
  const handleActiveItemChange = useCallback((item: InfiniteMenuItem) => {
    const project = filteredProjects.find((candidate) => candidate.client === item.title);
    if (project) setActiveProjectId(project.id);
  }, [filteredProjects]);

  return (
    <section className="min-h-dvh bg-black pt-[4.5rem] lg:h-dvh lg:overflow-hidden lg:pt-[4.9rem]">
      <div className="grid min-h-[calc(100dvh-4.5rem)] lg:h-[calc(100dvh-4.9rem)] lg:grid-cols-[minmax(18rem,30%)_minmax(0,70%)]">
        <div className="order-2 flex min-h-0 flex-col bg-move-offwhite px-5 py-7 sm:px-8 lg:order-1 lg:overflow-y-auto lg:px-8 lg:py-9 xl:px-10">
          <div className="mx-auto flex w-full max-w-[42rem] flex-1 flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-move-purple/15 pb-5">
              <div>
                <p className="text-eyebrow font-bold uppercase tracking-[0.16em] text-move-periwinkle">Portfólio</p>
                <h1 className="mt-2 font-serif text-[clamp(2.4rem,3.8vw,4.25rem)] font-medium leading-[0.9] tracking-[-0.04em] text-move-purple">
                  Projetos
                </h1>
              </div>
              <span className="mt-1 shrink-0 text-xs font-bold tabular-nums text-move-purple/55">
                {filteredProjects.length} de {portfolioCases.length}
              </span>
            </div>

            <div className="grid gap-3 border-b border-move-purple/15 py-5">
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-move-purple/65">
                Ecossistema
                <select value={ecosystem} onChange={(event) => { setEcosystem(event.target.value); setActiveProjectId(null); }} className="min-w-0 appearance-none rounded-full border border-move-purple/20 bg-white px-4 py-2.5 text-sm font-semibold normal-case tracking-normal text-move-purple outline-none transition focus:border-move-periwinkle focus:ring-2 focus:ring-move-periwinkle/20">
                  <option value={allValue}>Todos os ecossistemas</option>
                  {ecosystems.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-move-purple/65">
                Serviço
                <select value={service} onChange={(event) => { setService(event.target.value); setActiveProjectId(null); }} className="min-w-0 appearance-none rounded-full border border-move-purple/20 bg-white px-4 py-2.5 text-sm font-semibold normal-case tracking-normal text-move-purple outline-none transition focus:border-move-periwinkle focus:ring-2 focus:ring-move-periwinkle/20">
                  <option value={allValue}>Todos os serviços</option>
                  {services.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {activeProject ? (
                <motion.article key={activeProject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }} className="flex flex-1 flex-col py-7">
                  <div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] font-bold uppercase tracking-[0.11em] text-move-periwinkle">
                      <span>{activeProject.ecosystem}</span>
                      <span className="text-move-purple/40">{activeProject.year}</span>
                    </div>
                  </div>
                  <h2 className="mt-4 font-serif text-[clamp(2.2rem,3.4vw,3.8rem)] font-medium leading-[0.94] tracking-[-0.04em] text-move-purple">{activeProject.client}</h2>
                  <p className="mt-4 border-l-2 border-move-periwinkle pl-3 text-xs font-semibold leading-relaxed text-move-purple/70">{activeProject.service}</p>

                  <dl className="mt-8 space-y-7 border-t border-move-purple/15 pt-6">
                    <div>
                      <dt className="text-eyebrow font-bold uppercase tracking-[0.15em] text-move-periwinkle">Desafio</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-move-purple/75">{activeProject.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-eyebrow font-bold uppercase tracking-[0.15em] text-move-green">Resultados</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-move-purple/75">{activeProject.results}</dd>
                    </div>
                  </dl>
                </motion.article>
              ) : filteredProjects.length ? (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="my-auto max-w-[15rem] pb-12 font-serif text-2xl leading-tight text-move-purple/55">
                  Escolha um projeto para abrir sua leitura.
                </motion.p>
              ) : (
                <div className="py-12 text-move-purple/70">
                  <p className="font-serif text-2xl leading-tight">Nenhum projeto encontrado.</p>
                  <button type="button" onClick={() => { setEcosystem(allValue); setService(allValue); }} className="mt-5 rounded-full border border-move-purple/25 px-4 py-2.5 text-sm font-bold text-move-purple transition hover:bg-move-purple hover:text-white active:scale-[0.96]">Limpar filtros</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="order-1 min-h-[32rem] bg-black lg:order-2 lg:min-h-0">
          {filteredProjects.length > 0 && (
            <InfiniteMenu items={menuItems} scale={9} onActiveItemChange={handleActiveItemChange} />
          )}
        </div>
      </div>
    </section>
  );
}
