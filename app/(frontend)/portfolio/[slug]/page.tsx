import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { SectionLabel } from "@/components/SectionLabel";
import { getProject, getProjectSlugs, getRelatedProjects } from "@/lib/content";
import { surfaceForEcosystem } from "@/lib/palette";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Projeto não encontrado | Move Social" };

  return metadataFromSeo(project.meta, {
    title: `${project.client} · Portfólio | Move Social`,
    description: project.summary,
    image: project.image.src ? project.image : null,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const related = await getRelatedProjects(project.slug, project.ecosystem);
  const surface = surfaceForEcosystem(project.ecosystem);

  const facts = [
    { label: "Ecossistema", value: project.ecosystem },
    { label: "Serviço", value: project.service },
    { label: "Segmento", value: project.segment },
    { label: "Ano", value: project.year },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <main className="bg-move-offwhite">
      <section className="grain-overlay relative isolate overflow-hidden bg-move-purple px-5 pb-16 pt-28 text-white md:px-14 md:pb-20 md:pt-36">
        <div className="editorial-container relative z-10">
          <Reveal>
            <nav aria-label="Trilha de navegação" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/60">
                <li className="flex items-center gap-2">
                  <Link href="/" className="transition-colors hover:text-move-yellow">
                    Início
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li className="flex items-center gap-2">
                  <Link href="/portfolio" className="transition-colors hover:text-move-yellow">
                    Portfólio
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li className="text-white/80">{project.client}</li>
              </ol>
            </nav>

            <span
              className={`inline-block rounded-full px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${surface.chip}`}
            >
              {project.ecosystem}
            </span>

            {/* Logo do cliente acima do título, mesma pastilha clara do card: a arte do
                logo é fechada e não pode ser recolorida para o fundo Açaí. */}
            {project.logo?.src && (
              <span className="mt-6 flex w-fit items-center rounded-xl bg-white px-5 py-4">
                <Image
                  src={project.logo.src}
                  alt={project.logo.alt || `Logo ${project.client}`}
                  width={320}
                  height={104}
                  className="h-auto max-h-16 w-auto max-w-[15rem] object-contain"
                />
              </span>
            )}

            <h1 className="mt-5 max-w-4xl font-sans text-display-1 font-medium text-white text-balance">
              {project.client}
            </h1>
            {project.intro && (
              <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-white/75">{project.intro}</p>
            )}
          </Reveal>
        </div>
      </section>

      {project.image.src && (
        <section className="relative bg-move-purple px-5 md:px-14">
          <div className="editorial-container">
            <div className="relative aspect-[21/9] w-full translate-y-[-1px] overflow-hidden rounded-t-[1.5rem]">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                priority
                sizes="(min-width: 1340px) 1340px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-5 py-16 md:px-14 md:py-24">
        <div className="editorial-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div>
            <Reveal>
              <SectionLabel dot="purple">Desafio</SectionLabel>
              <p className="max-w-2xl text-body-lg leading-relaxed text-move-black/75">{project.challenge}</p>
            </Reveal>

            <Reveal delay={0.08} className="mt-14">
              <SectionLabel dot="yellow">Resultados</SectionLabel>
              <p className="max-w-2xl text-body-lg leading-relaxed text-move-black/75">{project.results}</p>
            </Reveal>

            {project.description && (
              <Reveal delay={0.12} className="mt-14 border-t border-move-purple/10 pt-12">
                <RichText data={project.description} />
              </Reveal>
            )}
          </div>

          <aside className="lg:pt-2">
            <Reveal delay={0.1}>
              <dl className="rounded-[1.25rem] border border-move-purple/12 bg-move-offwhite p-6">
                {facts.map((fact, index) => (
                  <div key={fact.label} className={index > 0 ? "mt-5 border-t border-move-purple/10 pt-5" : ""}>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-move-purple/60">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-move-purple">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/contato"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-move-purple px-6 py-3.5 text-sm font-bold text-white transition hover:bg-move-purple/90"
              >
                Falar sobre um projeto assim
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-move-offwhite px-5 py-16 md:px-14 md:py-24">
          <div className="editorial-container">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <SectionLabel dot="purple">Também em {project.ecosystem}</SectionLabel>
                  <h2 className="max-w-2xl font-sans text-display-3 font-bold text-move-purple text-balance">
                    Outros projetos do mesmo ecossistema.
                  </h2>
                </div>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-bold text-move-purple underline decoration-move-yellow decoration-2 underline-offset-4 transition-colors hover:decoration-move-purple"
                >
                  Ver todo o portfólio <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
