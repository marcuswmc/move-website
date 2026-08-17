import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateDescription, GenerateTitle } from "@payloadcms/plugin-seo/types";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { pt } from "@payloadcms/translations/languages/pt";
import path from "path";
import { buildConfig } from "payload";
import type { SharpDependency } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Media } from "@/collections/Media";
import { Partners } from "@/collections/Partners";
import { Projects } from "@/collections/Projects";
import { PublicationCategories } from "@/collections/PublicationCategories";
import { Publications } from "@/collections/Publications";
import { Services } from "@/collections/Services";
import { TeamMembers } from "@/collections/TeamMembers";
import { Users } from "@/collections/Users";
import { ContactPage } from "@/globals/ContactPage";
import { Home } from "@/globals/Home";
import { PortfolioPage } from "@/globals/PortfolioPage";
import { PublicationsPage } from "@/globals/PublicationsPage";
import { SiteSettings } from "@/globals/SiteSettings";
import { TheoryOfChange } from "@/globals/TheoryOfChange";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_NAME = "Move Social";

/**
 * Sugestões para os botões "gerar" do painel de SEO. Não sobrescrevem nada: o
 * plugin só usa esses valores quando alguém clica em gerar, então o texto escrito
 * à mão sempre vence. A ideia é que uma publicação nova já tenha um título e uma
 * descrição decentes sem exigir trabalho extra de quem publica.
 */
const generateTitle: GenerateTitle = ({ doc, collectionSlug }) => {
  const record = doc as Record<string, unknown>;
  const name = (record.client ?? record.title) as string | undefined;

  if (!name) return SITE_NAME;
  if (collectionSlug === "projects") return `${name} · Portfólio | ${SITE_NAME}`;
  return `${name} | ${SITE_NAME}`;
};

const generateDescription: GenerateDescription = ({ doc }) => {
  const record = doc as Record<string, unknown>;
  // Ordem de preferência: o resumo escrito para o card, depois a sinopse, depois
  // o texto de apoio da página. O desafio entra por último, como último recurso.
  const candidate = [record.summary, record.synopsis, record.description, record.challenge].find(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  return candidate?.slice(0, 160) ?? "";
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · Move Social",
    },
  },
  collections: [Projects, Services, Publications, PublicationCategories, TeamMembers, Partners, Media, Users],
  globals: [Home, TheoryOfChange, PublicationsPage, PortfolioPage, ContactPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  // O .d.ts do Payload carrega uma cópia própria dos tipos do sharp, cujas
  // sobrecargas não batem com as do sharp 0.34 instalado. É divergência só de
  // tipagem — em runtime é exatamente a função que o Payload espera chamar.
  sharp: sharp as unknown as SharpDependency,
  // Todo o conteúdo do site é pt-BR (ver CLAUDE.md), então o painel também.
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: "pt",
  },
  plugins: [
    seoPlugin({
      collections: ["projects", "publications"],
      globals: ["home", "theory-of-change", "publications-page", "portfolio-page", "contact-page"],
      uploadsCollection: "media",
      tabbedUI: true,
      // Os geradores preenchem o campo com um clique quando ele está vazio — a
      // Move só escreve algo próprio onde o texto automático não serve.
      generateTitle,
      generateDescription,
    }),
  ],
});
