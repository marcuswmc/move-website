import Image from "next/image";
import { containImage } from "@/lib/image-dimensions";
import Link from "next/link";

import { BrandGlyph } from "@/components/BrandGlyph";
import type { ProjectCard as ProjectCardData } from "@/lib/content";
import { iconForEcosystem } from "@/lib/filterIcons";
import { surfaceForProject } from "@/lib/palette";

/**
 * Card do portfólio: um bloco de cor da paleta, não uma fotografia.
 *
 * A versão anterior usava a imagem do projeto sangrada no card inteiro, com dois
 * degradês pretos por cima para o texto sobreviver a qualquer foto. Isso resolvia a
 * legibilidade e destruía a identidade: numa listagem de vinte projetos o que se via
 * era vinte retângulos escuros, e a cor da marca só aparecia na pastilha do
 * ecossistema. Com o fundo chapado a cor volta a ser o primeiro canal de leitura da
 * página — e o grafismo, que antes só aparecia em card sem foto, vira o segundo.
 *
 * A cor vem de `surfaceForProject`: a escolhida no CMS (campo "Cor do card"), ou a do
 * ecossistema quando o campo está em automático. Toda cor de texto sai da mesma
 * superfície, então Ipê e Areia ganham tipografia preta sem ninguém decidir isso aqui.
 *
 * Sem resumo de propósito: em quatro por linha o card fica com pouco mais de 240px, e
 * duas linhas de texto corrido ali viram ruído. Quem quer o resumo abre o projeto.
 *
 * A proporção é quadrada com teto de altura (`max-h-64`): sem fotografia, uma coluna
 * larga — as três de "Também em X", ou o celular em coluna única — viraria um bloco de
 * cor alto e quase vazio. Com o teto, o card deita em vez de crescer. O `w-full` não é
 * decorativo: com largura automática, o Chrome honra o teto encolhendo *os dois* lados
 * para manter o quadrado, e o card descolava da coluna no celular.
 */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const surface = surfaceForProject(project.cardColor, project.ecosystem);

  return (
    <article className="group h-full">
      <Link
        href={`/portfolio/${project.slug}`}
        className={`relative flex aspect-square max-h-64 w-full flex-col justify-between overflow-hidden rounded-[1.25rem] p-4 shadow-[0_2px_10px_rgba(84,53,93,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-editorial focus-visible:-translate-y-1 focus-visible:shadow-editorial ${surface.bg} ${surface.text}`}
      >
        {/* Grafismo do ecossistema como marca d'água. Herda a cor do texto (BrandGlyph
            pinta com currentColor), então clareia sobre Açaí e escurece sobre Ipê sem
            precisar de uma segunda regra. */}
        <BrandGlyph
          src={iconForEcosystem(project.ecosystem)}
          className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 opacity-[0.12] transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Só a etiqueta no topo. O ano acompanha o serviço lá embaixo porque o campo
            aceita texto livre no CMS ("2024 — em andamento"), e num card de 240px um
            valor desses disputava a mesma linha com o nome do ecossistema.

            A pastilha não pode mais usar `surface.chip`: a cor dela é a cor do card,
            e chapado sobre chapado não aparece. Daí o véu translúcido `surface.soft`. */}
        <div className="relative flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-2.5 text-[0.6rem] font-bold uppercase leading-tight tracking-[0.08em] ${surface.soft}`}
          >
            <BrandGlyph src={iconForEcosystem(project.ecosystem)} className="h-3 w-3" />
            {project.ecosystem}
          </span>
          {project.ecosystems.length > 1 && (
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[0.6rem] font-bold ${surface.soft}`}
              aria-label={`Mais ${project.ecosystems.length - 1} ${project.ecosystems.length === 2 ? "ecossistema" : "ecossistemas"}: ${project.ecosystems.slice(1).join(", ")}`}
              title={project.ecosystems.slice(1).join(", ")}
            >
              +{project.ecosystems.length - 1}
            </span>
          )}
        </div>

        <div className="relative">
          {/* Logo do cliente acima do título, quando o projeto tem um. Vai numa pastilha
              branca porque logo é arte fechada — não dá para recolorir para o fundo do
              card. O limite é por altura E largura: o acervo mistura marcas quadradas
              (o Itaú Social é 90×90) com assinaturas em faixa, e travar só a altura
              deixaria as quadradas minúsculas ao lado das largas. */}
          {project.logo?.src && (
            <span className="mb-2.5 inline-flex items-center rounded-lg bg-white px-2 py-1.5">
              <Image
                src={project.logo.src}
                alt={project.logo.alt || `Logo ${project.client}`}
                width={project.logo.width ?? 220}
                height={project.logo.height ?? 72}
                sizes="120px"
                style={containImage(project.logo.width ?? 220, project.logo.height ?? 72, 120, 32)}
                className="h-auto max-h-8 w-auto max-w-[7.5rem] object-contain"
              />
            </span>
          )}

          <h3 className="font-sans text-base font-bold leading-tight text-balance">{project.client}</h3>

          <div className={`mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5 ${surface.border}`}>
            <p className={`line-clamp-2 text-[0.68rem] font-semibold leading-snug ${surface.muted}`}>
              {project.service}
              <span className="opacity-70">{project.service ? " · " : ""}{project.year}</span>
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
