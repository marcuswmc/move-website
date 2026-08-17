/**
 * Migra o conteúdo que vivia em data/site.ts (e o que estava preso dentro de
 * componentes) para as collections e globals do Payload.
 *
 *   pnpm seed
 *
 * O script é idempotente por reset: apaga os documentos das collections que ele
 * mesmo popula e recria tudo. As mídias são reaproveitadas pelo nome do arquivo,
 * então rodar de novo não duplica upload nem quebra referências.
 *
 * ATENÇÃO: rodar depois que a Move já tiver editado conteúdo no admin sobrescreve
 * essas edições. Ele existe para a carga inicial.
 */
import path from "path";
import { fileURLToPath } from "url";

import config from "@payload-config";
import { getPayload } from "payload";
import type { Payload } from "payload";
import type { Project, Service } from "../payload-types";

import {
  affiliations,
  boardMembers,
  contact,
  contactAreas,
  contactSteps,
  contracted,
  deliverables,
  hero,
  metrics,
  navItems,
  portfolioCases,
  portfolioProjects,
  principles,
  publications,
  received,
  social,
  teamMembers,
  theoryOfChange,
  theoryPdf,
} from "../data/site";
import { images } from "../data/images";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

/**
 * Imagens dos cards de /portfolio. Estavam hardcoded no antigo ProjectsPortfolio,
 * que renderizava a esfera 3D — migram como URL externa porque é a fotografia que o
 * site exibia, e não a arte de categoria em public/projects.
 */
const projectSphereImages: Record<string, string> = {
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
  CAIXA: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=85",
};

/** Slug do parceiro, usado em /portfolio?cliente=… quando o cliente tem vários casos. */
const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Parceiros do carrossel da home, hardcoded em components/PartnerLogoLoop.tsx. */
const partners = [
  { name: "Instituto de Cidadania Empresarial", file: "instituto-cidadania-empresarial.webp" },
  { name: "GIFE", file: "gife.webp" },
  { name: "NOSSAS", file: "nossas.webp", caseId: "nossas" },
  { name: "AMAZ", file: "amaz.webp" },
  { name: "Instituto ACP", file: "instituto-acp.webp", caseId: "instituto-acp" },
  { name: "Fundo Vale", file: "fundo-vale.webp" },
  { name: "Itaú Social", file: "itau-social.webp", caseId: "itau-social" },
  { name: "Laudes Foundation", file: "laudes-foundation.webp" },
  { name: "Instituto Alana", file: "instituto-alana.webp", caseId: "instituto-alana" },
  { name: "Escolas Criativas", file: "escolas-criativas.webp", caseId: "escolas-criativas" },
];

const payload = await getPayload({ config });

/**
 * Na primeira execução o Mongo ainda está criando collections e índices, e uma
 * transação que esbarra nessa mudança de catálogo falha com WriteConflict /
 * TransientTransactionError. O próprio Mongo instrui a repetir a operação — é
 * exatamente o que este wrapper faz, com um respiro curto entre as tentativas.
 */
async function withRetry<T>(label: string, operation: () => Promise<T>, attempts = 5): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const candidate = error as { errorLabelSet?: Set<string>; code?: unknown };
      const transient =
        candidate?.errorLabelSet?.has("TransientTransactionError") === true ||
        candidate?.code === 112 ||
        candidate?.code === 251;

      if (!transient || attempt >= attempts) throw error;

      payload.logger.warn(`${label}: conflito transitório (tentativa ${attempt}), repetindo…`);
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }
}

/** Sobe um arquivo de public/ para a collection media, reaproveitando o que já existe. */
async function uploadLocalImage(client: Payload, relativePath: string, alt: string): Promise<string> {
  const filename = path.basename(relativePath);

  const existing = await client.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    pagination: false,
  });

  if (existing.docs[0]) return existing.docs[0].id;

  const created = await withRetry(`upload ${filename}`, () =>
    client.create({
      collection: "media",
      data: { alt },
      filePath: path.join(publicDir, relativePath),
    }),
  );

  return created.id;
}

const externalImage = (url: string, alt: string) => ({ externalUrl: url, alt });

/**
 * Taxonomia inicial das publicações, tirada do próprio vocabulário de entregas da
 * Move. É ponto de partida: o acervo do site antigo vai trazer a taxonomia real, e a
 * Move pode criar, renomear e recolorir categorias direto no admin.
 */
const publicationCategories = [
  { name: "Artigo", slug: "artigo", color: "purple" },
  { name: "Estudo", slug: "estudo", color: "green" },
  { name: "Avaliação", slug: "avaliacao", color: "coral" },
  { name: "Guia", slug: "guia", color: "sand" },
] as const;

payload.logger.info("Limpando as collections de conteúdo…");
for (const collection of [
  "projects",
  "services",
  "publications",
  "publication-categories",
  "team-members",
  "partners",
] as const) {
  // Numa base nova não há o que apagar, e disparar o delete aí é justamente o que
  // esbarra na criação das collections.
  const { totalDocs } = await payload.count({ collection });
  if (totalDocs === 0) continue;

  await withRetry(`limpeza de ${collection}`, () => payload.delete({ collection, where: {} }));
}

// -------------------------------------------------------------- Parceiros
// Vêm antes dos projetos: quem guarda a relação é o projeto (campo `partner`), então
// o parceiro precisa existir para o projeto poder apontar para ele.
payload.logger.info(`Migrando ${partners.length} parceiros…`);
const partnerIdByCaseId = new Map<string, string>();

for (const [index, partner] of partners.entries()) {
  const logoId = await uploadLocalImage(payload, `partners/${partner.file}`, `Logo ${partner.name}`);

  const created = await withRetry(`parceiro ${partner.name}`, () =>
    payload.create({
      collection: "partners",
      data: {
        name: partner.name,
        slug: slugify(partner.name),
        logo: { media: logoId, alt: `Logo ${partner.name}` },
        order: index,
        _status: "published",
      },
    }),
  );

  if (partner.caseId) partnerIdByCaseId.set(partner.caseId, created.id);
}

// ---------------------------------------------------------------- Projetos
payload.logger.info(`Migrando ${portfolioCases.length} projetos…`);

for (const [index, item] of portfolioCases.entries()) {
  await withRetry(`projeto ${item.client}`, () =>
    payload.create({
      collection: "projects",
      data: {
        client: item.client,
        slug: item.id.toLowerCase(),
        partner: partnerIdByCaseId.get(item.id) ?? null,
        ecosystem: item.ecosystem as Project["ecosystem"],
        service: item.service,
        year: item.year,
        // `summary` e `segment` ficam vazios de propósito: não existem em
        // data/site.ts, e inventar copy para 15 projetos não é decisão do seed.
        // Sem resumo, o card cai no começo do Desafio (ver lib/content.ts).
        challenge: item.challenge,
        results: item.results,
        image: externalImage(projectSphereImages[item.id] ?? item.image, `Imagem do projeto ${item.client}`),
        order: index,
        _status: "published",
      },
    }),
  );
}

// ---------------------------------------------------------------- Serviços
payload.logger.info(`Migrando ${deliverables.length} serviços…`);
for (const [index, item] of deliverables.entries()) {
  await withRetry(`serviço ${item.title}`, () =>
    payload.create({
      collection: "services",
      data: {
        title: item.title,
        body: item.body,
        // deliverables.icon é `string` na origem; o select do CMS é um union fechado.
        icon: item.icon as Service["icon"],
        order: index,
        _status: "published",
      },
    }),
  );
}

// ------------------------------------------ Categorias de publicação
payload.logger.info(`Criando ${publicationCategories.length} categorias de publicação…`);
const categoryIdByName = new Map<string, string>();

for (const [index, category] of publicationCategories.entries()) {
  const created = await withRetry(`categoria ${category.name}`, () =>
    payload.create({
      collection: "publication-categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        order: index,
      },
    }),
  );

  categoryIdByName.set(category.name, created.id);
}

// ------------------------------------------------------------ Publicações
payload.logger.info(`Migrando ${publications.length} publicações…`);
for (const [index, item] of publications.entries()) {
  // As 3 entradas de data/site.ts são placeholders aguardando o acervo real; entram
  // como artigo, com datas decrescentes para a ordenação do blog fazer sentido.
  const publishedAt = new Date(Date.UTC(2026, 6, 20 - index * 11)).toISOString();
  const categoryName = publicationCategories[index % publicationCategories.length].name;
  const categoryId = categoryIdByName.get(categoryName);

  await withRetry(`publicação ${item.id}`, () =>
    payload.create({
      collection: "publications",
      data: {
        title: item.title,
        slug: item.id,
        synopsis: item.synopsis,
        cover: externalImage(item.cover.src, item.cover.alt),
        type: "article",
        publishedAt,
        author: "Move Social",
        categories: categoryId ? [categoryId] : [],
        featured: true,
        _status: "published",
      },
    }),
  );
}

// ------------------------------------------------------- Conselho e equipe
// Uma collection só, separada pelo campo `group`: o conselho vira a galeria em
// accordion da home e a equipe vira o carrossel.
const people = [
  ...boardMembers.map((member) => ({ ...member, group: "board" as const })),
  ...teamMembers.map((member) => ({ ...member, group: "team" as const })),
];

payload.logger.info(`Migrando ${people.length} pessoas…`);
for (const [index, member] of people.entries()) {
  const photoId = await uploadLocalImage(payload, member.image.replace(/^\//, ""), member.imageAlt);

  await withRetry(`pessoa ${member.name}`, () =>
    payload.create({
      collection: "team-members",
      data: {
        name: member.name,
        specialty: member.specialty,
        bio: member.bio,
        photo: { media: photoId, alt: member.imageAlt },
        group: member.group,
        order: index,
        _status: "published",
      },
    }),
  );
}

// ----------------------------------------------------------------- Globals
payload.logger.info("Migrando os globals…");

await withRetry("global site-settings", () =>
  payload.updateGlobal({
    slug: "site-settings",
    data: {
      nav: navItems.map((item) => ({ label: item.label, href: item.href })),
      contact: {
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
      },
      social: {
        instagram: social.instagram,
        linkedin: social.linkedin,
      },
      metrics: metrics.map((metric) => ({ value: metric.value, label: metric.label })),
    },
  }),
);

await withRetry("global home", () =>
  payload.updateGlobal({
    slug: "home",
    data: {
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        body: hero.body,
      },
      affiliations: affiliations.map((item) => ({ label: item.label })),
      showcase: portfolioProjects.map((project) => ({
        client: project.client,
        category: project.category,
        title: project.title,
        description: project.description,
        image: externalImage(project.image, project.imageAlt),
        tone: project.tone as "purple" | "light" | "yellow",
      })),
    },
  }),
);

// A copy de abertura das duas listagens. Não vem de data/site.ts porque essas
// páginas não existiam antes — nasceram já como conteúdo de CMS.
await withRetry("global portfolio-page", () =>
  payload.updateGlobal({
    slug: "portfolio-page",
    data: {
      eyebrow: "Portfólio",
      title: "Projetos que ampliam o impacto.",
      description:
        "Ao longo da nossa trajetória, apoiamos centenas de organizações a qualificar e ampliar o impacto socioambiental positivo de suas ações.",
    },
  }),
);

await withRetry("global publications-page", () =>
  payload.updateGlobal({
    slug: "publications-page",
    data: {
      eyebrow: "Publicações",
      title: "Conhecimento que volta para o campo.",
      description:
        "Artigos, estudos e sistematizações produzidos a partir do que aprendemos em cada parceria — para ampliar o diálogo público sobre impacto socioambiental.",
    },
  }),
);

await withRetry("global theory-of-change", () =>
  payload.updateGlobal({
    slug: "theory-of-change",
    data: {
      hero: theoryOfChange.hero,
      frontsIntro: theoryOfChange.fronts.intro,
      fronts: theoryOfChange.fronts.items,
      activitiesIntro: theoryOfChange.activitiesIntro,
      audiencesIntro: theoryOfChange.audiences.intro,
      audiences: theoryOfChange.audiences.items,
      deliverablesIntro: theoryOfChange.deliverables.intro,
      deliverables: theoryOfChange.deliverables.items.map((label) => ({ label })),
      outcomesIntro: theoryOfChange.outcomes.intro,
      outcomes: theoryOfChange.outcomes.items.map((label) => ({ label })),
      impact: theoryOfChange.impact,
      pdf: {
        label: theoryPdf.label,
        href: theoryPdf.href,
      },
    },
  }),
);

await withRetry("global contact-page", () =>
  payload.updateGlobal({
    slug: "contact-page",
    data: {
      steps: contactSteps.map((step) => ({ title: step.title, body: step.body })),
      areas: contactAreas.map((label) => ({ label })),
      heroImage: externalImage(images.contactHero.src, images.contactHero.alt),
      principles: principles.map((principle) => ({ title: principle.title, body: principle.body })),
      contracted: contracted.map((label) => ({ label })),
      received: received.map((label) => ({ label })),
    },
  }),
);

payload.logger.info("Migração concluída.");
process.exit(0);
