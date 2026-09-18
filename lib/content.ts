import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { cache } from "react";

import { TAG, cachedRead } from "@/lib/cache";
import { ensureLexical } from "@/lib/lexical";
import { SURFACE_AUTO } from "@/lib/palette";
import { getPayloadClient } from "@/lib/payload";
import { taxonomyValues } from "@/lib/project-taxonomy";
import { displayNumber, resolveImage } from "@/lib/resolveImage";
import type { ResolvedImage } from "@/lib/resolveImage";
import type { Project, Publication, PublicationCategory } from "@/payload-types";

/**
 * Camada de leitura do CMS. Devolve exatamente as formas que os componentes já
 * consumiam quando o conteúdo vivia em data/site.ts, para que os componentes
 * sigam presentacionais (ver CLAUDE.md) e nada de Payload vaze para dentro deles.
 *
 * Toda leitura passa por `cachedRead` (lib/cache.ts): `cache()` do React deduplica
 * dentro de um request — o header e o rodapé leem o mesmo global sem ir duas vezes
 * ao banco — e `unstable_cache` guarda o resultado entre requests, com uma tag por
 * collection/global. O CMS invalida a tag ao salvar, então o cache pode durar sem
 * atrasar a publicação.
 */

/** Nas leituras públicas só entra o que foi publicado; rascunhos ficam no admin. */
const PUBLISHED = { _status: { equals: "published" } } as const;

const IMAGE_FALLBACK: ResolvedImage = { src: "", alt: "" };

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

const DAY_FORMAT = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Sao_Paulo" });

const MONTH_YEAR_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

const formatDate = (value: string) => DATE_FORMAT.format(new Date(value));

export const getSiteSettings = cachedRead(async () => {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings" });

  return {
    navItems: (settings.nav ?? []).map((item) => ({ label: item.label, href: item.href })),
    contact: settings.contact,
    /**
     * Só as redes de fato preenchidas. Montar a lista aqui — em vez de mandar o grupo
     * cru para o header — deixa o componente apenas iterar: sem link cadastrado, não
     * existe item, então nunca há ícone apontando para lugar nenhum.
     */
    social: [
      { name: "Instagram" as const, href: settings.social?.instagram },
      { name: "LinkedIn" as const, href: settings.social?.linkedin },
    ].filter((item): item is { name: "Instagram" | "LinkedIn"; href: string } => Boolean(item.href?.trim())),
    metrics: (settings.metrics ?? []).map((metric) => ({ value: metric.value, label: metric.label })),
  };
},
  "site-settings",
  [TAG.siteSettings],
);

export const getHomeContent = cachedRead(async () => {
  const payload = await getPayloadClient();
  const home = await payload.findGlobal({ slug: "home" });

  const heroBody = ensureLexical(home.hero.body);

  return {
    meta: home.meta,
    hero: {
      eyebrow: home.hero.eyebrow,
      title: home.hero.title,
      body: heroBody,
      /** O mesmo texto sem formatação — a descrição de SEO não aceita marcação. */
      bodyText: convertLexicalToPlaintext({ data: heroBody }),
    },
    affiliations: (home.affiliations ?? []).map((item) => ({ label: item.label })),
    showcase: (home.showcase ?? []).map((project, index) => {
      const image = resolveImage(project.image) ?? IMAGE_FALLBACK;
      return {
        number: displayNumber(index),
        client: project.client,
        category: project.category,
        title: project.title,
        description: project.description,
        image: image.src,
        imageAlt: image.alt,
        blurDataURL: image.blurDataURL,
        tone: project.tone,
      };
    }),
  };
},
  "home",
  [TAG.home, TAG.media],
);

export const getServices = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "services",
    where: PUBLISHED,
    sort: "order",
    limit: 0,
    depth: 0,
  });

  return docs.map((service, index) => ({
    number: displayNumber(index),
    title: service.title,
    body: service.body,
    icon: service.icon,
  }));
},
  "services",
  [TAG.services],
);

export type PublicationCard = {
  slug: string;
  title: string;
  synopsis: string;
  cover: ResolvedImage;
  type: "article" | "download" | "external";
  publishedAt: string;
  /**
   * Data já formatada no servidor. Formatar em componente cliente arriscaria uma
   * divergência de hidratação quando o fuso do visitante difere do fuso do build.
   */
  publishedLabel: string;
  /** Dia e mês/ano separados, para a coluna de data da visualização em lista. */
  publishedDay: string;
  publishedMonthYear: string;
  author: string | null;
  categories: { slug: string; name: string; color: string }[];
  /**
   * Toda publicação tem página própria — inclusive as de link externo, porque a
   * página carrega o texto que apresenta e contextualiza o material. A ação final
   * (baixar, ou seguir para fora) mora lá dentro, não no card.
   */
  href: string;
  /** Dica curta do que esperar ao clicar. */
  actionLabel: string;
  featured: boolean;
};

/** Rótulo padrão do botão da subpage, quando a Move não escreve um próprio. */
const DEFAULT_ACTION_LABEL: Record<PublicationCard["type"], string> = {
  article: "Ler publicação",
  download: "Baixar publicação",
  external: "Acessar publicação",
};

/** Dica curta exibida no card da listagem. */
const CARD_ACTION_LABEL: Record<PublicationCard["type"], string> = {
  article: "Ler mais",
  download: "Baixar",
  external: "Acessar",
};

type PublicationSummary = Pick<Publication, "slug" | "title" | "synopsis" | "cover" | "type" | "publishedAt" | "author" | "categories" | "featured">;

const toPublicationCard = (publication: PublicationSummary): PublicationCard => {
  const cover = resolveImage(publication.cover) ?? IMAGE_FALLBACK;

  const categories = (publication.categories ?? [])
    .filter((category): category is PublicationCategory => typeof category === "object")
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      color: category.color,
    }));

  return {
    slug: publication.slug,
    title: publication.title,
    synopsis: publication.synopsis ?? "",
    cover,
    type: publication.type,
    publishedAt: publication.publishedAt,
    publishedLabel: formatDate(publication.publishedAt),
    publishedDay: DAY_FORMAT.format(new Date(publication.publishedAt)),
    // "ago. de 2026" → "ago 2026": a coluna de data é estreita.
    publishedMonthYear: MONTH_YEAR_FORMAT.format(new Date(publication.publishedAt)).replace(/\.?\s*de\s*/, " "),
    author: publication.author ?? null,
    categories,
    href: `/publicacoes/${publication.slug}`,
    actionLabel: CARD_ACTION_LABEL[publication.type],
    featured: publication.featured ?? false,
  };
};

/** Os campos que o card consome. Fora daqui, o Payload traria o corpo em rich text
 * de 52 publicações para desenhar uma grade de capas. */
const PUBLICATION_CARD_SELECT = {
  slug: true, title: true, synopsis: true, cover: true, type: true,
  publishedAt: true, author: true, categories: true, featured: true,
} as const;

export const getPublications = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "publications",
    where: PUBLISHED,
    sort: "-publishedAt",
    limit: 0,
    depth: 1,
    select: PUBLICATION_CARD_SELECT,
  });

  return docs.map(toPublicationCard);
},
  "publications",
  [TAG.publications, TAG.publicationCategories, TAG.media],
);

/** As 3 destacadas mais recentes; sem destaques, as 3 mais recentes. */
export const getHomePublications = cachedRead(async () => {
  const payload = await getPayloadClient();
  const query = {
    collection: "publications" as const,
    sort: "-publishedAt",
    limit: 3,
    depth: 1,
    pagination: false,
    select: PUBLICATION_CARD_SELECT,
  } as const;
  const featured = await payload.find({
    ...query,
    where: { and: [PUBLISHED, { featured: { equals: true } }] },
  });
  const { docs } = featured.docs.length ? featured : await payload.find({ ...query, where: PUBLISHED });
  return docs.map(toPublicationCard);
},
  "home-publications",
  [TAG.publications, TAG.publicationCategories, TAG.media],
);

/**
 * As publicações que fecham a página de uma publicação. Existe separado de
 * `getPublications` porque a página precisa de três cards e não do acervo inteiro:
 * carregar 52 documentos para descartar 49 é trabalho que o banco faz à toa em cada
 * revalidação.
 */
export const getRelatedPublications = cachedRead(
  async (slug: string, limit = 3) => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "publications",
      where: { ...PUBLISHED, slug: { not_equals: slug } },
      sort: "-publishedAt",
      limit,
      depth: 1,
      pagination: false,
      select: PUBLICATION_CARD_SELECT,
    });

    return docs.map(toPublicationCard);
  },
  "related-publications",
  [TAG.publications, TAG.publicationCategories, TAG.media],
);

export const getPublicationsPage = cachedRead(async () => {
  const payload = await getPayloadClient();
  const page = await payload.findGlobal({ slug: "publications-page" });

  return {
    meta: page.meta,
    eyebrow: page.eyebrow,
    title: page.title,
    description: page.description ?? null,
  };
},
  "publications-page",
  [TAG.publicationsPage],
);

export const getPortfolioPage = cachedRead(async () => {
  const payload = await getPayloadClient();
  const page = await payload.findGlobal({ slug: "portfolio-page" });

  return {
    meta: page.meta,
    eyebrow: page.eyebrow,
    title: page.title,
    description: page.description ?? null,
  };
},
  "portfolio-page",
  [TAG.portfolioPage],
);

export const getPublicationCategories = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "publication-categories",
    sort: "order",
    limit: 0,
    depth: 0,
  });

  return docs.map((category) => ({
    slug: category.slug,
    name: category.name,
    color: category.color,
  }));
},
  "publication-categories",
  [TAG.publicationCategories],
);

export const getPublicationSlugs = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "publications",
    where: PUBLISHED,
    limit: 0,
    depth: 0,
    select: { slug: true },
  });

  return docs.map((doc) => doc.slug);
},
  "publication-slugs",
  [TAG.publications],
);

export const getPublication = cachedRead(async (slug: string) => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "publications",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
  });

  const publication = docs[0];
  if (!publication) return null;

  const file = typeof publication.file === "object" ? publication.file : null;
  const label = publication.actionLabel?.trim() || DEFAULT_ACTION_LABEL[publication.type];

  /**
   * A ação final da página. Artigo não tem — o texto já é o conteúdo. Download e
   * link externo só ganham botão quando o destino existe de fato, para nunca
   * renderizar um botão que não leva a lugar nenhum.
   */
  const target =
    publication.type === "download" ? (file?.url || publication.externalUrl) : publication.type === "external" ? publication.externalUrl : null;

  return {
    ...toPublicationCard(publication),
    meta: publication.meta,
    content: publication.content ?? null,
    action: target
      ? {
          label,
          href: target,
          isDownload: publication.type === "download" && Boolean(file?.url),
          fileSize: publication.type === "download" ? (file?.filesize ?? null) : null,
          fileType: publication.type === "download" ? (file?.mimeType ?? null) : null,
        }
      : null,
  };
},
  "publication",
  [TAG.publications, TAG.publicationCategories, TAG.media],
);

export const getTeam = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "team-members",
    where: PUBLISHED,
    sort: "order",
    limit: 0,
  });

  const toMember = (member: (typeof docs)[number]) => {
    const photo = resolveImage(member.photo) ?? IMAGE_FALLBACK;
    return {
      name: member.name,
      specialty: member.specialty,
      bio: member.bio ?? "",
      image: photo.src,
      imageAlt: photo.alt,
      blurDataURL: photo.blurDataURL,
    };
  };

  return {
    teamMembers: docs.filter((member) => member.group === "team").map(toMember),
    boardMembers: docs.filter((member) => member.group === "board").map(toMember),
  };
},
  "team",
  [TAG.team, TAG.media],
);

export const getPartners = cachedRead(async () => {
  const payload = await getPayloadClient();

  const [{ docs }, { docs: projects }] = await Promise.all([
    payload.find({ collection: "partners", where: PUBLISHED, sort: "order", limit: 0 }),
    // Só o campo necessário para saber quais clientes têm projeto — o carrossel não
    // precisa carregar o portfólio inteiro para montar um href.
    payload.find({
      collection: "projects",
      where: PUBLISHED,
      limit: 0,
      depth: 0,
      select: { partner: true },
    }),
  ]);

  const partnersWithProjects = new Set(
    projects
      .map((project) => (typeof project.partner === "string" ? project.partner : project.partner?.id))
      .filter((id): id is string => Boolean(id)),
  );

  return docs.filter((partner) => Boolean(resolveImage(partner.logo))).map((partner) => {
    const logo = resolveImage(partner.logo)!;

    /**
     * O logo sempre leva à listagem filtrada por aquele cliente, mesmo quando ele tem um
     * projeto só: quem clica num logo quer ver o que a Move fez com aquela organização,
     * e cair direto numa página de caso esconde que possam existir outros. Sem projeto
     * ligado, sobra o portfólio inteiro — melhor do que um link que não leva a nada.
     */
    const href = partnersWithProjects.has(partner.id)
      ? `/portfolio?cliente=${encodeURIComponent(clientKey(partner))}`
      : "/portfolio";

    // As dimensões seguem junto porque o carrossel dimensiona cada logo pela
    // proporção do arquivo — ver components/LogoLoop.tsx.
    return { name: partner.name, src: logo.src, href, width: logo.width, height: logo.height };
  });
},
  "partners",
  [TAG.partners, TAG.projects, TAG.media],
);

/**
 * Identificador do cliente na URL de /portfolio?cliente=…
 *
 * Prefere o slug do documento, mas cai para o nome normalizado quando ele não existe:
 * os parceiros carregados pelo seed antigo são anteriores ao campo `slug` e só o ganham
 * quando alguém abre e salva o documento no admin — obrigar a essa passagem para o logo
 * funcionar seria uma armadilha silenciosa. Como as duas pontas (o href do carrossel e o
 * `clientSlug` do card) passam por aqui, elas continuam batendo nos dois casos.
 */
const clientKey = (partner: { slug?: string | null; name: string }): string =>
  partner.slug?.trim() ||
  partner.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type ProjectCard = {
  slug: string;
  client: string;
  /** Logo do cliente — só existe quando o projeto tem um parceiro ligado. */
  logo: ResolvedImage | null;
  /** Slug do parceiro, que identifica o cliente em /portfolio?cliente=… */
  clientSlug: string | null;
  ecosystem: string;
  ecosystems: string[];
  service: string;
  services: string[];
  segment: string | null;
  segments: string[];
  year: string;
  summary: string;
  image: ResolvedImage;
  /**
   * Cor do card escolhida no CMS, ou "auto" para seguir o ecossistema. Chega crua
   * porque quem traduz nome de cor em classe é lib/palette.ts, do lado do componente.
   */
  cardColor: string;
};

/** Corta no espaço mais próximo para o card não terminar no meio de uma palavra. */
const excerpt = (text: string, max = 200) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[,;:.\s]+$/, "")}…`;
};

const toProjectCard = (project: Project): ProjectCard => {
  // `partner` só vem populado com depth ≥ 1; com depth 0 chega como id, e aí o card
  // simplesmente não mostra logo — que é o mesmo comportamento de quem não tem cliente.
  const partner = typeof project.partner === "object" ? project.partner : null;

  return {
    slug: project.slug,
    client: project.client,
    logo: partner ? resolveImage(partner.logo) : null,
    clientSlug: partner ? clientKey(partner) : null,
    ecosystem: taxonomyValues(project.ecosystems, project.ecosystem)[0] ?? "",
    ecosystems: taxonomyValues(project.ecosystems, project.ecosystem),
    service: taxonomyValues(project.services, project.service).join("; "),
    services: taxonomyValues(project.services, project.service),
    segment: taxonomyValues(project.segments, project.segment).join("; ") || null,
    segments: taxonomyValues(project.segments, project.segment),
    year: project.year,
    // O card precisa de algum texto; sem resumo próprio, o desafio é o melhor
    // substituto. A página do projeto não usa esse fallback — ver `intro` abaixo.
    summary: project.summary ?? excerpt(project.challenge),
    image: resolveImage(project.image) ?? IMAGE_FALLBACK,
    cardColor: project.cardColor ?? SURFACE_AUTO,
  };
};

export const getProjects = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: PUBLISHED,
    sort: "order",
    limit: 0,
  });

  return docs.map(toProjectCard);
},
  "projects",
  [TAG.projects, TAG.partners, TAG.media],
);

export const getProjectSlugs = cachedRead(async () => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: PUBLISHED,
    limit: 0,
    depth: 0,
    select: { slug: true },
  });

  return docs.map((doc) => doc.slug);
},
  "project-slugs",
  [TAG.projects],
);

export const getProject = cachedRead(async (slug: string) => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
  });

  const project = docs[0];
  if (!project) return null;

  return {
    ...toProjectCard(project),
    /**
     * Abertura da página: só o resumo escrito de propósito. Sem o fallback do card,
     * porque ali o Desafio aparece logo abaixo por extenso — repetir o mesmo
     * parágrafo duas vezes na mesma tela não informa nada.
     */
    meta: project.meta,
    intro: project.summary ?? null,
    challenge: project.challenge,
    results: project.results,
    description: project.description ?? null,
  };
},
  "project",
  [TAG.projects, TAG.partners, TAG.media],
);

/** Outros projetos do mesmo ecossistema, para o rodapé da página do projeto. */
export const getRelatedProjects = cachedRead(async (slug: string, ecosystems: string[], limit = 3) => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: {
      ...PUBLISHED,
      or: [
        { ecosystems: { in: ecosystems } },
        { and: [{ ecosystems: { exists: false } }, { ecosystem: { in: ecosystems } }] },
      ],
      slug: { not_equals: slug },
    },
    sort: "order",
    limit,
  });

  return docs.map(toProjectCard);
},
  "related-projects",
  [TAG.projects, TAG.partners, TAG.media],
);

export const getTheoryOfChange = cachedRead(async () => {
  const payload = await getPayloadClient();
  const theory = await payload.findGlobal({ slug: "theory-of-change" });
  const file = typeof theory.pdf?.file === "object" ? theory.pdf.file : null;

  return {
    meta: theory.meta,
    hero: theory.hero,
    frontsIntro: theory.frontsIntro,
    fronts: (theory.fronts ?? []).map((front, index) => ({
      number: displayNumber(index),
      label: front.label,
      description: front.description,
    })),
    activitiesIntro: theory.activitiesIntro,
    audiencesIntro: theory.audiencesIntro,
    /**
     * Guardadas do centro para fora, como no diagrama oficial. O componente dos anéis
     * é quem inverte para desenhar — o anel externo precisa ser pintado primeiro.
     */
    audiences: (theory.audiences ?? []).map((audience, index) => ({
      number: displayNumber(index),
      label: audience.label,
      // Opcional no CMS: o `null` do Payload vira ausência, que é como o componente lê.
      summary: audience.summary ?? undefined,
      description: audience.description,
    })),
    deliverablesIntro: theory.deliverablesIntro,
    deliverables: (theory.deliverables ?? []).map((item, index) => ({
      number: displayNumber(index),
      label: item.label,
    })),
    outcomesIntro: theory.outcomesIntro,
    outcomes: (theory.outcomes ?? []).map((item, index) => ({
      number: displayNumber(index),
      label: item.label,
    })),
    impact: theory.impact,
    pdf: {
      label: theory.pdf?.label ?? "",
      // O upload vence o caminho manual, mesma regra do resolveImage.
      href: file?.url ?? theory.pdf?.href ?? "",
    },
  };
},
  "theory-of-change",
  [TAG.theory, TAG.media],
);

export const getContactPage = cachedRead(async () => {
  const payload = await getPayloadClient();
  const page = await payload.findGlobal({ slug: "contact-page" });

  return {
    meta: page.meta,
    steps: (page.steps ?? []).map((step, index) => ({
      number: displayNumber(index),
      title: step.title,
      body: step.body,
    })),
    serviceOptions: (page.serviceOptions ?? []).map((service) => service.label),
    availabilityDays: (page.availabilityDays ?? []).map((day) => day.label),
    availabilityPeriods: (page.availabilityPeriods ?? []).map((period) => period.label),
    heroImage: resolveImage(page.heroImage) ?? IMAGE_FALLBACK,
    principles: (page.principles ?? []).map((principle) => ({
      title: principle.title,
      body: principle.body,
    })),
    contracted: (page.contracted ?? []).map((item) => item.label),
    received: (page.received ?? []).map((item) => item.label),
  };
},
  "contact-page",
  [TAG.contactPage, TAG.media],
);
