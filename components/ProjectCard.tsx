import Image from "next/image";
import Link from "next/link";

import { BrandGlyph } from "@/components/BrandGlyph";
import type { ProjectCard as ProjectCardData } from "@/lib/content";
import { iconForEcosystem } from "@/lib/filterIcons";
import { surfaceForEcosystem } from "@/lib/palette";

/**
 * Card do portfólio.
 *
 * A forma é deliberadamente o oposto da do card de publicação: lá a imagem é uma faixa
 * no topo e o texto mora numa área branca embaixo; aqui a imagem ocupa o card inteiro,
 * em retrato, e o pouco texto que existe vem por cima. Numa varredura rápida da página
 * a silhueta já diz se aquilo é um projeto ou um material para ler, antes de qualquer
 * rótulo. A faixa de cor continua vindo do ecossistema (lib/palette.ts).
 *
 * Sem resumo de propósito: em quatro por linha o card fica com pouco mais de 240px, e
 * duas linhas de texto corrido ali viram ruído. Quem quer o resumo abre o projeto.
 */
export function ProjectCard({ project, priority = false }: { project: ProjectCardData; priority?: boolean }) {
  const surface = surfaceForEcosystem(project.ecosystem);

  return (
    <article className="group h-full">
      <Link
        href={`/portfolio/${project.slug}`}
        className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.25rem] p-5 text-white shadow-[0_2px_10px_rgba(84,53,93,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-editorial focus-visible:-translate-y-1 focus-visible:shadow-editorial"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div aria-hidden="true" className={`absolute inset-0 ${surface.bg}`} />

          {project.image.src ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            // Sem fotografia, o grafismo do ecossistema segura o card — melhor do que
            // um retângulo de cor chapada.
            <BrandGlyph
              src={iconForEcosystem(project.ecosystem)}
              className="absolute -bottom-6 -right-6 h-40 w-40 opacity-15"
            />
          )}

          {/* Dois degradês: o de baixo sustenta o bloco de título, o do topo existe só
              para a etiqueta e o ano não sumirem numa fotografia clara — testado com o
              céu claro do card do Arapyaú, onde branco sobre branco desaparecia. */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent"
          />
          <div aria-hidden="true" className="absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/15" />
        </div>

        {/* Só a etiqueta no topo. O ano acompanha o serviço lá embaixo porque o campo
            aceita texto livre no CMS ("2024 — em andamento"), e num card de 240px um
            valor desses disputava a mesma linha com o nome do ecossistema. */}
        <div className="relative">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-2.5 text-[0.6rem] font-bold uppercase leading-tight tracking-[0.08em] ${surface.chip}`}
          >
            <BrandGlyph src={iconForEcosystem(project.ecosystem)} className="h-3 w-3" />
            {project.ecosystem}
          </span>
        </div>

        <div className="relative">
          {/* Logo do cliente acima do título, quando o projeto tem um. Vai numa pastilha
              clara porque logo é arte fechada — não dá para recolorir para o fundo
              escuro. O limite é por altura E largura: o acervo mistura marcas quadradas
              (o Itaú Social é 90×90) com assinaturas em faixa, e travar só a altura
              deixaria as quadradas minúsculas ao lado das largas. */}
          {project.logo?.src && (
            <span className="mb-3 inline-flex items-center rounded-lg bg-white/95 px-2.5 py-2">
              <Image
                src={project.logo.src}
                alt={project.logo.alt || `Logo ${project.client}`}
                width={220}
                height={72}
                className="h-auto max-h-10 w-auto max-w-[8.5rem] object-contain"
              />
            </span>
          )}

          <h3 className="font-sans text-lg font-bold leading-tight text-white text-balance">{project.client}</h3>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/20 pt-3">
            <p className="line-clamp-2 text-[0.7rem] font-semibold leading-snug text-white/85">
              {project.service}
              <span className="text-white/60"> · {project.year}</span>
            </p>
            <span aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
